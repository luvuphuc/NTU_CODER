import { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Divider,
  Code,
  Badge,
  Spinner,
  SimpleGrid,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon, TimeIcon } from '@chakra-ui/icons';
import api from 'config/api';
import { useParams } from 'react-router-dom';

const statusColor = {
  Accepted: 'green',
  WrongAnswer: 'red',
  TimeLimitExceeded: 'orange',
  Pending: 'gray',
};

const statusIcon = {
  Accepted: <CheckCircleIcon color="green.500" />,
  WrongAnswer: <WarningIcon color="red.500" />,
  TimeLimitExceeded: <TimeIcon color="orange.500" />,
  Pending: <TimeIcon color="gray.500" />,
};

const DetailSubmissionPage = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await api.get(`/Submission/${id}`);
        setSubmission(res.data);
      } catch (err) {
        console.error('Failed to fetch submission', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchSubmission();
    }
  }, [id]);

  if (loading) {
    return (
      <Box p={10} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!submission) {
    return (
      <Box p={10} textAlign="center">
        <Text>Không tìm thấy submission.</Text>
      </Box>
    );
  }

  return (
    <Box pt="100px" px="25px">
      <Box p={6} maxW="6xl" mx="auto" bg="white" shadow="md" rounded="md">
        <VStack align="start" spacing={4}>
          <Heading size="lg">Chi tiết Submission</Heading>
          <Divider />

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
            <VStack align="start" spacing={4}>
              <HStack>
                <Text fontWeight="bold">Bài toán:</Text>
                <Text>{submission.problemName}</Text>
              </HStack>

              <HStack>
                <Text fontWeight="bold">Người nộp:</Text>
                <Text>{submission.coderName}</Text>
              </HStack>

              <HStack>
                <Text fontWeight="bold">Ngôn ngữ:</Text>
                <Badge colorScheme="blue">{submission.compilerName}</Badge>
              </HStack>

              <HStack>
                <Text fontWeight="bold">Thời gian nộp:</Text>
                <Text>{new Date(submission.submitTime).toLocaleString()}</Text>
              </HStack>
            </VStack>

            <VStack align="start" spacing={4}>
              <HStack>
                <Text fontWeight="bold">Thời gian chạy tối đa:</Text>
                <Text>{submission.maxTimeDuration ?? 'N/A'} ms</Text>
              </HStack>

              <HStack>
                <Text fontWeight="bold">Số lần test:</Text>
                <Text>{submission.testRunCount}</Text>
              </HStack>

              <HStack>
                <Text fontWeight="bold">Kết quả:</Text>
                <HStack>
                  {statusIcon[submission.testResult] || <TimeIcon />}
                  <Badge
                    colorScheme={statusColor[submission.testResult] || 'gray'}
                  >
                    {submission.testResult}
                  </Badge>
                </HStack>
              </HStack>

              <HStack>
                <Text fontWeight="bold">Trạng thái:</Text>
                <Badge
                  colorScheme={
                    submission.submissionStatus !== null ? 'green' : 'gray'
                  }
                >
                  {submission.submissionStatus !== null
                    ? 'Đã chấm'
                    : 'Đang chờ'}
                </Badge>
              </HStack>
            </VStack>
          </SimpleGrid>

          <Divider />

          <Box w="full">
            <Text fontWeight="bold" mb={2}>
              Source Code:
            </Text>
            <Box
              borderWidth="1px"
              borderRadius="md"
              overflowX="auto"
              maxH="500px"
              bg="gray.50"
              p={4}
            >
              <Code whiteSpace="pre" width="full">
                {submission.submissionCode}
              </Code>
            </Box>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default DetailSubmissionPage;
