import Group from '#models/group.model.js';

// 1. Tạo nhóm mới
const createGroup = async (userId, groupData) => {
    const group = await Group.create({
        ...groupData,
        creator_id: userId,
        // Người tạo nhóm tự động là admin
        members: [{
            user_id: userId,
            role: 'admin'
        }]
    });

    return group;
};

// 2. Xin vào nhóm
const requestJoin = async (userId, groupId, message) => {
    const group = await Group.findById(groupId);

    if (!group) {
        throw new Error('Nhóm không tồn tại');
    }

    // Kiểm tra đã là thành viên chưa
    const isMember = group.members.some(
        m => m.user_id.toString() === userId.toString()
    );
    if (isMember) {
        throw new Error('Bạn đã là thành viên của nhóm này');
    }

    // Kiểm tra đã gửi yêu cầu chưa
    const hasPending = group.pending_requests.some(
        r => r.user_id.toString() === userId.toString()
    );
    if (hasPending) {
        throw new Error('Bạn đã gửi yêu cầu rồi, vui lòng chờ duyệt');
    }

    // Thêm vào danh sách chờ
    group.pending_requests.push({
        user_id: userId,
        message: message || ''
    });

    await group.save();
    return group;
};

// 3. Chấp nhận yêu cầu vào nhóm
const acceptRequest = async (adminId, groupId, requestUserId) => {
    const group = await Group.findById(groupId);

    if (!group) {
        throw new Error('Nhóm không tồn tại');
    }

    // Kiểm tra quyền admin
    const isAdmin = group.members.some(
        m => m.user_id.toString() === adminId.toString() && m.role === 'admin'
    );
    if (!isAdmin) {
        throw new Error('Bạn không có quyền duyệt yêu cầu');
    }

    // Tìm yêu cầu trong danh sách chờ
    const requestIndex = group.pending_requests.findIndex(
        r => r.user_id.toString() === requestUserId.toString()
    );
    if (requestIndex === -1) {
        throw new Error('Không tìm thấy yêu cầu này');
    }

    // Xoá khỏi pending_requests
    group.pending_requests.splice(requestIndex, 1);

    // Thêm vào members
    group.members.push({
        user_id: requestUserId,
        role: 'member'
    });

    await group.save();
    return group;
};

// 4. Từ chối yêu cầu vào nhóm
const rejectRequest = async (adminId, groupId, requestUserId) => {
    const group = await Group.findById(groupId);

    if (!group) {
        throw new Error('Nhóm không tồn tại');
    }

    // Kiểm tra quyền admin
    const isAdmin = group.members.some(
        m => m.user_id.toString() === adminId.toString() && m.role === 'admin'
    );
    if (!isAdmin) {
        throw new Error('Bạn không có quyền duyệt yêu cầu');
    }

    // Tìm và xoá yêu cầu
    const requestIndex = group.pending_requests.findIndex(
        r => r.user_id.toString() === requestUserId.toString()
    );
    if (requestIndex === -1) {
        throw new Error('Không tìm thấy yêu cầu này');
    }

    group.pending_requests.splice(requestIndex, 1);

    await group.save();
    return group;
};

export default {
    createGroup,
    requestJoin,
    acceptRequest,
    rejectRequest
};
