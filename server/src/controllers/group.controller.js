import groupService from '#services/group.service.js';

// 1. Tạo nhóm
const createGroup = async (req, res) => {
  console.log('Received createGroup request with body:', req.user);
    try {
        const group = await groupService.createGroup(req.user._id, req.body);

        res.status(201).json({
            status: 'success',
            message: 'Tạo nhóm thành công!',
            data: group
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

// 2. Xin vào nhóm
const requestJoin = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { message } = req.body;

        const group = await groupService.requestJoin(req.user._id, groupId, message);

        res.status(200).json({
            status: 'success',
            message: 'Gửi yêu cầu tham gia thành công! Vui lòng chờ admin duyệt.',
            data: group
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

// 3. Chấp nhận yêu cầu
const acceptRequest = async (req, res) => {
    try {
        const { groupId, userId } = req.params;

        const group = await groupService.acceptRequest(req.user._id, groupId, userId);

        res.status(200).json({
            status: 'success',
            message: 'Đã chấp nhận yêu cầu tham gia!',
            data: group
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

// 4. Từ chối yêu cầu
const rejectRequest = async (req, res) => {
    try {
        const { groupId, userId } = req.params;

        const group = await groupService.rejectRequest(req.user._id, groupId, userId);

        res.status(200).json({
            status: 'success',
            message: 'Đã từ chối yêu cầu tham gia.',
            data: group
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

export {
    createGroup,
    requestJoin,
    acceptRequest,
    rejectRequest
};
