import React from 'react';
import {
  Box,
  Heading,
  Text,
  Stack,
  Badge,
  Button,
  Card,
  CardBody,
  Link as ChakraLink,
  Flex,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

function ContestSection({ title, contests }) {
  return (
    <Box position="relative">
      <Heading size="lg" mb={4}>
        {title}
      </Heading>
      {contests.length === 0 ? (
        <Text color="gray.500">Không có cuộc thi nào.</Text>
      ) : (
        <Swiper
          modules={[Navigation]}
          navigation={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={3}
          style={{ padding: '20px 0' }}
          className="custom-swiper"
        >
          {contests.map((contest) => (
            <SwiperSlide key={contest.contestID}>
              <ContestCard contest={contest} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Box>
  );
}

function ContestCard({ contest }) {
  const displayTime =
    contest.status === 0 || contest.status === 1
      ? formatDateTime(contest.endTime)
      : formatDateTime(contest.startTime);

  return (
    <Card
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      transition="transform 0.2s"
      _hover={{ transform: 'scale(1.02)', boxShadow: 'lg' }}
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      maxW="400px"
    >
      <CardBody>
        <Stack spacing={3} p={4} position="relative">
          <Flex justify="space-between" align="center">
            <ChakraLink as={Link} to={`/contest/${contest.contestID}`}>
              <Text fontWeight="bold" fontSize="xl" color="blue.500">
                {contest.contestName.length > 20
                  ? `${contest.contestName.slice(0, 20)}...`
                  : contest.contestName}
              </Text>
            </ChakraLink>
            <Badge
              colorScheme={getBadgeColor(contest.status)}
              position="absolute"
              top={2}
              right={2}
              fontSize="0.8em"
            >
              {getStatusLabel(contest.status)}
            </Badge>
          </Flex>
          <Text fontSize="md" fontWeight="medium" color="gray.700">
            {getDisplayTimeLabel(contest.status, displayTime)}
          </Text>
          <Flex justifyContent="flex-end" alignItems="flex-end" mt={2}>
            <Button
              bg="blue.500"
              color="white"
              size="md"
              fontSize="lg"
              fontWeight="bold"
              px={6}
              py={4}
              borderRadius="md"
              boxShadow="lg"
              _hover={{
                bg: 'gray.500',
                color: 'white',
                transform: 'scale(1.05)',
                boxShadow: 'xl',
              }}
              as={Link}
              to={`/contest/${contest.contestID}`}
            >
              {contest.status === 0
                ? 'Chi tiết'
                : contest.status === 1
                ? 'Vào thi'
                : 'Đăng ký'}
            </Button>
          </Flex>
        </Stack>
      </CardBody>
    </Card>
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
