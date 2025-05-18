import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
} from '@chakra-ui/react';
import CustomToast from 'components/toast/CustomToast';
import api from 'config/api';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast({
        render: () => (
          <CustomToast success={false} messages="Vui lòng nhập email." />
        ),
        position: 'top',
        duration: 5000,
      });
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/forgot-password', email, {
        headers: { 'Content-Type': 'application/json' },
      });

      toast({
        render: () => <CustomToast success={true} messages={res.data} />,
        position: 'top',
        duration: 5000,
      });

      onClose(); // Đóng modal sau khi gửi thành công
    } catch (error) {
      toast({
        render: () => (
          <CustomToast
            success={false}
            messages={
              error.response?.data || 'Không thể gửi link đặt lại mật khẩu.'
            }
          />
        ),
        position: 'top',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Quên mật khẩu</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="sm" color="gray.500" mb={4}>
            Nhập email để nhận liên kết đặt lại mật khẩu
          </Text>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            isLoading={loading}
            onClick={handleForgotPassword}
            w="100%"
          >
            Gửi liên kết đặt lại
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ForgotPasswordModal;
