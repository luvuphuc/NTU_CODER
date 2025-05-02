import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Avatar,
  Text,
  Stack,
  Divider,
  Grid,
  Tooltip,
  Container,
  CircularProgress,
  CircularProgressLabel,
  useDisclosure,
} from '@chakra-ui/react';
import { FaEye, FaCheckSquare, FaComments } from 'react-icons/fa';
import { AiFillHeart } from 'react-icons/ai';
import moment from 'moment-timezone';
import Layout from 'layouts/user';
import { useMotionValue, animate } from 'framer-motion';
import api from 'utils/api';
import { useParams } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import { motion } from 'framer-motion';
import DetailUserModal from './DetailUserModal';
const ProfileCoder = () => {
  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { coder } = useAuth();
  const isOwnProfile = coder?.coderID?.toString() === id;
  console.log(isOwnProfile);
  const progress = useMotionValue(0);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [submissions, setSubmissions] = useState([]);
  const [contests, setContests] = useState([]);
  const [coderProfile, setCoderProfile] = useState(null);
  const [totalProblems, setTotalProblems] = useState(1);
  const percentage = coderProfile
    ? (coderProfile.countProblemSolved / totalProblems) * 100
    : 0;
  const fetchProfileData = async () => {
    try {
      const [submissionRes, contestRes, coderRes, problemRes] =
        await Promise.all([
          api.get(`/Submission/profile?coderID=${id}`),
          api.get(`/Contest/profile?coderID=${id}`),
          api.get(`/Coder/profile/?coderID=${id}`),
          api.get('/Problem/count'),
        ]);
      setSubmissions(submissionRes.data || []);
      setContests(contestRes.data || []);
      setCoderProfile(coderRes.data || null);
      setTotalProblems(problemRes.data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu profile:', error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [id]);
  useEffect(() => {
    const controls = animate(progress, percentage, {
      duration: 1.5,
      ease: 'easeOut',
    });
    return controls.stop;
  }, [percentage, progress]);

  useEffect(() => {
    const unsubscribe = progress.on('change', (v) => {
      setAnimatedPercentage(Math.round(v));
    });
    return unsubscribe;
  }, [progress]);
  const handleModalClose = () => {
    fetchProfileData();
    onClose();
  };
  return (
    <Layout>
      <Container maxW={{ base: 'sm', md: '7xl' }}>
        <Flex p={6} gap={6} flexWrap="wrap">
          {/* Left Sidebar */}
          <Box w="300px" bg="white" boxShadow="md" rounded="xl" p={5} h="100%">
            <Flex direction="column" align="center" gap={2}>
              <Avatar size="xl" src={coderProfile?.avatar} />
              <Text fontWeight="bold">{coderProfile?.coderName || ''}</Text>
              <Text
                fontSize="sm"
                color="gray.500"
                wordBreak="break-word"
                whiteSpace="pre-wrap"
                textAlign="center"
              >
                {coderProfile?.description || ''}
              </Text>

              {isOwnProfile && (
                <Button
                  size="sm"
                  onClick={onOpen}
                  borderRadius="md"
                  colorScheme="green"
                  mt={3}
                >
                  Chỉnh sửa hồ sơ
                </Button>
              )}
              <DetailUserModal
                isOpen={isOpen}
                onClose={handleModalClose}
                coderProfile={coderProfile}
              />
            </Flex>

            <Divider my={5} />

            {/* Community Stats */}
            <Box>
              <Text fontWeight="bold" mb={3}>
                Thống kê
              </Text>
              <Stack spacing={3}>
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap={2}>
                    <FaCheckSquare />
                    <Text fontSize="sm">Đã giải</Text>
                  </Flex>
                  <Text fontSize="sm">
                    {coderProfile?.countProblemSolved || 0}
                  </Text>
                </Flex>
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap={2}>
                    <FaComments />
                    <Text fontSize="sm">Blog</Text>
                  </Flex>
                  <Text fontSize="sm">0</Text>
                </Flex>
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap={2}>
                    <AiFillHeart />
                    <Text fontSize="sm">Yêu thích</Text>
                  </Flex>
                  <Text fontSize="sm">
                    {coderProfile?.countFavourites || 0}
                  </Text>
                </Flex>
              </Stack>
            </Box>

            <Divider my={5} />

            {/* Languages */}
            <Box>
              <Text fontWeight="bold" mb={2}>
                Ngôn ngữ
              </Text>
              {coderProfile?.languages?.length > 0 ? (
                coderProfile.languages.map((lang, index) => (
                  <Box key={index} mb={2}>
                    <Text fontSize="md" color="gray.600">
                      {lang.compilerName}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {lang.solvedCount} bài đã giải
                    </Text>
                  </Box>
                ))
              ) : (
                <Text color="gray.500" fontSize="sm">
                  Chưa có ngôn ngữ nào.
                </Text>
              )}
            </Box>
          </Box>

          {/* Right Content */}
          <Box
            flex="1"
            minW="300px"
            bg="white"
            boxShadow="md"
            rounded="xl"
            p={5}
            h="100%"
          >
            {/* Solved Section */}
            <Box
              mb={5}
              p={6}
              bgGradient="linear(to-r, blue.500, cyan.500)"
              borderRadius="lg"
              boxShadow="lg"
              position="relative"
            >
              <Stack spacing={3} align="center" justify="center">
                <motion.div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    width: '200px',
                    height: '200px',
                  }}
                  initial={{ rotateY: 0 }}
                  whileHover={{ rotateY: 180 }}
                  transition={{ duration: 0.5 }}
                >
                  <CircularProgress
                    value={progress.get()}
                    size="200px"
                    thickness="8px"
                    color="yellow.400"
                    trackColor="blue.300"
                  >
                    <CircularProgressLabel>
                      <Flex direction="column" align="center" justify="center">
                        <Text
                          fontSize="3xl"
                          fontWeight="bold"
                          color="yellow.400"
                        >
                          {coderProfile?.countProblemSolved || 0}
                          <Text as="span" fontSize="xl" color="white">
                            /{totalProblems}
                          </Text>
                        </Text>
                        <Flex align="center" gap={1}>
                          <Box
                            w="10px"
                            h="10px"
                            bg="yellow.400"
                            rounded="full"
                            display="inline-block"
                          />
                          <Text
                            fontSize="sm"
                            color="white"
                            fontWeight="semibold"
                          >
                            Đã giải
                          </Text>
                        </Flex>
                      </Flex>
                    </CircularProgressLabel>
                  </CircularProgress>
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transform: 'rotateY(180deg)',
                      background: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: '50%',
                      opacity: 0,
                    }}
                    whileHover={{ opacity: 1 }}
                  >
                    <Text fontSize="3xl" color="white" fontWeight="bold">
                      {Math.round(percentage)}%
                    </Text>
                  </motion.div>
                </motion.div>
              </Stack>

              <Box mt={4} textAlign="center">
                <Text color="white" fontSize="md" fontWeight="medium">
                  Chúc mừng bạn đã giải quyết{' '}
                  <Text as="span" color="yellow" fontWeight="bold">
                    {coderProfile?.countProblemSolved || 0} bài tập!
                  </Text>
                </Text>

                <Text color="white" fontSize="sm" mt={2}>
                  Tiếp tục giải quyết các bài tập khác để đạt được mục tiêu!
                </Text>
              </Box>
            </Box>

            <Divider my={5} />

            {/* Cuộc thi đã tham gia */}
            <Box mb={5}>
              <Text fontWeight="bold" fontSize="lg" mb={2}>
                Cuộc thi đã tham gia
              </Text>
              <Stack spacing={4}>
                {contests.map((contest, idx) => (
                  <Box
                    key={idx}
                    p={4}
                    bg="gray.50"
                    rounded="md"
                    shadow="sm"
                    borderLeft="4px solid"
                    borderColor="blue.400"
                  >
                    <Flex justify="space-between" align="center">
                      <Text fontWeight="semibold" fontSize="md">
                        {contest.contestName}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {moment
                          .utc(contest.startTime)
                          .tz('Asia/Ho_Chi_Minh')
                          .format('DD/MM/YYYY')}{' '}
                        -{' '}
                        {moment
                          .utc(contest.endTime)
                          .tz('Asia/Ho_Chi_Minh')
                          .format('DD/MM/YYYY')}
                      </Text>
                    </Flex>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Divider my={5} />

            {/* Submissions */}
            <Box>
              <Flex align="center" justify="space-between" mb={3}>
                <Text fontWeight="bold">Danh sách bài đã nộp</Text>
              </Flex>
              {submissions.map((s) => (
                <Box
                  key={s.submissionID}
                  p={3}
                  bg="gray.50"
                  rounded="md"
                  mb={2}
                >
                  <Flex justify="space-between" align="flex-center">
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      isTruncated
                      maxW="60%"
                    >
                      {s.problemName}
                    </Text>
                    <Box textAlign="right">
                      <Text fontSize="sm" fontWeight="bold">
                        Kết quả:{' '}
                        <Text
                          as="span"
                          fontWeight="semibold"
                          color={
                            s.testResult === 'Accepted'
                              ? 'green.500'
                              : 'red.500'
                          }
                        >
                          {s.testResult}
                        </Text>
                      </Text>
                      <Text fontSize="sm" fontWeight="bold">
                        Trạng thái:{' '}
                        <Text
                          as="span"
                          fontWeight="bold"
                          color={
                            s.submissionStatus === 1
                              ? 'green.500'
                              : 'orange.500'
                          }
                        >
                          {s.submissionStatus === 1 ? 'Đã xong' : 'Đang chờ'}
                        </Text>
                      </Text>
                      <Text fontSize="xs" color="gray.500" fontWeight="bold">
                        Thời gian nộp:{' '}
                        {s.submitTime === '0001-01-01T00:00:00'
                          ? 'N/A'
                          : moment
                              .utc(s.submitTime)
                              .tz('Asia/Ho_Chi_Minh')
                              .format('DD/MM/YYYY HH:mm:ss')}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </Box>
          </Box>
        </Flex>
      </Container>
    </Layout>
  );
};

export default ProfileCoder;
