import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  SimpleGrid,
  Flex,
  Icon,
  useColorModeValue,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { FaUsers, FaBookOpen, FaTrophy, FaPaperPlane } from 'react-icons/fa';
import api from 'config/api';

export default function CardStatistic() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cardBg = useColorModeValue('white', 'gray.700');
  const cardShadow = useColorModeValue('xl', 'dark-lg');

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get('/Statistic/card-statistic');
        const data = res.data;

        const mappedStats = [
          {
            label: 'Tổng người dùng',
            value: data.totalCoders,
            icon: FaUsers,
            iconBgColor: 'blue.200',
          },
          {
            label: 'Tổng bài tập',
            value: data.totalProblems,
            icon: FaBookOpen,
            iconBgColor: 'green.200',
          },
          {
            label: 'Tổng cuộc thi',
            value: data.totalContests,
            icon: FaTrophy,
            iconBgColor: 'purple.200',
          },
          {
            label: 'Số lượt gửi bài',
            value: data.totalSubmissions,
            icon: FaPaperPlane,
            iconBgColor: 'orange.200',
          },
        ];

        setStats(mappedStats);
      } catch (err) {
        setError(err.message || 'Error fetching statistics');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading)
    return (
      <Center py={10}>
        <Spinner size="xl" />
      </Center>
    );

  if (error)
    return (
      <Center py={5}>
        <Text color="red.500">Error: {error}</Text>
      </Center>
    );

  return (
    <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8} mb={6}>
      {stats.map(({ label, value, icon, iconBgColor }) => (
        <Box
          key={label}
          bg={cardBg}
          boxShadow={cardShadow}
          borderRadius="md"
          p={6}
          transition="transform 0.3s ease"
          _hover={{ transform: 'scale(1.05)', boxShadow: '2xl' }}
          cursor="default"
        >
          <Flex align="center" justify="center">
            <Box
              bg={iconBgColor}
              p={3}
              borderRadius="full"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              mr={4}
              boxShadow="md"
            >
              <Icon as={icon} w={4} h={4} color={`${iconBgColor}.800`} />
            </Box>
            <Text fontWeight="semibold" color="gray.600" fontSize="lg">
              {label}
            </Text>
          </Flex>
          <Text
            fontSize="4xl"
            fontWeight="bold"
            color="gray.800"
            textAlign="center"
          >
            {value}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  );
}
