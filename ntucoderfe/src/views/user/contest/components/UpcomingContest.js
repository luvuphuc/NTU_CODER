import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Flex,
  Text,
  Stack,
  Button,
  Badge,
  Skeleton,
} from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';
import api from 'utils/api';
import { LuClock } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const UpcomingContests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await api.get('/Contest/upcoming');
        setContests(response.data || []);
      } catch (error) {
        console.error('Error fetching contests:', error);
        setContests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  // Sử dụng Skeleton Loader khi đang load dữ liệu
  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Stack spacing={6}>
          {Array(3)
            .fill('')
            .map((_, index) => (
              <Skeleton key={index} height="250px" borderRadius="xl" />
            ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      mb={8}
      p={6}
      bgGradient="linear(to-r, blue.500, cyan.500)"
      borderRadius="lg"
      boxShadow="lg"
      textAlign="center"
    >
      <Heading
        size="lg"
        mb={6}
        color="white"
        textShadow="2px 2px 8px rgba(0,0,0,0.3)"
      >
        Cuộc thi sắp diễn ra
      </Heading>
      <Flex wrap="wrap" justify="center" gap={6}>
        {contests.map((contest) => (
          <ContestCard key={contest.contestID} contest={contest} />
        ))}
      </Flex>
    </Box>
  );
};

const ContestCard = ({ contest }) => {
  const [timeObj, setTimeObj] = useState(
    getTimeRemainingValues(contest.startTime),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeObj(getTimeRemainingValues(contest.startTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [contest.startTime]);

  const isStarted = new Date(contest.startTime) - new Date() <= 0;
  const pad = (num) => String(num).padStart(2, '0');

  return (
    <MotionBox
      p={5}
      borderRadius="xl"
      bgGradient="linear(to-br, white, gray.100)"
      boxShadow="xl"
      mx={8}
      border="1px solid"
      borderColor="gray.200"
      transition="all 0.3s"
      _hover={{
        transform: 'scale(1.05)',
        boxShadow: '2xl',
        background: 'linear-gradient(to-br, #ffffff, #f0f0f0)',
      }}
      width={{ base: '100%', md: '300px' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Stack spacing={3}>
        <Flex align="center" gap={2}>
          <CalendarIcon color="blue.500" boxSize={5} />
          <Link
            to={`/contest/${contest.contestID}`}
            style={{ textDecoration: 'none' }}
          >
            <Heading
              size="md"
              color="black"
              _hover={{ color: 'blue.500', textDecoration: 'none' }}
            >
              {contest.contestName}
            </Heading>
          </Link>
        </Flex>
        <Flex justify="center" align="center">
          <LuClock size={20} color="gray.600" />
          <Text ml={2} color="gray.600" fontSize="md" fontWeight="bold">
            Bắt đầu: {formatDateTime(contest.startTime)}
          </Text>
        </Flex>
        {isStarted ? (
          <Text
            fontSize="lg"
            fontWeight="bold"
            color="red.500"
            textAlign="center"
          >
            Đã bắt đầu
          </Text>
        ) : (
          <Flex justify="center" align="center">
            <CountdownBox value={pad(timeObj.days)} label="Ngày" />
            <Text mx={1} fontSize="lg" fontWeight="bold" color="red.500">
              :
            </Text>
            <CountdownBox value={pad(timeObj.hours)} label="Giờ" />
            <Text mx={1} fontSize="lg" fontWeight="bold" color="red.500">
              :
            </Text>
            <CountdownBox value={pad(timeObj.minutes)} label="Phút" />
            <Text mx={1} fontSize="lg" fontWeight="bold" color="red.500">
              :
            </Text>
            <CountdownBox value={pad(timeObj.seconds)} label="Giây" />
          </Flex>
        )}
        <Button
          colorScheme="blue"
          size="sm"
          borderRadius="md"
          boxShadow="md"
          _hover={{
            bg: 'blue.600',
            transform: 'scale(1.05)',
            boxShadow: 'xl',
          }}
          transition="all 0.2s ease-in-out"
        >
          Xem Chi Tiết
        </Button>
      </Stack>
    </MotionBox>
  );
};

const CountdownBox = ({ value, label }) => {
  return (
    <Box
      border="1px solid"
      borderColor="gray.300"
      p={2}
      borderRadius="md"
      textAlign="center"
      minW="50px"
    >
      <Text fontSize="lg" fontWeight="bold" color="red.500">
        {value}
      </Text>
      <Text fontSize="sm" color="gray.600">
        {label}
      </Text>
    </Box>
  );
};

function formatDateTime(dateTime) {
  const date = new Date(dateTime);
  return `${date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })} - ${date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })}`;
}

function getTimeRemainingValues(startTime) {
  const total = new Date(startTime) - new Date();
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds };
}

export default UpcomingContests;
