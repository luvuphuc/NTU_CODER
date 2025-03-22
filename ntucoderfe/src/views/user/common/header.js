import {
  Box,
  Flex,
  Image,
  IconButton,
  Button,
  Stack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import logo from '../../../assets/img/ntu-coders.png';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../../utils/api';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { logout, setUser } from '../../../redux/slices/authSlice';
export default function Header() {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const roleID = useSelector((state) => state.auth.roleID);
  console.log('User from Redux:', user);
  console.log('User from Redux:', typeof user);
  console.log('RoleID from Redux:', roleID);
  const dispatch = useDispatch();
  useEffect(() => {
    const token = Cookies.get('token');

    if (token && !user) {
      dispatch(
        setUser({
          user: Cookies.get('UserID'),
          roleID: Cookies.get('RoleID'),
          token: token,
        }),
      );
    }
  }, [dispatch, user]);

  const handleLogout = async () => {
    try {
      await api.get('/Auth/logout');
      Cookies.remove('token');
      dispatch(logout()); // Gọi logout từ Redux
      navigate('/');
    } catch (error) {
      console.error('Lỗi khi đăng xuất', error);
    }
  };

  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      borderBottom={1}
      borderStyle="solid"
      borderColor={useColorModeValue('gray.200', 'gray.900')}
      w="100%"
    >
      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 4 }}>
        <Flex
          color={useColorModeValue('gray.600', 'white')}
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          align={'center'}
          justify="space-between"
        >
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? (
                  <CloseIcon w={3} h={3} />
                ) : (
                  <HamburgerIcon w={5} h={5} />
                )
              }
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
          </Flex>
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <Image src={logo} alt="Logo" width="300px" />
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
          >
            {user ? (
              <>
                {roleID === 1 && (
                  <Button
                    as={Link}
                    to="/admin"
                    fontSize={'md'}
                    fontWeight={600}
                    color={'white'}
                    bg="green.500"
                  >
                    Trang quản trị
                  </Button>
                )}
                <Button
                  onClick={handleLogout}
                  fontSize={'md'}
                  fontWeight={600}
                  color={'white'}
                  bg="red.500"
                >
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  fontSize={'md'}
                  fontWeight={400}
                  variant={'link'}
                >
                  Đăng nhập
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  fontSize={'md'}
                  fontWeight={600}
                  color={'white'}
                  bg="#0186bd"
                  _hover={{ bg: 'red.300' }}
                >
                  Đăng ký
                </Button>
              </>
            )}
          </Stack>
        </Flex>
      </Box>
    </Box>
  );
}
