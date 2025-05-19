import React from 'react';
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
  Box,
  Center,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepSeparator,
  StepDescription,
  StepNumber,
  StepTitle,
  Stack,
  useSteps,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon } from '@chakra-ui/icons';
import CustomToast from 'components/toast/CustomToast';
import api from 'config/api';

const steps = [
  { title: 'Bước 1', description: 'Nhập email' },
  { title: 'Bước 2', description: 'Nhận mã' },
  { title: 'Bước 3', description: 'Tạo mật khẩu' },
  { title: 'Hoàn tất', description: 'Kết quả' },
];

const stepVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const fadeScaleVariants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.3 } },
};

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [resultMessage, setResultMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [verifyAttempts, setVerifyAttempts] = React.useState(0);
  const [isLocked, setIsLocked] = React.useState(false);

  const toast = useToast();

  const getErrorMessage = (error, defaultMsg) => {
    return (
      error?.response?.data?.message ||
      (typeof error?.response?.data === 'string' && error.response.data) ||
      JSON.stringify(error?.response?.data) ||
      defaultMsg
    );
  };

  const handleSendEmail = async () => {
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
      await api.post('/auth/forgot-password', email);
      toast({
        render: () => (
          <CustomToast success={true} messages="Mã xác nhận đã được gửi." />
        ),
        position: 'top',
        duration: 5000,
      });
      setActiveStep(1);
      setVerifyAttempts(0);
      setIsLocked(false);
    } catch (error) {
      toast({
        render: () => (
          <CustomToast
            success={false}
            messages={getErrorMessage(error, 'Không thể gửi mã xác nhận.')}
          />
        ),
        position: 'top',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (isLocked) return;
    if (!code.trim()) {
      toast({
        render: () => (
          <CustomToast success={false} messages="Vui lòng nhập mã xác nhận." />
        ),
        position: 'top',
        duration: 5000,
      });
      return;
    }
    try {
      setLoading(true);
      await api.post('/auth/verify-reset-code', { email, code });
      toast({
        render: () => (
          <CustomToast success={true} messages="Mã xác nhận hợp lệ." />
        ),
        position: 'top',
        duration: 5000,
      });
      setActiveStep(2);
      setVerifyAttempts(0);
      setIsLocked(false);
    } catch (error) {
      const attempts = verifyAttempts + 1;
      setVerifyAttempts(attempts);
      if (attempts >= 5) {
        setIsLocked(true);
        toast({
          render: () => (
            <CustomToast
              success={false}
              messages="Bạn đã nhập sai quá 5 lần, vui lòng thử lại sau hoặc yêu cầu gửi mã mới."
            />
          ),
          position: 'top',
          duration: 8000,
        });
      } else {
        toast({
          render: () => (
            <CustomToast
              success={false}
              messages={`Mã xác nhận không hợp lệ. Bạn còn ${
                5 - attempts
              } lần thử.`}
            />
          ),
          position: 'top',
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      toast({
        render: () => (
          <CustomToast success={false} messages="Vui lòng nhập mật khẩu mới." />
        ),
        position: 'top',
        duration: 5000,
      });
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/auth/reset-password', {
        email,
        code,
        newPassword,
      });
      setResultMessage(res.data || 'Đặt lại mật khẩu thành công!');
      setActiveStep(3);
    } catch (error) {
      setResultMessage(getErrorMessage(error, 'Đặt lại mật khẩu thất bại.'));
      setActiveStep(3);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <Text fontSize="sm" textAlign="center" color="gray.500" mb={4}>
              Nhập email để nhận mã xác nhận đặt lại mật khẩu
            </Text>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="abc123@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
          </>
        );
      case 1:
        return (
          <>
            <Text fontSize="sm" color="gray.500" textAlign="center" mb={4}>
              Nhập mã xác nhận đã được gửi tới email
            </Text>
            <FormControl>
              <FormLabel>Mã xác nhận</FormLabel>
              <Input
                placeholder="Nhập mã xác nhận"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                isDisabled={isLocked}
              />
            </FormControl>
          </>
        );
      case 2:
        return (
          <>
            <Text fontSize="sm" color="gray.500" mb={4}>
              Nhập mật khẩu mới cho tài khoản của bạn
            </Text>
            <FormControl>
              <FormLabel>Mật khẩu mới</FormLabel>
              <Input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FormControl>
          </>
        );
      case 3:
        return (
          <Center flexDirection="column" mt={5}>
            <motion.div
              variants={fadeScaleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <CheckCircleIcon boxSize={16} color="green.400" />
            </motion.div>
            <motion.div
              variants={fadeScaleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Text
                fontSize="lg"
                fontWeight="semibold"
                color="green.500"
                mt={3}
              >
                {resultMessage || 'Thay đổi mật khẩu thành công'}
              </Text>
            </motion.div>
          </Center>
        );
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (activeStep === 0) handleSendEmail();
    else if (activeStep === 1) handleVerifyCode();
    else if (activeStep === 2) handleResetPassword();
    else onClose();
  };

  const getButtonLabel = () => {
    if (activeStep === 0) return 'Gửi mã';
    if (activeStep === 1) return 'Xác nhận';
    if (activeStep === 2) return 'Đổi mật khẩu';
    return 'Đóng';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setActiveStep(0);
        setEmail('');
        setCode('');
        setNewPassword('');
        setResultMessage('');
        setLoading(false);
        setVerifyAttempts(0);
        setIsLocked(false);
        onClose();
      }}
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent borderRadius="md" boxShadow="lg" maxW="500px" minH="400px">
        <ModalHeader fontWeight="bold" fontSize="xl" textAlign="center">
          Quên mật khẩu
        </ModalHeader>

        <Box px={6} mb={4}>
          <Stack spacing={0} align="center" w="100%">
            <Stepper
              size="sm"
              index={activeStep}
              gap="2"
              w="100%"
              colorScheme="blue"
              display="flex"
              flexDirection="row"
            >
              {steps.map((stepItem, index) => (
                <Step
                  key={index}
                  flex="1"
                  minW={0}
                  flexShrink={0}
                  ml={0}
                  sx={{ marginInlineStart: 0 }}
                >
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>

                  {activeStep === index ? (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <StepTitle fontSize="xs">{stepItem.title}</StepTitle>
                      <StepDescription fontSize="xs" color="gray.500">
                        {stepItem.description}
                      </StepDescription>
                    </motion.div>
                  ) : null}

                  {index !== steps.length - 1 && (
                    <StepSeparator ml={0} p={0} flex="1" />
                  )}
                </Step>
              ))}
            </Stepper>
          </Stack>
        </Box>

        <ModalCloseButton />
        <ModalBody minH="140px" pt={6}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeStep}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            isLoading={loading}
            onClick={handleNext}
            w="100%"
            size="lg"
            fontWeight="semibold"
            borderRadius="md"
            isDisabled={activeStep === 1 && isLocked}
          >
            {getButtonLabel()}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ForgotPasswordModal;
