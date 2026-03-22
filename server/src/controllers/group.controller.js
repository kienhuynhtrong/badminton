import groupService from '#services/group.service.js';

const createGroup = async (req, res) => {
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

const getMyGroups = async (req, res) => {
    try {
        const groups = await groupService.getMyGroups(req.user._id);

        res.status(200).json({
            status: 'success',
            message: 'Lấy danh sách nhóm thành công!',
            data: groups
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

const getDiscoverGroups = async (req, res) => {
    try {
        const groups = await groupService.getDiscoverGroups(req.user._id);

        res.status(200).json({
            status: 'success',
            message: 'Lấy danh sách nhóm khác thành công!',
            data: groups
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

const updateGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await groupService.updateGroup(req.user._id, groupId, req.body);

        res.status(200).json({
            status: 'success',
            message: 'Cập nhật nhóm thành công!',
            data: group
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await groupService.deleteGroup(req.user._id, groupId);

        res.status(200).json({
            status: 'success',
            message: 'Xóa nhóm thành công!',
            data: group
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

const requestJoin = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { message } = req.body;

        const group = await groupService.requestJoin(req.user._id, groupId, message);

        res.status(200).json({
            status: 'success',
            message: 'Gửi yêu cầu tham gia thành công! Vui lòng chờ chủ nhóm duyệt.',
            data: group
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

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
    getMyGroups,
    getDiscoverGroups,
    updateGroup,
    deleteGroup,
    requestJoin,
    acceptRequest,
    rejectRequest
};
