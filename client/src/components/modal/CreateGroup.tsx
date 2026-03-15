import { useState } from 'react'
import { Camera, Users } from 'lucide-react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton, TextField, Avatar } from '@mui/material';


interface CreateGroupProps {
  isOpen: boolean;
  handleClose?: () => void;
  handleSubmitCreate: (data: CreateGroupFormData) => Promise<void> | void;
}
interface CreateGroupFormData {
  name: string;
  description: string;
  maxMembers: number | null;
}
interface ErrorGroup {
  isError: boolean;
  message: string;
}
const CreateGroup = ({ isOpen, handleClose, handleSubmitCreate }: CreateGroupProps) => {
  const [formData, setFormData] = useState<CreateGroupFormData>({
    name: '',
    description: '',
    maxMembers: null,
  });
  const [nameGroupErrors, setNameGroupErrors] = useState<ErrorGroup>({
    isError: false,
    message: ''
  }
  );
  const [descriptionGroupErrors, setDescriptionGroupErrors] = useState<ErrorGroup>({
    isError: false,
    message: ''
  }
  );
  const handleSubmitCreateGroup = async () => {
    let hasError = false;

    if (!formData.name) {
      setNameGroupErrors({ isError: true, message: 'Tên nhóm không được để trống' });
      hasError = true;
    } else {
      setNameGroupErrors({ isError: false, message: '' });
    }

    if (!formData.maxMembers || formData.maxMembers < 1) {
      setDescriptionGroupErrors({ isError: true, message: 'Số lượng thành viên tối đa phải lớn hơn 0' });
      hasError = true;
    } else {
      setDescriptionGroupErrors({ isError: false, message: '' });
    }

    if (hasError) return;

    await handleSubmitCreate(formData);
    setFormData({
      name: '',
      description: '',
      maxMembers: null,
    });
  };

  const hanldeCloseModal = () => {
    setFormData({
      name: '',
      description: '',
      maxMembers: null,
    });
    setNameGroupErrors({ isError: false, message: '' });
    setDescriptionGroupErrors({ isError: false, message: '' });
    handleClose?.();
  };


  return (
    <Dialog open={isOpen} onClose={hanldeCloseModal} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1, borderBottom: '1px solid #eee' }}>
        <Users size={24} style={{ marginRight: 8 }} />
        <Box>
          <Typography variant="h6" component="div">
            Tạo Nhóm Cầu Lông Mới
          </Typography>
          <Typography variant="body2" color="textSecondary">Hãy điền thông tin để bắt đầu tạo hội nhóm của bạn!</Typography>
        </Box>
        <IconButton onClick={hanldeCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 'bold' }}>×</span>
        </IconButton>
      </DialogTitle>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmitCreateGroup();
      }}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            required
            fullWidth
            label="Tên Nhóm (Bắt buộc)"
            placeholder='CLB cầu lông IT'
            value={formData.name}
            error={nameGroupErrors.isError}
            helperText={nameGroupErrors.message}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            sx={{ mt: 2 }}
            multiline
            rows={3}
            name="description"
            fullWidth
            label="Mô tả & Quy định nhóm (Tùy chọn)"
            placeholder="Nhập quy định, trình độ yêu cầu, giờ chơi cố định, cách chia tiền sân..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Ảnh đại diện nhóm (Tùy chọn)
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 56, height: 56, bgcolor: 'action.hover' }}>
                <Camera size={24} color="#757575" />
              </Avatar>
              <Button variant="outlined" size="small">Tải ảnh lên</Button>
            </Box>
          </Box>
          <TextField
            required
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            fullWidth
            type="number"
            sx={{
              mt: 2, // Ẩn mũi tên trên Chrome, Safari, Edge, Opera
              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                display: 'none',
                WebkitAppearance: 'none',
                margin: 0,
              },
              // Ẩn mũi tên trên Firefox
              '& input[type=number]': {
                MozAppearance: 'textfield',
              },
            }}
            label="Số lượng thành viên tối đa (bắt buộc)"
            placeholder="Nhập số lượng thành viên tối đa..."
            InputProps={{
              inputProps: { min: 1, max: 20 } // Giới hạn từ 1 đến 20
            }}
            error={descriptionGroupErrors.isError}
            helperText={descriptionGroupErrors.message}
            value={formData.maxMembers}
            onChange={(e) => setFormData({ ...formData, maxMembers: Number(e.target.value) })}
          />
        </DialogContent>
      </form>
      <DialogActions>
        <Button onClick={hanldeCloseModal} variant="outlined" color="inherit">Hủy Bỏ</Button>
        <Button onClick={handleSubmitCreateGroup} variant="contained" color="primary">Tạo</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateGroup;