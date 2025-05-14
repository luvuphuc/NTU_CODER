import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Heading,
  Flex,
  Icon,
  HStack,
  VStack,
  Tooltip,
  Button,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import { FaUsers, FaCalendarAlt } from 'react-icons/fa';
import api from 'config/api';

export default function OnGoingContests() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOngoingContests = async () => {
      try {
        const response = await api.get('/contest/ongoing');
        setContests(response.data || []);
      } catch (error) {
        console.error('Error fetching ongoing contests:', error);
        setContests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOngoingContests();
  }, []);

  if (loading) {
    return (
      <Box mt={8} mb={10}>
        <Heading fontSize="2xl" mb={6} ml={2}>
          Cuộc thi đang diễn ra
        </Heading>
        <VStack spacing={6}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Box
              key={index}
              bgGradient="linear(to-br, white, gray.50)"
              borderRadius="2xl"
              boxShadow="lg"
              p={6}
              w="full"
              border="1px solid"
              borderColor="gray.100"
            >
              <Skeleton height="24px" mb={4} />
              <SkeletonText noOfLines={3} spacing="4" />
              <HStack justify="space-between" mt={4}>
                <Skeleton height="20px" width="120px" />
                <Skeleton height="20px" width="120px" />
              </HStack>
              <Flex justify="flex-end" mt={4}>
                <Skeleton height="36px" width="100px" borderRadius="md" />
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
    );
  }

  if (!contests.length) return null;

  return (
    <Box mt={8} mb={10}>
      <Heading fontSize="2xl" mb={6} ml={2}>
        Cuộc thi đang diễn ra
      </Heading>
      <VStack spacing={6}>
        {contests.map((contest) => (
          <Box
            key={contest.contestID}
            bgGradient="linear(to-br, white, gray.50)"
            borderRadius="2xl"
            boxShadow="lg"
            p={6}
            w="full"
            border="1px solid"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transform: 'translateY(-4px)',
              transition: 'all 0.3s ease',
            }}
          >
            <Flex justify="space-between" align="flex-start" mb={4}>
              <Box maxW="70%">
                <Heading fontSize="xl" mb={4}>
                  {contest.contestName}
                </Heading>
                <Box
                  color="gray.700"
                  fontSize="sm"
                  noOfLines={3}
                  dangerouslySetInnerHTML={{
                    __html: contest.contestDescription || 'Chưa có mô tả.',
                  }}
                />
              </Box>
              <VStack align="flex-end" spacing={2}>
                <Tooltip label="Số người tham gia" hasArrow>
                  <HStack spacing={1}>
                    <Icon as={FaUsers} boxSize={4} color="blue.500" />
                    <Text fontSize="sm" fontWeight="semibold">
                      {contest.participationCount ?? 0} người tham gia
                    </Text>
                  </HStack>
                </Tooltip>
                <Tooltip label="Ngày kết thúc" hasArrow>
                  <HStack spacing={1}>
                    <Icon as={FaCalendarAlt} boxSize={4} color="red.500" />
                    <Text fontSize="sm">
                      Kết thúc: {new Date(contest.endTime).toLocaleString()}
                    </Text>
                  </HStack>
                </Tooltip>
              </VStack>
            </Flex>

            <Flex justify="flex-end">
              <Button
                as="a"
                href={`/contest/${contest.contestID}`}
                colorScheme="blue"
                variant="solid"
                borderRadius="md"
                size="md"
                _hover={{
                  transform: 'translateY(-3px)',
                  boxShadow: 'lg',
                  transition: 'transform 0.2s ease',
                }}
              >
                Vào thi ngay
              </Button>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
