import { Box, Flex, Text } from '@chakra-ui/react';
import { IoIosAlert } from 'react-icons/io';
import { AiFillCheckCircle } from 'react-icons/ai';

const CustomToast = ({ success = false, messages = '' }) => {
  return (
    <Flex
      align="center"
      justify="center"
      bgColor={success ? 'green.600' : '#48407D'}
      borderRadius="full"
      boxShadow="lg"
      px={4}
      py={2}
      w="max-content"
      mx="auto"
    >
      <Box as="span" fontSize="lg" color="yellow" mr={2}>
        {success ? <AiFillCheckCircle /> : <IoIosAlert />}
      </Box>
      <Text fontSize="sm" color="white">
        {messages}
      </Text>
    </Flex>
  );
};

export default CustomToast;
