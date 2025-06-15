import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  Image,
  Divider,
  Grid,
  GridItem,
  Tooltip,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { useToast } from '@chakra-ui/react';
import { FaGithub, FaTwitter } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { ArrowBackIcon } from '@chakra-ui/icons';
import logo from '../../assets/img/ntu-coders.png';
import api from 'config/api';
import CustomToast from 'components/toast/CustomToast';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from 'contexts/AuthContext';
import ForgotPasswordModal from './forgot_password';
import ReCAPTCHA from 'react-google-recaptcha';
const InputField = ({ label, type, value, onChange, error, placeholder }) => (
  <FormControl mb={8} animation={error ? 'shake 0.3s' : ''}>
    <FormLabel>{label}</FormLabel>
    <Tooltip
      label={error || `Nhập ${label.toLowerCase()}`}
      hasArrow
      isOpen={!!error}
      placement="bottom-end"
    >
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        borderColor={error ? 'red.500' : 'gray.300'}
        bg={error ? 'red.50' : 'white'}
        _hover={{ borderColor: error ? 'red.500' : 'blue.400' }}
        _focus={{ borderColor: error ? 'red.500' : 'blue.500' }}
      />
    </Tooltip>
  </FormControl>
);

function Register() {
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [credentials, setCredentials] = useState({
    userName: '',
    password: '',
    confirmPassword: '',
    coderName: '',
    coderEmail: '',
    phoneNumber: '',
  });
  const { setCoder } = useAuth();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const textColor = useColorModeValue('navy.700', 'white');
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const handleChange = (field) => (e) => {
    setCredentials((prev) => ({ ...prev, [field]: e.target.value }));
    setError((prev) => ({ ...prev, [field]: false }));
  };

  const validateAllFields = () => {
    const errors = {};
    if (!credentials.userName.trim()) errors.userName = 'Không được bỏ trống.';
    else if (credentials.userName.length < 6)
      errors.userName = 'Tên đăng nhập phải có ít nhất 6 ký tự.';
    if (!credentials.coderName.trim())
      errors.coderName = 'Không được bỏ trống.';
    if (!credentials.coderEmail.trim())
      errors.coderEmail = 'Không được bỏ trống!';
    else if (!credentials.coderEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errors.coderEmail = 'Email không hợp lệ!';
    if (!credentials.phoneNumber.trim())
      errors.phoneNumber = 'Không được bỏ trống.';
    else if (!/^(0[35789])\d{8}$/.test(credentials.phoneNumber))
      errors.phoneNumber = 'Số điện thoại không hợp lệ!';
    if (!credentials.password.trim()) errors.password = 'Không được bỏ trống.';
    else if (credentials.password.length < 6)
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
    if (!credentials.confirmPassword.trim())
      errors.confirmPassword = 'Không được bỏ trống.';
    else if (credentials.confirmPassword !== credentials.password)
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp!';

    return errors;
  };

  const handleRegister = async () => {
    setLoading(true);
    const validationErrors = validateAllFields();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      setLoading(false);
      return;
    }
    // if (!recaptchaToken) {
    //   toast({
    //     render: () => (
    //       <CustomToast success={false} messages="Vui lòng xác nhận CAPTCHA!" />
    //     ),
    //     position: 'top',
    //     duration: 5000,
    //   });
    //   setLoading(false);
    //   return;
    // }
    try {
      await api.post('/Coder/create', { ...credentials, role: 2 });
      toast({
        render: () => (
          <CustomToast success={true} messages="Đăng ký thành công!" />
        ),
        position: 'top',
        duration: 5000,
      });
      navigate('/login');
    } catch (error) {
      const errorMessages = error.response?.data?.errors || [];

      if (errorMessages.length > 0) {
        const errorMessage = errorMessages[0];

        if (
          errorMessage === 'Tên đăng nhập đã tồn tại.' ||
          errorMessage === 'Email đã tồn tại.'
        ) {
          setError((prev) => ({
            ...prev,
            coderEmail:
              errorMessage === 'Email đã tồn tại.'
                ? 'Email đã tồn tại.'
                : prev.coderEmail,
            userName:
              errorMessage === 'Tên đăng nhập đã tồn tại.'
                ? 'Tên đăng nhập đã tồn tại.'
                : prev.userName,
          }));
        } else {
          setError((prev) => ({ ...prev, general: 'Đã có lỗi xảy ra!' }));
          toast({
            render: () => (
              <CustomToast success={false} messages="Đã xảy ra lỗi!" />
            ),
            position: 'top',
            duration: 5000,
          });
        }
      } else {
        setError((prev) => ({ ...prev, general: 'Đã có lỗi xảy ra!' }));
        toast({
          render: () => (
            <CustomToast success={false} messages="Đã xảy ra lỗi!" />
          ),
          position: 'top',
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Flex
      w="100vw"
      h="100vh"
      align="center"
      justify="center"
      position="relative"
    >
      <Button
        position="absolute"
        top="20px"
        left="20px"
        colorScheme="blue"
        variant="ghost"
        onClick={() => navigate(-1)}
        leftIcon={<ArrowBackIcon size="md" />}
        bg="gray.200"
        borderRadius="md"
        zIndex={1000}
      >
        Quay lại
      </Button>
      <Flex w="100vw" h="100vh">
        <Box
          w="55%"
          h="100vh"
          bgGradient="linear(to-l, rgba(0, 0, 255, 0.7), rgba(0, 255, 255, 0.7))"
          color="white"
          bg="rgba(0, 0, 255, 0.3)"
          backdropFilter="blur(10px)"
          display={{ base: 'none', md: 'flex' }}
          flexDirection="column"
          alignItems="center"
          justifyContent="flex-start"
          p={8}
          pt="100px"
          gap="20px"
          border="1px solid rgba(255, 255, 255, 0.3)"
          boxShadow="0 4px 30px rgba(0, 0, 0, 0.2)"
          borderRadius="20px"
        >
          <Image
            src={logo}
            alt="Logo"
            width="400px"
            maxWidth="80%"
            _hover={{ transform: 'scale(1.05)', transition: 'all 0.3s' }}
          />
          <Heading
            fontSize="3xl"
            mb={8}
            _hover={{ color: 'cyan.200', transition: 'color 0.3s' }}
          >
            Chào mừng bạn!
          </Heading>
          <Text
            fontSize="lg"
            textAlign="center"
            maxW="80%"
            fontStyle="italic"
            opacity={0.9}
            _hover={{ color: 'gray.200', transition: 'color 0.3s' }}
          >
            Hãy tạo một tài khoản cho chính mình.
          </Text>
        </Box>
        <Flex w="60%" align="center" justify="center">
          <Box
            w="600px"
            p="32px"
            bg="rgba(255, 255, 255, 0.1)"
            backdropFilter="blur(10px)"
            borderRadius="20px"
            boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
            border="1px solid rgba(255, 255, 255, 0.2)"
          >
            <Box textAlign="center" mb="8">
              <Heading color={textColor} fontSize="36px" mb="10px">
                Đăng ký
              </Heading>
            </Box>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <InputField
                  label="Tên đăng nhập *"
                  type="text"
                  value={credentials.userName}
                  onChange={handleChange('userName')}
                  error={error.userName}
                  placeholder="Nhập tên đăng nhập"
                />
                <InputField
                  label="Mật khẩu *"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={handleChange('password')}
                  error={error.password}
                  placeholder="Nhập mật khẩu"
                />
                <InputField
                  label="Xác nhận mật khẩu *"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  error={error.confirmPassword}
                  placeholder="Nhập lại mật khẩu"
                />
              </GridItem>
              <GridItem>
                <InputField
                  label="Họ và tên"
                  type="text"
                  value={credentials.coderName}
                  onChange={handleChange('coderName')}
                  error={error.coderName}
                  placeholder="Nhập tên người dùng"
                />
                <InputField
                  label="Email"
                  type="email"
                  value={credentials.coderEmail}
                  onChange={handleChange('coderEmail')}
                  error={error.coderEmail}
                  placeholder="Nhập email"
                />
                <InputField
                  label="Số điện thoại"
                  type="tel"
                  value={credentials.phoneNumber}
                  onChange={handleChange('phoneNumber')}
                  error={error.phoneNumber}
                  placeholder="Nhập số điện thoại"
                />
              </GridItem>
            </Grid>
            <Flex justifyContent="space-between" alignItems="center" mb="15px">
              <Text
                color="blue.500"
                onClick={() => setIsForgotOpen(true)}
                cursor="pointer"
                _hover={{ textDecoration: 'underline' }}
              >
                Quên mật khẩu?
              </Text>
            </Flex>
            <Button
              w="100%"
              colorScheme="blue"
              mb="13px"
              onClick={handleRegister}
              isLoading={loading}
              loadingText="Đang đăng ký..."
              isDisabled={loading}
            >
              Đăng ký
            </Button>

            <Flex justifyContent="space-between" mx={2} mt="10px">
              <Text mr="5px">Đã có tài khoản?</Text>
              <NavLink to="/login">
                <Text color="blue.500" _hover={{ textDecoration: 'underline' }}>
                  Đăng nhập
                </Text>
              </NavLink>
            </Flex>
            <Flex align="center" my="20px">
              <Divider borderColor="gray.300" flex="1" />
              <Text mx="2" color="gray.500">
                hoặc
              </Text>
              <Divider borderColor="gray.300" flex="1" />
            </Flex>
            <Flex justify="center" gap="10px">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const res = await api.post('/auth/google-login', {
                      token: credentialResponse.credential,
                    });

                    if (res.status === 200) {
                      Cookies.set('token', res.data.token);
                      const resUser = await api.get('/Auth/me', {
                        withCredentials: true,
                      });
                      if (resUser.status === 200) {
                        setCoder(resUser.data);
                      }

                      toast({
                        render: () => (
                          <CustomToast
                            success={true}
                            messages="Đăng nhập Google thành công!"
                          />
                        ),
                        position: 'top',
                        duration: 5000,
                      });

                      navigate('/');
                    }
                  } catch (err) {
                    toast({
                      render: () => (
                        <CustomToast
                          success={false}
                          messages="Đăng nhập Google thất bại. Vui lòng thử lại!"
                        />
                      ),
                      position: 'top',
                      duration: 5000,
                    });
                  }
                }}
                onError={() => {
                  toast({
                    render: () => (
                      <CustomToast
                        success={false}
                        messages="Không thể đăng nhập bằng Google."
                      />
                    ),
                    position: 'top',
                    duration: 5000,
                  });
                }}
              />
            </Flex>
          </Box>
        </Flex>
      </Flex>
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
      />
    </Flex>
  );
}

export default Register;
