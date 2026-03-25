import Event from '#models/event.model.js';
import Group from '#models/group.model.js';

const GROUP_MEMBER_POPULATE = {
    path: 'members.user_id',
    select: 'username nickname email'
};

const toIdString = (value) => {
    if (!value) {
        return '';
    }

    if (typeof value === 'object' && '_id' in value) {
        return value._id.toString();
    }

    return value.toString();
};

const roundCurrencyValue = (value) => {
    const numericValue = Number(value || 0);

    if (!Number.isFinite(numericValue) || numericValue < 0) {
        throw new Error('Tổng chi phí phải là số không âm');
    }

    return Math.round(numericValue);
};

const buildMemberDirectory = (group) => {
    return new Map(group.members.map((member) => {
        const user = member.user_id;
        const userId = toIdString(user);

        return [userId, {
            userId,
            username: user?.username || '',
            nickname: user?.nickname || '',
            email: user?.email || '',
            role: member.role,
            joinedAt: member.joinedAt
        }];
    }));
};

const getMembership = (group, userId) => {
    return group.members.find((member) => toIdString(member.user_id) === userId.toString()) || null;
};

const ensureMember = (group, userId) => {
    const membership = getMembership(group, userId);

    if (!membership) {
        throw new Error('Bạn không phải thành viên của nhóm này');
    }

    return membership;
};

const ensureAdmin = (group, userId) => {
    const membership = ensureMember(group, userId);

    if (membership.role !== 'admin') {
        throw new Error('Chỉ trưởng nhóm mới có quyền thực hiện thao tác này');
    }

    return membership;
};

const normalizeScheduleOptions = (options = []) => {
    const normalized = options
        .map((option) => ({
            label: typeof option?.label === 'string' ? option.label.trim() : '',
            startAt: option?.startAt ? new Date(option.startAt) : null,
            endAt: option?.endAt ? new Date(option.endAt) : null
        }))
        .filter((option) => option.label);

    if (normalized.length === 0) {
        throw new Error('Cần ít nhất một lựa chọn khung giờ');
    }

    normalized.forEach((option) => {
        if ((option.startAt && Number.isNaN(option.startAt.getTime()))
            || (option.endAt && Number.isNaN(option.endAt.getTime()))) {
            throw new Error('Khung giờ không hợp lệ');
        }
    });

    return normalized;
};

const normalizeLocationOptions = (options = []) => {
    const normalized = options
        .map((option) => ({
            label: typeof option?.label === 'string' ? option.label.trim() : '',
            address: typeof option?.address === 'string' ? option.address.trim() : ''
        }))
        .filter((option) => option.label);

    if (normalized.length === 0) {
        throw new Error('Cần ít nhất một lựa chọn địa điểm');
    }

    return normalized;
};

const normalizeCourtOptions = (options = []) => {
    const normalized = options
        .map((option) => {
            const courtCount = Number(option?.courtCount);
            const label = typeof option?.label === 'string' && option.label.trim()
                ? option.label.trim()
                : `${courtCount} sân`;

            return {
                label,
                courtCount
            };
        })
        .filter((option) => Number.isInteger(option.courtCount) && option.courtCount > 0);

    if (normalized.length === 0) {
        throw new Error('Cần ít nhất một lựa chọn số sân');
    }

    return normalized;
};

const recalculateSplitAmounts = (event) => {
    const items = event.payment?.items || [];
    const totalCost = roundCurrencyValue(event.payment?.totalCost || 0);

    if (items.length === 0) {
        return;
    }

    const baseAmount = Math.floor(totalCost / items.length);
    let remainder = totalCost - (baseAmount * items.length);

    items.forEach((item) => {
        item.amount = baseAmount + (remainder > 0 ? 1 : 0);
        item.updatedAt = new Date();

        if (remainder > 0) {
            remainder -= 1;
        }
    });
};

const syncPaymentItems = (event, group) => {
    if (!event.payment) {
        event.payment = { totalCost: 0, note: '', items: [] };
    }

    if (!Array.isArray(event.payment.items)) {
        event.payment.items = [];
    }

    const existingIds = new Set(event.payment.items.map((item) => toIdString(item.user_id)));
    let isChanged = false;

    group.members.forEach((member) => {
        const memberId = toIdString(member.user_id);

        if (!existingIds.has(memberId)) {
            event.payment.items.push({
                user_id: member.user_id,
                amount: 0,
                isPaid: false,
                paidAt: null,
                updatedAt: new Date()
            });
            isChanged = true;
        }
    });

    if (isChanged) {
        recalculateSplitAmounts(event);
    }

    return isChanged;
};

