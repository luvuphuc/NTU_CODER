import { Box, Flex, Text } from '@chakra-ui/react';
import { IoIosAlert } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const AuthToast = () => {
  const navigate = useNavigate();

  return (
    <Flex
      align="center"
      justify="center"
      bgColor="#48407D"
      borderRadius="full"
      boxShadow="lg"
      px={4}
      py={2}
      w="max-content"
      mx="auto"
    >
      <Box as="span" fontSize="lg" color="yellow" mr={2}>
        <IoIosAlert />
      </Box>
      <Text fontSize="sm" color="white">
        Please{' '}
        <Box
          as="span"
          color="yellow"
          fontWeight="bold"
          cursor="pointer"
          onClick={() => navigate('/register')}
          _hover={{ textDecoration: 'underline', color: 'yellow.300' }}
        >
          Register
        </Box>{' '}
        or{' '}
        <Box
          as="span"
          color="yellow"
          fontWeight="bold"
          cursor="pointer"
          onClick={() => navigate('/login')}
          _hover={{ textDecoration: 'underline', color: 'yellow.300' }}
        >
          Sign in
        </Box>
        .
      </Text>
    </Flex>
  );
};

export default AuthToast;
