import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
  Spinner,
  Avatar,
} from '@chakra-ui/react';
import api from 'utils/api';
import { InfoIcon } from '@chakra-ui/icons';
const Leaderboard = ({ contest }) => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      if (contest.status === 2) {
        setLoading(false); // Không cần fetch nếu ẩn leaderboard
        return;
      }

      try {
        const res = await api.get(
          `/Contest/ranking-contest?contestID=${contest.contestID}`,
        );
        setRanking(res.data);
      } catch (err) {
        console.error('Failed to load ranking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [contest]);

  return (
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
          {ranking.slice(0, 3).map((user, idx) => (
            <Avatar
              key={user.participationID}
              src={user.avatar}
              size="sm"
              zIndex={3 - idx}
              ml={idx !== 0 ? -2 : 0}
            />
          ))}
        </HStack>
      </Flex>

      {contest.status === 2 ? (
        <Flex
          align="center"
          justify="center"
          direction="column"
          color="gray.500"
          rounded="md"
          borderColor="gray.200"
        >
          <Text fontSize="md" fontStyle="italic">
            Bảng xếp hạng sẽ được hiển thị sau khi kỳ thi kết thúc.
          </Text>
        </Flex>
      ) : loading ? (
        <Spinner />
      ) : (
        <VStack spacing={2} align="stretch">
          {ranking.map((user, index) => (
            <Flex
              key={user.participationID}
              justify="space-between"
              align="center"
              px={4}
              py={2}
              rounded="md"
              bg={
                index === 0
                  ? 'yellow.100'
                  : index === 1
                  ? 'gray.100'
                  : index === 2
                  ? 'orange.50'
                  : 'white'
              }
              _hover={{ bg: 'gray.50' }}
            >
              <HStack spacing={3}>
                <Text fontWeight="bold" minW="24px">
                  #{user.rank}
                </Text>
                <Avatar size="sm" src={user.avatar} name={user.coderName} />
                <Text>{user.coderName}</Text>
              </HStack>
              <Text fontWeight="semibold" color="orange.500">
                {user.pointScore}
              </Text>
            </Flex>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default Leaderboard;