const clearExistingVote = (options, userId) => {
    options.forEach((option) => {
        option.voters = option.voters.filter((voterId) => voterId.toString() !== userId.toString());
    });
};

const findOptionById = (options, optionId) => {
    if (!optionId) {
        return null;
    }

    return options.find((option) => option._id.toString() === optionId.toString()) || null;
};

const getWinningOption = (options, explicitOptionId = null) => {
    if (explicitOptionId) {
        const explicitOption = findOptionById(options, explicitOptionId);

        if (!explicitOption) {
            throw new Error('Lựa chọn được chốt không hợp lệ');
        }

        return explicitOption;
    }

    const sortedOptions = [...options].sort((firstOption, secondOption) => {
        const voteDifference = secondOption.voters.length - firstOption.voters.length;

        if (voteDifference !== 0) {
            return voteDifference;
        }

        return firstOption._id.toString().localeCompare(secondOption._id.toString());
    });

    return sortedOptions[0] || null;
};

const formatScheduleOption = (option, myVote) => ({
    _id: option._id.toString(),
    label: option.label,
    startAt: option.startAt,
    endAt: option.endAt,
    voteCount: option.voters.length,
    isMyChoice: myVote?.scheduleOptionId?.toString() === option._id.toString()
});

const formatLocationOption = (option, myVote) => ({
    _id: option._id.toString(),
    label: option.label,
    address: option.address,
    voteCount: option.voters.length,
    isMyChoice: myVote?.locationOptionId?.toString() === option._id.toString()
});

const formatCourtOption = (option, myVote) => ({
    _id: option._id.toString(),
    label: option.label,
    courtCount: option.courtCount,
    voteCount: option.voters.length,
    isMyChoice: myVote?.courtOptionId?.toString() === option._id.toString()
});

const serializeEvent = (event, group, userId) => {
    const membership = getMembership(group, userId);
    const myVote = event.votes.find((vote) => vote.user_id.toString() === userId.toString()) || null;
    const memberDirectory = buildMemberDirectory(group);
    const finalSchedule = event.finalSelection?.scheduleOptionId
        ? findOptionById(event.scheduleOptions, event.finalSelection.scheduleOptionId)
        : null;
    const finalLocation = event.finalSelection?.locationOptionId
        ? findOptionById(event.locationOptions, event.finalSelection.locationOptionId)
        : null;
    const finalCourt = event.finalSelection?.courtOptionId
        ? findOptionById(event.courtOptions, event.finalSelection.courtOptionId)
        : null;

    const paymentItems = (event.payment?.items || []).map((item) => {
        const member = memberDirectory.get(toIdString(item.user_id));

        return {
            userId: toIdString(item.user_id),
            nickname: member?.nickname || member?.username || 'Thành viên',
            username: member?.username || '',
            email: member?.email || '',
            amount: item.amount || 0,
            isPaid: Boolean(item.isPaid),
            paidAt: item.paidAt || null
        };
    }).sort((firstItem, secondItem) => Number(firstItem.isPaid) - Number(secondItem.isPaid));

    return {
        _id: event._id.toString(),
        title: event.title,
        description: event.description || '',
        status: event.status,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        memberCount: group.members.length,
        totalVotes: event.votes.length,
        myVote: myVote ? {
            scheduleOptionId: myVote.scheduleOptionId.toString(),
            locationOptionId: myVote.locationOptionId.toString(),
            courtOptionId: myVote.courtOptionId.toString(),
            note: myVote.note || '',
            votedAt: myVote.votedAt
        } : null,
        scheduleOptions: event.scheduleOptions.map((option) => formatScheduleOption(option, myVote)),
        locationOptions: event.locationOptions.map((option) => formatLocationOption(option, myVote)),
        courtOptions: event.courtOptions.map((option) => formatCourtOption(option, myVote)),
        finalSelection: finalSchedule && finalLocation && finalCourt ? {
            scheduleOptionId: finalSchedule._id.toString(),
            locationOptionId: finalLocation._id.toString(),
            courtOptionId: finalCourt._id.toString(),
            scheduleLabel: finalSchedule.label,
            locationLabel: finalLocation.label,
            locationAddress: finalLocation.address || '',
            courtLabel: finalCourt.label,
            courtCount: finalCourt.courtCount,
            lockedAt: event.finalSelection.lockedAt,
            lockedBy: toIdString(event.finalSelection.lockedBy)
        } : null,
        payment: {
            totalCost: event.payment?.totalCost || 0,
            note: event.payment?.note || '',
            paidCount: paymentItems.filter((item) => item.isPaid).length,
            pendingCount: paymentItems.filter((item) => !item.isPaid).length,
            items: paymentItems
        },
        permissions: {
            canManage: membership?.role === 'admin'
        }
    };
};

