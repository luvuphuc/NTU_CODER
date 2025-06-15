import React from 'react';
import {
  Box,
  Heading,
  Text,
  Badge,
  Button,
  Flex,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { LuCalendarX } from 'react-icons/lu';
import { motion } from 'framer-motion';
import moment from 'moment-timezone';
const MotionBox = motion(Box);

export default function ContestSection({ title, contests }) {
  const bg = useColorModeValue('white', 'gray.800');
  const border = useColorModeValue('gray.200', 'gray.600');
  const iconColor = useColorModeValue('gray.400', 'gray.500');
  const headingColor = useColorModeValue('gray.700', 'gray.200');
  const textColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <MotionBox
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <Heading fontSize="2xl" color={headingColor} mb={6}>
        {title}
      </Heading>

      {contests.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          p={10}
          bg={bg}
          borderRadius="2xl"
          border="1px dashed"
          borderColor={border}
          minH="300px"
          textAlign="center"
        >
          <Box fontSize={{ base: '60px', md: '80px' }} color={iconColor} mb={4}>
            <LuCalendarX />
          </Box>
          <Heading fontSize="lg" color={headingColor} mb={2}>
            Không có cuộc thi nào sắp diễn ra
          </Heading>
          <Text color={textColor} fontSize="md" mb={4}>
            Quay lại sau hoặc luyện tập ngay để nâng cao kỹ năng!
          </Text>
          <Button
            as={Link}
            to="/problem"
            colorScheme="blue"
            size="md"
            borderRadius="lg"
            _hover={{ bg: 'blue.600' }}
          >
            Luyện tập ngay
          </Button>
        </Flex>
      ) : (
        <VStack spacing={6}>
          {contests.map((contest) => (
            <ContestCard key={contest.contestID} contest={contest} />
          ))}
        </VStack>
      )}
    </MotionBox>
  );
}

function ContestCard({ contest }) {
  const bg = useColorModeValue('white', 'gray.700');
  const border = useColorModeValue('gray.200', 'gray.600');

  const displayTime =
    contest.status === 0 || contest.status === 1
      ? formatDateTime(contest.endTime)
      : formatDateTime(contest.startTime);

  return (
    <Box
      bg={bg}
      borderRadius="2xl"
      boxShadow="md"
      p={6}
      w="full"
      border="1px solid"
      borderColor={border}
      _hover={{
        boxShadow: 'lg',
        transform: 'translateY(-4px)',
        transition: 'all 0.3s ease',
      }}
    >
      <Flex justify="space-between" align="start" mb={4} gap={4}>
        <Box maxW="75%">
          <Heading
            fontSize="xl"
            mb={2}
            color={useColorModeValue('blue.600', 'blue.300')}
          >
            {contest.contestName}
          </Heading>
          <Box
            color={useColorModeValue('gray.600', 'gray.300')}
            fontSize="sm"
            noOfLines={3}
            dangerouslySetInnerHTML={{
              __html: contest.contestDescription || 'Chưa có mô tả.',
            }}
          />
        </Box>
        <VStack align="end" spacing={2}>
          <Badge
            colorScheme={getBadgeColor(contest.status)}
            fontSize="0.75rem"
            px={3}
            py={1}
            borderRadius="full"
          >
            {getStatusLabel(contest.status)}
          </Badge>
          <Text
            fontSize="sm"
            fontWeight="medium"
            color={useColorModeValue('gray.600', 'gray.400')}
          >
            {getDisplayTimeLabel(contest.status, displayTime)}
          </Text>
        </VStack>
      </Flex>

      <Flex justify="flex-end">
        <Button
          as={Link}
          to={`/contest/${contest.contestID}`}
          colorScheme="blue"
          size="sm"
          borderRadius="md"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'md',
            transition: 'transform 0.2s ease',
          }}
        >
          {contest.status === 0
            ? 'Chi tiết'
            : contest.status === 1
            ? 'Vào thi'
            : 'Đăng ký'}
        </Button>
      </Flex>
    </Box>
  );
}

function getBadgeColor(status) {
  return status === 0 ? 'red' : status === 1 ? 'green' : 'blue';
}

function getStatusLabel(status) {
  return status === 0
    ? 'Đã kết thúc'
    : status === 1
    ? 'Đang diễn ra'
    : 'Sắp diễn ra';
}

function formatDateTime(dateTime) {
  return moment
    .utc(dateTime)
    .tz('Asia/Ho_Chi_Minh')
    .format('DD-MM-YYYY - HH:mm');
}

function getDisplayTimeLabel(status, displayTime) {
  if (status === 0) {
    return `Đã kết thúc: ${displayTime}`;
  }
  if (status === 1) {
    return `Kết thúc: ${displayTime}`;
  }
  return `Bắt đầu: ${displayTime}`;
}
