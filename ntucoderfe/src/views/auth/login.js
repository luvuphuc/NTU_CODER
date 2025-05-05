import React from 'react';
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
import { keyframes } from '@emotion/react';
import { useToast } from '@chakra-ui/react';
import CustomToast from 'components/toast/CustomToast';
import { FaGithub, FaTwitter } from 'react-icons/fa';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { ArrowBackIcon } from '@chakra-ui/icons';
import logo from '../../assets/img/ntu-coders.png';
import { useState } from 'react';
import Cookies from 'js-cookie';
import api from 'utils/api';
import { useAuth } from '../../contexts/AuthContext';
function SignIn() {
  const [credentials, setCredentials] = useState({
    userName: '',
    password: '',
  });
  const { setCoder } = useAuth();
  const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25%, 75% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
`;
  const [error, setError] = useState({ userName: false, password: false });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = React.useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const handleClick = () => setShow(!show);
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const handleLogin = async () => {
    if (!credentials.userName.trim() || !credentials.password.trim()) {
      setError({
        userName: !credentials.userName.trim(),
        password: !credentials.password.trim(),
      });
      toast({
        render: () => (
          <CustomToast
            success={false}
            messages="Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu."
          />
        ),
        position: 'top',
        duration: 5000,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/login', credentials);

      if (response.status === 200) {
        Cookies.set('token', response.data.token);
        const resUser = await api.get('/Auth/me');
        if (resUser.status === 200) {
          setCoder(resUser.data);
        }
        toast({
          render: () => (
            <CustomToast success={true} messages="Đăng nhập thành công!" />
          ),
          position: 'top',
          duration: 5000,
        });
        navigate('/');
      }
    } catch (error) {
      let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại.';
      if (error.response) {
        errorMessage =
          error.response.data?.message || 'Sai tài khoản hoặc mật khẩu.';
      }
      toast({
        render: () => <CustomToast success={false} messages={errorMessage} />,
        position: 'top',
        duration: 5000,
      });
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
      {/* Back Button */}
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
      >
        Quay lại
      </Button>

      <Flex w="100vw" h="100vh">
        {/* Sign-in Form */}
        <Flex
          w={{ base: '100%', md: '50%' }}
          h="100vh"
          align="center"
          justify="center"
        >
          <Box
            maxW="400px"
            p="32px"
            bg="rgba(255, 255, 255, 0.1)"
            backdropFilter="blur(10px)"
            borderRadius="20px"
            boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
            border="1px solid rgba(255, 255, 255, 0.2)"
          >
            <Box textAlign="center" mb="10">
              <Heading color={textColor} fontSize="36px" mb="10px">
                Đăng nhập
              </Heading>
              <Text mb="36px" color={textColorSecondary} fontSize="md">
                Hãy nhập email/tên đăng nhập và mật khẩu!
              </Text>
            </Box>
            <FormControl
              isInvalid={error.userName}
              mb="24px"
              animation={error.password ? `${shake} 0.3s` : ''}
            >
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

            <FormControl
              isInvalid={error.password}
              mb="24px"
              animation={error.password ? `${shake} 0.3s` : ''}
            >
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
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
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

            <Flex justifyContent="space-between" alignItems="center" mb="20px">
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              <NavLink to="/forgot-password">
                <Text color="blue.500">Quên mật khẩu?</Text>
              </NavLink>
            </Flex>
            <Button
              w="100%"
              colorScheme="blue"
              mb="20px"
              onClick={handleLogin}
              isLoading={loading}
              boxShadow="0px 4px 15px rgba(0, 0, 255, 0.3)"
              transition="all 0.3s"
              _hover={{ boxShadow: '0px 6px 20px rgba(0, 0, 255, 0.5)' }}
            >
              Đăng nhập
            </Button>
            <Flex justifyContent="space-between" mx={2} mt="10px">
              <Text mr="5px">Chưa có tài khoản?</Text>
              <NavLink to="/register">
                <Text color="blue.500" _hover={{ textDecoration: 'underline' }}>
                  Đăng ký
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
        {/* Left Sidebar */}
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
          overflow="hidden"
        >
          {/* Hiệu ứng chấm lấp lánh */}
          <Box
            position="absolute"
            top="10%"
            left="10%"
            w="50px"
            h="50px"
            bg="rgba(255, 255, 255, 0.3)"
            borderRadius="50%"
            filter="blur(10px)"
            animation="pulse 2s infinite alternate"
          />
          <Box
            position="absolute"
            bottom="20%"
            right="20%"
            w="30px"
            h="30px"
            bg="rgba(255, 255, 255, 0.3)"
            borderRadius="50%"
            filter="blur(8px)"
            animation="pulse 3s infinite alternate"
          />

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

          <Heading
            fontSize="3xl"
            animation="bounce 1.5s infinite"
            textShadow="2px 2px 4px rgba(0,0,0,0.2)"
            mb={4}
            _hover={{
              color: 'cyan.200',
              transition: 'color 0.3s',
            }}
          >
            Chào mừng bạn!
          </Heading>

          <Text
            fontSize="lg"
            textAlign="center"
            maxW="80%"
            fontStyle="italic"
            opacity={0.9}
            _hover={{
              color: 'gray.200',
              transition: 'color 0.3s',
            }}
          >
            Hãy đăng nhập để tiếp tục truy cập vào hệ thống của chúng tôi.
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