const loadWorkspaceGroup = async (groupId) => {
    return Group.findById(groupId).populate(GROUP_MEMBER_POPULATE);
};

const loadEventForGroup = async (groupId, eventId) => {
    return Event.findOne({
        _id: eventId,
        group_id: groupId
    });
};

const getActiveEvent = async (groupId) => {
    let event = await Event.findOne({
        group_id: groupId,
        status: { $ne: 'completed' }
    }).sort({ createdAt: -1 });

    if (!event) {
        event = await Event.findOne({ group_id: groupId }).sort({ createdAt: -1 });
    }

    return event;
};

const getGroupWorkspace = async (userId, groupId) => {
    const group = await loadWorkspaceGroup(groupId);

    if (!group) {
        throw new Error('Nhóm không tồn tại');
    }

    const membership = ensureMember(group, userId);
    const event = await getActiveEvent(groupId);

    if (event && syncPaymentItems(event, group)) {
        await event.save();
    }

    return {
        group: {
            _id: group._id.toString(),
            name: group.name,
            description: group.description || '',
            avatar: group.avatar || '',
            creator_id: toIdString(group.creator_id),
            maxMembers: group.maxMembers,
            memberCount: group.members.length,
            myRole: membership.role,
            members: group.members.map((member) => ({
                userId: toIdString(member.user_id),
                nickname: member.user_id?.nickname || member.user_id?.username || 'Thành viên',
                username: member.user_id?.username || '',
                email: member.user_id?.email || '',
                role: member.role,
                joinedAt: member.joinedAt
            }))
        },
        activeEvent: event ? serializeEvent(event, group, userId) : null
    };
};

const createGroupEvent = async (adminId, groupId, payload) => {
    const group = await loadWorkspaceGroup(groupId);

    if (!group) {
        throw new Error('Nhóm không tồn tại');
    }

    ensureAdmin(group, adminId);

    const existingVotingEvent = await Event.findOne({
        group_id: groupId,
        status: 'voting'
    });

    if (existingVotingEvent) {
        throw new Error('Nhóm đang có một phiên vote khác chưa được chốt');
    }

    const event = await Event.create({
        group_id: groupId,
        title: (payload?.title || '').trim() || 'Kèo mới của nhóm',
        description: (payload?.description || '').trim(),
        scheduleOptions: normalizeScheduleOptions(payload?.scheduleOptions),
        locationOptions: normalizeLocationOptions(payload?.locationOptions),
        courtOptions: normalizeCourtOptions(payload?.courtOptions),
        payment: {
            totalCost: roundCurrencyValue(payload?.totalCost || 0),
            note: typeof payload?.paymentNote === 'string' ? payload.paymentNote.trim() : '',
            items: group.members.map((member) => ({
                user_id: member.user_id,
                amount: 0,
                isPaid: false,
                paidAt: null,
                updatedAt: new Date()
            }))
        }
    });

    recalculateSplitAmounts(event);
    await event.save();

    return getGroupWorkspace(adminId, groupId);
};

const submitVote = async (userId, groupId, eventId, payload) => {
    const group = await loadWorkspaceGroup(groupId);

    if (!group) {
        throw new Error('Nhóm không tồn tại');
    }

    ensureMember(group, userId);

    const event = await loadEventForGroup(groupId, eventId);

    if (!event) {
        throw new Error('Buổi chơi không tồn tại');
    }

    if (event.status !== 'voting') {
        throw new Error('Phiên vote này đã được chốt');
    }

    const scheduleOption = findOptionById(event.scheduleOptions, payload?.scheduleOptionId);
    const locationOption = findOptionById(event.locationOptions, payload?.locationOptionId);
    const courtOption = findOptionById(event.courtOptions, payload?.courtOptionId);

    if (!scheduleOption || !locationOption || !courtOption) {
        throw new Error('Phiếu bầu không hợp lệ');
    }

    clearExistingVote(event.scheduleOptions, userId);
    clearExistingVote(event.locationOptions, userId);
    clearExistingVote(event.courtOptions, userId);

    scheduleOption.voters.push(userId);
    locationOption.voters.push(userId);
    courtOption.voters.push(userId);

    const existingVoteIndex = event.votes.findIndex((vote) => vote.user_id.toString() === userId.toString());

    if (existingVoteIndex >= 0) {
        event.votes[existingVoteIndex] = {
            user_id: userId,
            scheduleOptionId: scheduleOption._id,
            locationOptionId: locationOption._id,
            courtOptionId: courtOption._id,
            note: typeof payload?.note === 'string' ? payload.note.trim() : '',
            votedAt: new Date()
        };
    } else {
        event.votes.push({
            user_id: userId,
            scheduleOptionId: scheduleOption._id,
            locationOptionId: locationOption._id,
            courtOptionId: courtOption._id,
            note: typeof payload?.note === 'string' ? payload.note.trim() : '',
            votedAt: new Date()
        });
    }

    await event.save();
    return getGroupWorkspace(userId, groupId);
};

