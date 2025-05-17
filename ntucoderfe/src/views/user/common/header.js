import { motion } from 'framer-motion';
import {
  Box,
  Flex,
  Image,
  Button,
  useColorModeValue,
  Text,
  Link as ChakraLink,
} from '@chakra-ui/react';
import logo from '../../../assets/img/ntu-coders.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

export default function Header({ hideHeader }) {
  const { coder, logout, isLoading } = useAuth();
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: hideHeader ? -70 : 0 }}
      transition={{ type: 'tween', duration: 0.3 }}
      style={{ position: 'fixed', top: 0, width: '100%', zIndex: 11 }}
    >
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        borderBottom="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        w="100%"
        minH="70px"
      >
        <Box maxW="1200px" mx="auto">
          <Flex
            color={useColorModeValue('gray.600', 'white')}
            minH="60px"
            py={{ base: 2 }}
            px={0}
          >
            <Flex
              flex={{ base: 1 }}
              justify={{ base: 'center', md: 'start' }}
              align="center"
              gap={3}
            >
              <Image src={logo} alt="Logo" maxHeight="60px" width="auto" />
            </Flex>

            <Flex align="center" gap={4}>
              {isLoading ? null : coder ? (
                <>
                  <Text fontSize="md" fontWeight="600" color="gray.700">
                    Xin chào,{' '}
                    <ChakraLink
                      as={Link}
                      to={`/user/${coder.coderID}`}
                      fontSize="md"
                      fontWeight="600"
                      color="blue.500"
                      _hover={{ textDecoration: 'underline' }}
                    >
                      {coder.coderName}
                    </ChakraLink>
                  </Text>
                  {coder.roleID === 1 && (
                    <ChakraLink
                      as={Link}
                      to="/admin"
                      fontSize="md"
                      fontWeight={600}
                      color="blue.500"
                      _hover={{ textDecoration: 'underline' }}
                    >
                      Trang quản trị
                    </ChakraLink>
                  )}
                  <Button
                    onClick={logout}
                    fontSize="md"
                    fontWeight={600}
                    color="white"
                    bg="red.500"
                    _hover={{ bg: 'red.600' }}
                    borderRadius="md"
                  >
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    as={Link}
                    to="/register"
                    fontSize="15px"
                    height="32px"
                    fontWeight={600}
                    color="white"
                    bg="#05a6e9"
                    _hover={{ bg: 'blue.700' }}
                    borderRadius="md"
                    border="1px solid purple"
                  >
                    Đăng ký
                  </Button>

                  <Button
                    as={Link}
                    to="/login"
                    fontSize="15px"
                    height="32px"
                    fontWeight={500}
                    color="gray.600"
                    backgroundColor="#f2f0fc"
                    _hover={{ color: 'blue.500' }}
                    border="1px solid purple"
                    borderRadius="md"
                  >
                    Đăng nhập
                  </Button>
                </>
              )}
            </Flex>
          </Flex>
        </Box>
      </Box>
    </motion.div>
  );
}
