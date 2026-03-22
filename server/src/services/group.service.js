import Group from '#models/group.model.js';

const PENDING_REQUEST_POPULATE = {
    path: 'pending_requests.user_id',
    select: 'username nickname email'
};

const toIdString = (value) => {
    if (!value) return '';

    if (typeof value === 'object' && '_id' in value) {
        return value._id.toString();
    }

    return value.toString();
};

const mapPendingUser = (value) => {
    if (!value || typeof value !== 'object' || !('username' in value)) {
        return null;
    }

    return {
        _id: value._id.toString(),
        username: value.username,
        nickname: value.nickname,
        email: value.email
    };
};

const serializeGroup = (group, userId) => {
    const data = group.toObject();
    const myMembership = data.members.find((member) => toIdString(member.user_id) === userId.toString());

    return {
        _id: data._id.toString(),
        name: data.name,
        description: data.description || '',
        avatar: data.avatar || '',
        creator_id: toIdString(data.creator_id),
        maxMembers: data.maxMembers,
        members: data.members.map((member) => ({
            user_id: toIdString(member.user_id),
            role: member.role,
            joinedAt: member.joinedAt
        })),
        memberCount: data.members.length,
        myRole: myMembership?.role || null,
        hasPendingRequest: data.pending_requests.some(
            (request) => toIdString(request.user_id) === userId.toString()
        ),
        pendingRequests: data.pending_requests.map((request) => ({
            _id: request._id?.toString() || '',
            userId: toIdString(request.user_id),
            user: mapPendingUser(request.user_id),
            message: request.message || '',
            requestedAt: request.requestedAt
        }))
    };
};

const createGroup = async (userId, groupData) => {
    const group = await Group.create({
        ...groupData,
        creator_id: userId,
        members: [{
            user_id: userId,
            role: 'admin'
        }]
    });

    return group;
};

const getMyGroups = async (userId) => {
    const groups = await Group.find({
        'members.user_id': userId
    })
        .populate(PENDING_REQUEST_POPULATE)
        .sort({ _id: -1 });

    return groups.map((group) => serializeGroup(group, userId));
};

const getDiscoverGroups = async (userId) => {
    const groups = await Group.find({
        members: {
            $not: {
                $elemMatch: {
                    user_id: userId
                }
            }
        }
    }).sort({ _id: -1 });

    return groups.map((group) => serializeGroup(group, userId));
};

const updateGroup = async (userId, groupId, groupData) => {
    const group = await Group.findById(groupId);

    if (!group) {
        throw new Error('Nhóm không tồn tại');
    }

    if (group.creator_id.toString() !== userId.toString()) {
        throw new Error('Bạn chỉ có thể chỉnh sửa nhóm do mình tạo');
    }

    if (groupData.maxMembers && groupData.maxMembers < group.members.length) {
        throw new Error('Số lượng thành viên tối đa không được nhỏ hơn số thành viên hiện tại');
    }

    group.name = groupData.name ?? group.name;
    group.description = groupData.description ?? group.description;
    group.avatar = groupData.avatar ?? group.avatar;
    group.maxMembers = groupData.maxMembers ?? group.maxMembers;

    await group.save();
    return group;
};

const requestJoin = async (userId, groupId, message) => {
    const group = await Group.findById(groupId);

    if (!group) {
        throw new Error('Nhóm không tồn tại');
    }

    if (group.members.length >= group.maxMembers) {
        throw new Error('Nhóm đã đủ số lượng thành viên');
    }

    const isMember = group.members.some(
        (member) => member.user_id.toString() === userId.toString()
    );

    if (isMember) {
        throw new Error('Bạn đã là thành viên của nhóm này');
    }

    const hasPending = group.pending_requests.some(
        (request) => request.user_id.toString() === userId.toString()
    );

    if (hasPending) {
        throw new Error('Bạn đã gửi yêu cầu rồi, vui lòng chờ duyệt');
    }

    group.pending_requests.push({
        user_id: userId,
        message: message || ''
    });

    await group.save();
    return group;
};

const acceptRequest = async (adminId, groupId, requestUserId) => {
    const group = await Group.findById(groupId);

    if (!group) {
        throw new Error('Nhóm không tồn tại');
    }

    const isAdmin = group.members.some(
        (member) => member.user_id.toString() === adminId.toString() && member.role === 'admin'
    );

    if (!isAdmin) {
        throw new Error('Bạn không có quyền duyệt yêu cầu');
    }

    if (group.members.length >= group.maxMembers) {
        throw new Error('Nhóm đã đủ số lượng thành viên');
    }

    const isAlreadyMember = group.members.some(
        (member) => member.user_id.toString() === requestUserId.toString()
    );

    if (isAlreadyMember) {
        throw new Error('Người dùng này đã là thành viên của nhóm');
    }

    const requestIndex = group.pending_requests.findIndex(
        (request) => request.user_id.toString() === requestUserId.toString()
    );

    if (requestIndex === -1) {
        throw new Error('Không tìm thấy yêu cầu này');
    }

    group.pending_requests.splice(requestIndex, 1);
    group.members.push({
        user_id: requestUserId,
        role: 'member'
    });

    await group.save();
    return group;
};

const rejectRequest = async (adminId, groupId, requestUserId) => {
    const group = await Group.findById(groupId);

    if (!group) {
        throw new Error('Nhóm không tồn tại');
    }

    const isAdmin = group.members.some(
        (member) => member.user_id.toString() === adminId.toString() && member.role === 'admin'
    );

    if (!isAdmin) {
        throw new Error('Bạn không có quyền duyệt yêu cầu');
    }

    const requestIndex = group.pending_requests.findIndex(
        (request) => request.user_id.toString() === requestUserId.toString()
    );

    if (requestIndex === -1) {
        throw new Error('Không tìm thấy yêu cầu này');
    }

    group.pending_requests.splice(requestIndex, 1);

    await group.save();
    return group;
};

const deleteGroup = async (userId, groupId) => {
    const group = await Group.findById(groupId);

    if (!group) {
        throw new Error('Nhóm không tồn tại');
    }

    if (group.creator_id.toString() !== userId.toString()) {
        throw new Error('Bạn chỉ có thể xóa nhóm do mình tạo');
    }

    await Group.findByIdAndDelete(groupId);
    return group;
};

export default {
    createGroup,
    getMyGroups,
    getDiscoverGroups,
    updateGroup,
    requestJoin,
    acceptRequest,
    rejectRequest,
    deleteGroup,
};