const lockEvent = async (adminId, groupId, eventId, payload = {}) => {
    const group = await loadWorkspaceGroup(groupId);

    if (!group) {
        throw new Error('Nhóm không tồn tại');
    }

    ensureAdmin(group, adminId);

    const event = await loadEventForGroup(groupId, eventId);

    if (!event) {
        throw new Error('Buổi chơi không tồn tại');
    }

    if (event.status !== 'voting') {
        throw new Error('Phiên vote này đã được chốt trước đó');
    }

    const finalSchedule = getWinningOption(event.scheduleOptions, payload?.scheduleOptionId);
    const finalLocation = getWinningOption(event.locationOptions, payload?.locationOptionId);
    const finalCourt = getWinningOption(event.courtOptions, payload?.courtOptionId);

    if (!finalSchedule || !finalLocation || !finalCourt) {
        throw new Error('Không thể chốt buổi chơi khi dữ liệu lựa chọn chưa đầy đủ');
    }

    event.status = 'locked';
    event.finalSelection = {
        scheduleOptionId: finalSchedule._id,
        locationOptionId: finalLocation._id,
        courtOptionId: finalCourt._id,
        lockedBy: adminId,
        lockedAt: new Date()
    };

    syncPaymentItems(event, group);
    recalculateSplitAmounts(event);

    await event.save();
    return getGroupWorkspace(adminId, groupId);
};

const updatePayment = async (adminId, groupId, eventId, payload) => {
    const group = await loadWorkspaceGroup(groupId);

    if (!group) {
        throw new Error('Nhóm không tồn tại');
    }

    ensureAdmin(group, adminId);

    const event = await loadEventForGroup(groupId, eventId);

    if (!event) {
        throw new Error('Buổi chơi không tồn tại');
    }

    syncPaymentItems(event, group);
    event.payment.totalCost = roundCurrencyValue(payload?.totalCost || 0);
    event.payment.note = typeof payload?.note === 'string' ? payload.note.trim() : '';
    recalculateSplitAmounts(event);

    await event.save();
    return getGroupWorkspace(adminId, groupId);
};

const togglePaymentStatus = async (adminId, groupId, eventId, memberUserId, payload = {}) => {
    const group = await loadWorkspaceGroup(groupId);

    if (!group) {
        throw new Error('Nhóm không tồn tại');
    }

    ensureAdmin(group, adminId);

    const event = await loadEventForGroup(groupId, eventId);

    if (!event) {
        throw new Error('Buổi chơi không tồn tại');
    }

    syncPaymentItems(event, group);

    const paymentItem = event.payment.items.find((item) => toIdString(item.user_id) === memberUserId.toString());

    if (!paymentItem) {
        throw new Error('Không tìm thấy thành viên trong danh sách thanh toán');
    }

    const nextPaidStatus = typeof payload?.isPaid === 'boolean'
        ? payload.isPaid
        : !paymentItem.isPaid;

    paymentItem.isPaid = nextPaidStatus;
    paymentItem.paidAt = nextPaidStatus ? new Date() : null;
    paymentItem.updatedAt = new Date();

    await event.save();
    return getGroupWorkspace(adminId, groupId);
};

const completeEvent = async (adminId, groupId, eventId) => {
    const group = await loadWorkspaceGroup(groupId);

    if (!group) {
        throw new Error('Nhóm không tồn tại');
    }

    ensureAdmin(group, adminId);

    const event = await loadEventForGroup(groupId, eventId);

    if (!event) {
        throw new Error('Buổi chơi không tồn tại');
    }

    event.status = 'completed';
    await event.save();

    return getGroupWorkspace(adminId, groupId);
};

export default {
    getGroupWorkspace,
    createGroupEvent,
    submitVote,
    lockEvent,
    updatePayment,
    togglePaymentStatus,
    completeEvent
};
