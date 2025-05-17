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

const MotionBox = motion(Box);

function ContestSection({ title, contests }) {
  const bg = useColorModeValue('white', 'gray.800');
  const border = useColorModeValue('gray.200', 'gray.600');
  const iconColor = useColorModeValue('gray.400', 'gray.500');
  const headingColor = useColorModeValue('gray.600', 'gray.300');
  const textColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <MotionBox
      position="relative"
      mt={6}
      mb={10}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <Heading size="lg" mb={4}>
        {title}
      </Heading>

      {contests.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          p={8}
          bg={bg}
          borderRadius="xl"
          border="1px solid"
          borderColor={border}
          minH="300px"
          textAlign="center"
        >
          <Box fontSize={{ base: '60px', md: '80px' }} color={iconColor} mb={4}>
            <LuCalendarX />
          </Box>
          <Heading fontSize="lg" color={headingColor} mb={2}>
            Hiện chưa có cuộc thi nào sắp diễn ra
          </Heading>
          <Text color={textColor} fontSize="md" mb={4}>
            Hãy quay lại sau hoặc khám phá các bài tập luyện tập nhé!
          </Text>
          <Button
            as={Link}
            to="/problem"
            colorScheme="blue"
            size="md"
            borderRadius="md"
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
      boxShadow="lg"
      p={6}
      w="full"
      border="1px solid"
      borderColor={border}
      _hover={{
        boxShadow: '2xl',
        transform: 'translateY(-4px)',
        transition: 'all 0.3s ease',
      }}
    >
      <Flex justify="space-between" align="flex-start" mb={4}>
        <Box maxW="70%">
          <Heading
            fontSize="xl"
            mb={4}
            color={useColorModeValue('blue.600', 'blue.300')}
          >
            {contest.contestName}
          </Heading>
          <Box
            color={useColorModeValue('gray.700', 'gray.300')}
            fontSize="sm"
            noOfLines={3}
            dangerouslySetInnerHTML={{
              __html: contest.contestDescription || 'Chưa có mô tả.',
            }}
          />
        </Box>
        <VStack align="flex-end" spacing={2}>
          <Badge
            colorScheme={getBadgeColor(contest.status)}
            fontSize="0.8em"
            px={3}
            py={1}
            borderRadius="md"
          >
            {getStatusLabel(contest.status)}
          </Badge>
          <Text
            fontSize="sm"
            fontWeight="bold"
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
          size="md"
          borderRadius="md"
          _hover={{
            transform: 'translateY(-3px)',
            boxShadow: 'lg',
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

function getDisplayTimeLabel(status, displayTime) {
  if (status === 0) {
    return `Đã kết thúc vào ngày ${displayTime}`;
  }
  if (status === 1) {
    return `Kết thúc vào ngày ${displayTime}`;
  }
  return `Bắt đầu vào ngày ${displayTime}`;
}

export default ContestSection;
