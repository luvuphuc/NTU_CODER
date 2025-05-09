import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Heading,
  Flex,
  Stack,
  Button,
  Badge,
  Skeleton,
  Icon,
} from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';
import api from 'utils/api';
import { LuClock } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSadTear } from 'react-icons/fa';
import moment from 'moment-timezone';

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
        console.error('Error:', error);
        setContests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

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

      {loading ? (
        <Stack spacing={6}>
          {Array(3)
            .fill('')
            .map((_, index) => (
              <Skeleton key={index} height="250px" borderRadius="xl" />
            ))}
        </Stack>
      ) : !contests.length ? (
        <Flex direction="column" justify="center" align="center" minH="300px">
          <Icon as={FaSadTear} boxSize={12} color="white" mb={4} />
          <Text fontSize="lg" fontWeight="bold" color="white">
            Hiện tại chưa có cuộc thi nào sắp bắt đầu
          </Text>
        </Flex>
      ) : (
        <Flex wrap="wrap" justify="center" gap={6}>
          {contests.map((contest) => (
            <ContestCard key={contest.contestID} contest={contest} />
          ))}
        </Flex>
      )}
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

  const isStarted = moment().isSameOrAfter(
    moment.utc(contest.startTime).tz('Asia/Ho_Chi_Minh'),
  );

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
        <Link to={`/contest/${contest.contestID}`}>
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
        </Link>
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
  return moment
    .utc(dateTime)
    .tz('Asia/Ho_Chi_Minh')
    .format('DD-MM-YYYY - HH:mm');
}

function getTimeRemainingValues(startTime) {
  const now = moment.tz('Asia/Ho_Chi_Minh');
  const start = moment.utc(startTime).tz('Asia/Ho_Chi_Minh');
  const duration = moment.duration(start.diff(now));

  if (duration.asMilliseconds() <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(duration.asDays()),
    hours: duration.hours(),
    minutes: duration.minutes(),
    seconds: duration.seconds(),
  };
}

export default UpcomingContests;
