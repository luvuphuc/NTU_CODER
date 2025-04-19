// Imports giữ nguyên như ban đầu
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
  Link,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { MdOutlineSportsEsports } from 'react-icons/md';

import { BsDot } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import LayoutUser from 'layouts/user';
import api from 'utils/api';
import { HiChevronLeft } from 'react-icons/hi';
import AuthToast from '../../../auth/auth_toast.js';
import Cookies from 'js-cookie';
import FullPageSpinner from 'components/spinner/FullPageSpinner.jsx';
import moment from 'moment-timezone';
import ContestProblemList from './ContestProblemList.jsx';
import Leaderboard from './Leaderboard.jsx';
// Format thời gian hiển thị
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
  const d = moment(date).tz('Asia/Ho_Chi_Minh');
  return `${weekdays[d.day()]}, ${d.format('D MMMM YYYY')}`;
};

const formatCountdown = ({ days, hours, minutes, seconds }) =>
  `${days} ngày : ${hours} giờ : ${minutes} phút : ${seconds} giây`;

export default function ContestDetailPage() {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const token = Cookies.get('token');

  const [contest, setContest] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasProblems, setHasProblems] = useState([]);

  // Đăng ký thi
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
    if (isRegistered) return;

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
    const fetchData = async () => {
      try {
        const contestRes = await api.get(`/Contest/${id}`);
        const contestData = contestRes.data;
        setContest(contestData);

        if (token) {
          const regRes = await api.get(`/Participation/check?contestID=${id}`);
          setIsRegistered(regRes.data.registed);
        }

        if (contestData.status === 1 || contestData.status === 2) {
          const probRes = await api.get('/HasProblem/all', {
            params: { contestId: id, ascending: true },
          });
          if (probRes.status === 200) setHasProblems(probRes.data.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    };

    fetchData();
  }, [id, token]);

  useEffect(() => {
    if (!contest) return;
    const updateCountdown = () => {
      const now = moment().tz('Asia/Ho_Chi_Minh');
      const start = moment.utc(contest.startTime).tz('Asia/Ho_Chi_Minh');
      const end = moment.utc(contest.endTime).tz('Asia/Ho_Chi_Minh');
      const hasStarted = now.isSameOrAfter(start);
      const target = hasStarted ? end : start;
      const diff = target.diff(now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown({ hasStarted, days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [contest]);

  if (!contest || !countdown) return <FullPageSpinner />;

  return (
    <LayoutUser>
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
            <HStack spacing={2} align="center">
              <Text color="gray.600" fontSize="1.125rem">
                {formatTime(contest.startTime)}
              </Text>
              <BsDot color="gray" />
              <Divider
                orientation="vertical"
                height="20px"
                borderColor="green.400"
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
                onClick={handleParticipation}
                isLoading={isLoading}
                loadingText="Đang đăng ký..."
              >
                {isRegistered ? 'Đã đăng ký' : 'Đăng ký ngay'}
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
              <Leaderboard />
              <ContestProblemList problems={hasProblems} />
            </GridItem>
          </Grid>
        </Box>
      </Container>
    </LayoutUser>
  );
}
