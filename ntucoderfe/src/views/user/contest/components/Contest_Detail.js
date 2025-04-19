import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Container,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  Divider,
  Tooltip,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { MdOutlineSportsEsports } from 'react-icons/md';
import { CiViewList } from 'react-icons/ci';
import { BsDot } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import LayoutUser from 'layouts/user';
import api from 'utils/api';
import { HiChevronLeft } from 'react-icons/hi';
import AuthToast from '../../../auth/auth_toast.js';
import Cookies from 'js-cookie';
import FullPageSpinner from 'components/spinner/FullPageSpinner.jsx';
export default function ContestDetailPage() {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const token = Cookies.get('token');
  const toast = useToast();
  const navigate = useNavigate();
  const checkRegStatus = async () => {
    if (!token) {
      return;
    }
    try {
      const response = await api.get(`/Participation/check?contestID=${id}`);
      setIsRegistered(response.data.registed);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleParticipation = async () => {
    if (!token) {
      toast({
        position: 'top',
        duration: 3000,
        isClosable: true,
        render: () => <AuthToast />,
      });
      return;
    }
    if (isRegistered) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post('/Participation/create', {
        contestID: id,
      });
      if (response.status === 201) {
        setIsRegistered(true);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await api.get(`/Contest/${id}`);
        setContest(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchContest();
  }, [id]);

  useEffect(() => {
    if (!contest) return;
    checkRegStatus();
    const updateCountdown = () => {
      const now = new Date();
      const startTime = new Date(contest.startTime);
      const duration = contest.duration || 90;
      const endTime = new Date(startTime.getTime() + duration * 60000);

      const hasStarted = now >= startTime;
      const targetTime = hasStarted ? endTime : startTime;
      const diff = targetTime - now;

      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      setCountdown({
        hasStarted,
        days,
        hours,
        minutes,
        seconds,
      });
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [contest]);

  const formatTime = (date) => {
    const weekdays = [
      'Chủ nhật',
      'Thứ 2',
      'Thứ 3',
      'Thứ 4',
      'Thứ 5',
      'Thứ 6',
      'Thứ 7',
    ];
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const d = new Date(date);

    const dayOfWeek = weekdays[d.getDay()];
    const formattedDate = d
      .toLocaleDateString('vi-VN', options)
      .replace(',', ',', '');

    return `${dayOfWeek}, ${formattedDate}`;
  };

  const formatCountdown = ({ days, hours, minutes, seconds }) =>
    `${days} ngày : ${hours} giờ : ${minutes} phút : ${seconds} giây`;

  if (!contest || !countdown) return <FullPageSpinner />;

  return (
    <LayoutUser>
      <Box>
        <Container maxW="7xl" py={0} px={{ base: 4, md: 8 }}>
          <Box p={6} minH="100vh">
            <Flex align="center" mb={6}>
              <IconButton
                icon={<HiChevronLeft />}
                aria-label="Back"
                variant="ghost"
                borderRadius="md"
                backgroundColor="gray.200"
                fontSize="2xl"
                _hover={{ backgroundColor: 'gray.200' }}
                onClick={() => navigate('/contest')}
              />
            </Flex>

            <VStack align="start" spacing={3}>
              <Heading size="2xl" color="orange.400">
                {contest.contestName}
              </Heading>

              <HStack spacing={2} align="center" wrap="wrap">
                <Text color="gray.600" fontSize="1.125rem">
                  {formatTime(contest.startTime)}
                </Text>
                <BsDot color="gray" />
                <Divider
                  orientation="vertical"
                  height="20px"
                  borderColor="green.400"
                  borderWidth="1px"
                />
                <Text fontSize="1.125rem" color="gray.700" fontWeight="medium">
                  {countdown.hasStarted
                    ? `Kết thúc trong ${formatCountdown(countdown)}`
                    : `Bắt đầu trong ${formatCountdown(countdown)}`}
                </Text>
              </HStack>

              <HStack spacing={3}>
                <Button
                  colorScheme="orange"
                  leftIcon={
                    isLoading ? (
                      <Spinner size="sm" color="white" />
                    ) : isRegistered ? (
                      <FaCheck color="green" />
                    ) : (
                      <MdOutlineSportsEsports style={{ fontSize: '1.5rem' }} />
                    )
                  }
                  height="48px"
                  fontSize="1.125rem"
                  borderRadius="md"
                  _hover={{ bg: 'orange.600' }}
                  onClick={handleParticipation}
                  isLoading={isLoading}
                  loadingText="Đang đăng ký..."
                >
                  {isRegistered
                    ? 'Đã đăng ký'
                    : token
                    ? 'Đăng ký ngay'
                    : 'Đăng ký ngay'}
                </Button>
                <Tooltip
                  label="Share"
                  borderRadius="md"
                  placement="bottom"
                  hasArrow
                >
                  <IconButton
                    icon={<ExternalLinkIcon style={{ fontSize: '1.3rem' }} />}
                    aria-label="Open"
                    variant="outline"
                    borderRadius="full"
                    width="48px"
                    height="48px"
                    padding="0"
                    _hover={{ bg: 'gray.200' }}
                    _active={{ bg: 'gray.300' }}
                  />
                </Tooltip>
              </HStack>
            </VStack>

            <Grid
              templateColumns={{ base: '1fr', md: '7fr 3fr' }}
              gap={8}
              mt={10}
            >
              <GridItem>
                <Box
                  p={6}
                  shadow="md"
                  rounded="lg"
                  bg="white"
                  borderWidth="1px"
                  borderColor="gray.200"
                >
                  <Text
                    fontSize="1.5rem"
                    fontWeight="bold"
                    color="orange.500"
                    mb={4}
                  >
                    Chào mừng đến với cuộc thi "{contest.contestName}"
                  </Text>
                  <Text
                    fontSize="1rem"
                    lineHeight="1.5"
                    color="gray.700"
                    dangerouslySetInnerHTML={{
                      __html: contest.contestDescription || 'Chưa có mô tả',
                    }}
                  />
                </Box>
              </GridItem>

              <GridItem>
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
                      {['/avatar1.png', '/avatar2.png', '/avatar3.png'].map(
                        (src, idx) => (
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
                        ),
                      )}
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
                        bg={
                          index === 0
                            ? 'yellow.100'
                            : index === 1
                            ? 'gray.100'
                            : 'white'
                        }
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

                <Box p={4} rounded="xl" bg="gray.50" shadow="md">
                  <Flex align="center" mb={4}>
                    <CiViewList
                      style={{ marginRight: '8px', fontSize: '1.5rem' }}
                    />
                    <Heading size="md" color="gray.800">
                      Danh sách bài
                    </Heading>
                  </Flex>
                  <Divider
                    orientation="horizontal"
                    borderColor="gray.400"
                    mb={4}
                  />
                  <VStack spacing={3} align="stretch">
                    {contest.problems?.length ? (
                      contest.problems.map((problem, idx) => (
                        <Flex
                          key={idx}
                          justify="space-between"
                          align="center"
                          px={4}
                          py={2}
                          rounded="md"
                          bg="white"
                          shadow="sm"
                          _hover={{ bg: 'gray.100' }}
                        >
                          <Text fontWeight="medium">
                            {problem.title || `Bài ${idx + 1}`}
                          </Text>
                          <Box
                            bg="orange.100"
                            color="orange.600"
                            px={2}
                            py={1}
                            rounded="full"
                            fontSize="sm"
                            fontWeight="semibold"
                            minW="30px"
                            textAlign="center"
                          >
                            {problem.submitCount || 0}
                          </Box>
                        </Flex>
                      ))
                    ) : (
                      <Text fontStyle="italic" color="gray.500">
                        Chưa có bài nào
                      </Text>
                    )}
                  </VStack>
                </Box>
              </GridItem>
            </Grid>
          </Box>
        </Container>
      </Box>
    </LayoutUser>
  );
}
