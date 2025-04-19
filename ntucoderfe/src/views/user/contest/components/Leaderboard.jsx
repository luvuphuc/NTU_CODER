import React from 'react';
import {
  Box,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';

const Leaderboard = () => (
  <Box
    p={4}
    rounded="xl"
    bgGradient="linear(to-br, orange.50, white)"
    shadow="md"
    mb={6}
  >
    <Flex align="center" justify="space-between" mb={4}>
      <Heading size="md" color="orange.500">
        Bảng xếp hạng
      </Heading>
      <HStack spacing={-2}>
        {['/avatar1.png', '/avatar2.png', '/avatar3.png'].map((_, idx) => (
          <Box
            key={idx}
            boxSize="8"
            bg="gray.200"
            borderRadius="full"
            border="2px solid white"
            zIndex={3 - idx}
            position="relative"
            ml={idx !== 0 ? -2 : 0}
          />
        ))}
      </HStack>
    </Flex>

    <VStack spacing={2} align="stretch">
      {[
        { name: 'Nguyễn Văn A', score: 100 },
        { name: 'Trần Thị B', score: 95 },
      ].map((user, index) => (
        <Flex
          key={index}
          justify="space-between"
          align="center"
          px={4}
          py={2}
          rounded="md"
          bg={index === 0 ? 'yellow.100' : index === 1 ? 'gray.100' : 'white'}
          _hover={{ bg: 'gray.50' }}
        >
          <HStack spacing={3}>
            <Text fontWeight="bold" minW="24px">
              #{index + 1}
            </Text>
            <Box
              boxSize="8"
              bg="gray.300"
              rounded="full"
              border="2px solid white"
            />
            <Text>{user.name}</Text>
          </HStack>
          <Text fontWeight="semibold" color="orange.500">
            {user.score}
          </Text>
        </Flex>
      ))}
    </VStack>
  </Box>
);

export default Leaderboard;
