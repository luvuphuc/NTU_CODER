import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
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
  Tooltip,
  Divider,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaTwitter } from 'react-icons/fa';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { ArrowBackIcon } from '@chakra-ui/icons';
import logo from '../../assets/img/ntu-coders.png';
import Cookies from 'js-cookie';
import api from 'utils/api';

function SignIn() {
  const [credentials, setCredentials] = useState({
    userName: '',
    password: '',
    confirmPassword: '', // Thêm trường confirmPassword cho đăng ký
  });
  const [error, setError] = useState({
    userName: false,
    password: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Điều khiển trạng thái đăng nhập/đăng ký
  const navigate = useNavigate();

  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';

  const handleClick = () => setShow(!show);

  const handleLogin = async () => {
    if (!credentials.userName.trim() || !credentials.password.trim()) {
      setError({
        userName: !credentials.userName.trim(),
        password: !credentials.password.trim(),
      });
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/login', credentials);
      if (response.status === 200) {
        Cookies.set('token', response.data.token, { expires: 7 });
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (
      !credentials.userName.trim() ||
      !credentials.password.trim() ||
      credentials.password !== credentials.confirmPassword
    ) {
      setError({
        userName: !credentials.userName.trim(),
        password: !credentials.password.trim(),
        confirmPassword: credentials.password !== credentials.confirmPassword,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/signup', credentials);
      if (response.status === 200) {
        Cookies.set('token', response.data.token, { expires: 7 });
        navigate('/');
      }
    } catch (error) {
      console.log(error);
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
        color="gray.600"
        onClick={() => navigate('/')}
        leftIcon={<ArrowBackIcon size="md" />}
        bg="gray.200"
        borderRadius="md"
        zIndex={10}
      >
        Quay lại
      </Button>

      <Flex w="100vw" h="100vh">
        {/* Box đăng nhập và box ảnh */}
        <Flex
          w={{ base: '100%', md: '50%' }}
          h="100vh"
          align="center"
          justify="center"
          transform={isSignUp ? 'translateX(100%)' : 'translateX(0)'}
          transition="transform 0.5s ease-in-out"
        >
          <Box
            w="450px"
            p="32px"
            bg="rgba(255, 255, 255, 0.1)"
            backdropFilter="blur(10px)"
            borderRadius="20px"
            boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
            border="1px solid rgba(255, 255, 255, 0.2)"
          >
            <Heading color={textColor} fontSize="36px" mb="10px">
              {isSignUp ? 'Đăng ký' : 'Đăng nhập'}
            </Heading>
            <FormControl isInvalid={error.userName} mb="24px">
              <FormLabel>Tên đăng nhập/Email *</FormLabel>
              <InputGroup>
                <Tooltip label="Nhập email hoặc tên đăng nhập" hasArrow>
                  <Input
                    placeholder="abc123@gmail.com"
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        userName: e.target.value,
                      })
                    }
                    _hover={{
                      borderColor: 'purple.400',
                      boxShadow: '0 0 8px rgba(128, 0, 128, 0.6)',
                    }}
                    _focus={{
                      borderColor: 'purple.500',
                      boxShadow: '0 0 10px rgba(128, 0, 128, 0.8)',
                    }}
                  />
                </Tooltip>
              </InputGroup>
              {error.userName && (
                <Text color="red.500" mt="2" ml="2" fontSize="sm">
                  Vui lòng nhập tên đăng nhập!
                </Text>
              )}
            </FormControl>

            {/* Trường nhập liệu cho mật khẩu */}
            <FormControl isInvalid={error.password} mb="24px">
              <FormLabel>Mật khẩu *</FormLabel>
              <InputGroup>
                <Tooltip label="Nhập mật khẩu của bạn" hasArrow>
                  <Input
                    type={show ? 'text' : 'password'}
                    placeholder="Mật khẩu"
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                    _hover={{
                      borderColor: 'purple.400',
                      boxShadow: '0 0 8px rgba(128, 0, 128, 0.6)',
                    }}
                    _focus={{
                      borderColor: 'purple.500',
                      boxShadow: '0 0 10px rgba(128, 0, 128, 0.8)',
                    }}
                  />
                </Tooltip>
                <InputRightElement>
                  <Icon
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                    cursor="pointer"
                    color="gray.400"
                  />
                </InputRightElement>
              </InputGroup>
              {error.password && (
                <Text color="red.500" mt="2" ml="2" fontSize="sm">
                  Vui lòng nhập mật khẩu!
                </Text>
              )}
            </FormControl>

            {/* Trường nhập liệu cho xác nhận mật khẩu (Chỉ hiển thị khi đăng ký) */}
            {isSignUp && (
              <FormControl isInvalid={error.confirmPassword} mb="24px">
                <FormLabel>Xác nhận mật khẩu *</FormLabel>
                <InputGroup>
                  <Tooltip label="Xác nhận mật khẩu của bạn" hasArrow>
                    <Input
                      type={show ? 'text' : 'password'}
                      placeholder="Xác nhận mật khẩu"
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          confirmPassword: e.target.value,
                        })
                      }
                      _hover={{
                        borderColor: 'purple.400',
                        boxShadow: '0 0 8px rgba(128, 0, 128, 0.6)',
                      }}
                      _focus={{
                        borderColor: 'purple.500',
                        boxShadow: '0 0 10px rgba(128, 0, 128, 0.8)',
                      }}
                    />
                  </Tooltip>
                </InputGroup>
                {error.confirmPassword && (
                  <Text color="red.500" mt="2" ml="2" fontSize="sm">
                    Mật khẩu xác nhận không khớp!
                  </Text>
                )}
              </FormControl>
            )}

            <Flex justifyContent="space-between" alignItems="center" mb="20px">
              {!isSignUp && <Checkbox>Ghi nhớ đăng nhập</Checkbox>}
              <NavLink to="/forgot-password">
                <Text color="blue.500">Quên mật khẩu?</Text>
              </NavLink>
            </Flex>

            <Button
              w="100%"
              colorScheme="blue"
              mb="20px"
              onClick={isSignUp ? handleSignUp : handleLogin}
              isLoading={loading}
              boxShadow="0px 4px 15px rgba(0, 0, 255, 0.3)"
              transition="all 0.3s"
              _hover={{ boxShadow: '0px 6px 20px rgba(0, 0, 255, 0.5)' }}
            >
              {isSignUp ? 'Đăng ký' : 'Đăng nhập'}
            </Button>

            <Flex justify="space-between" mb="10px" mx={2}>
              <Text mr="2" color="gray.500">
                {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
              </Text>
              <Button
                colorScheme="blue"
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
              </Button>
            </Flex>

            <Flex align="center" my="20px">
              <Divider borderColor="gray.300" flex="1" />
              <Text mx="2" color="gray.500">
                hoặc
              </Text>
              <Divider borderColor="gray.300" flex="1" />
            </Flex>

            <Flex justify="center" gap="10px">
              <Button
                variant="outline"
                leftIcon={<Icon as={FcGoogle} boxSize={6} />}
                size="lg"
                px={6}
                py={4}
              />
              <Button
                variant="outline"
                leftIcon={<Icon as={FaTwitter} color="blue.400" boxSize={6} />}
                size="lg"
                px={6}
                py={4}
              />
              <Button
                variant="outline"
                leftIcon={<Icon as={FaGithub} boxSize={6} />}
                size="lg"
                px={6}
                py={4}
              />
            </Flex>
          </Box>
        </Flex>

        {/* Box ảnh*/}
        <Box
          w="60%"
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
          position="relative"
          transform={isSignUp ? 'translateX(-100%)' : 'translateX(0)'}
          transition="transform 0.5s ease-in-out"
          maxW={{ base: '100%', md: '50%' }}
        >
          {/* Hiệu ứng chấm lấp lánh */}
          <Box
            position="absolute"
            top="15%"
            left="20%"
            w="12px"
            h="12px"
            bg="rgba(255, 255, 255, 0.5)"
            borderRadius="50%"
            animation="sparkle 2s infinite alternate"
            filter="blur(5px)"
            animationDelay="0s"
          />
          <Box
            position="absolute"
            top="25%"
            left="40%"
            w="8px"
            h="8px"
            bg="rgba(255, 255, 255, 0.5)"
            borderRadius="50%"
            animation="sparkle 3s infinite alternate"
            filter="blur(5px)"
            animationDelay="0.5s"
          />
          <Box
            position="absolute"
            bottom="20%"
            right="30%"
            w="10px"
            h="10px"
            bg="rgba(255, 255, 255, 0.5)"
            borderRadius="50%"
            animation="sparkle 2.5s infinite alternate"
            filter="blur(5px)"
            animationDelay="0.8s"
          />

          {/* Hình ảnh logo */}
          <Image
            src={logo}
            alt="Logo"
            width="400px"
            maxWidth="80%"
            _hover={{
              transform: 'scale(1.05)',
              transition: 'all 0.3s',
            }}
          />

          <Heading fontSize="3xl" mb={4}>
            Chào mừng bạn!
          </Heading>
          <Text
            fontSize="lg"
            textAlign="center"
            maxW="80%"
            fontStyle="italic"
            opacity={0.9}
          >
            {isSignUp
              ? 'Hãy đăng ký để trở thành một thành viên!'
              : 'Hãy đăng nhập để tiếp tục truy cập vào hệ thống của chúng tôi.'}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
