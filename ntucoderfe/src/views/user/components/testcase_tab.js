import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  VStack,
  Text,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import api from 'utils/api';

const TestCasesComponent = () => {
  const { id: problemId } = useParams();
  const [testCase, setTestCase] = useState(null); // State for a single test case
  const [problem, setProblem] = useState({});

  const bgColor = useColorModeValue('gray.800', 'gray.800');
  const textColor = useColorModeValue('gray.100', 'gray.100');
  const selectedBg = useColorModeValue('gray.700', 'gray.700');
  const hoverBg = useColorModeValue('gray.600', 'gray.600');

  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        const response = await api.get(
          `/TestCase/sampleTest?problemId=${problemId}`,
        );
        const testCaseData = response.data;
        setTestCase(testCaseData);
      } catch (error) {
        console.error('Error fetching test cases:', error);
      }
    };

    const fetchProblemDetails = async () => {
      try {
        const response = await api.get(`/Problem/${problemId}`);
        setProblem(response.data);
      } catch (error) {
        console.error('Error fetching problem details:', error);
      }
    };

    fetchTestCases();
    fetchProblemDetails();
  }, [problemId]);

  return (
    <Flex bg={bgColor} borderRadius="md" color={textColor}>
      <Box flex="1" p={2}>
        <VStack align="stretch" spacing={2}>
          {testCase && (
            <VStack align="stretch" spacing={2}>
              <HStack justify="space-between" w="400px">
                <Text fontWeight="medium" minW="150px">
                  Đầu vào
                </Text>
                <Text>{testCase.input}</Text>
              </HStack>
              <HStack justify="space-between" w="400px">
                <Text fontWeight="medium" minW="150px">
                  Đầu ra mong đợi
                </Text>
                <Text>{testCase.output}</Text>
              </HStack>
              <HStack justify="space-between" w="400px">
                <Text fontWeight="medium" minW="150px">
                  Giới hạn thời gian
                </Text>
                <Text>{problem.timeLimit || 'N/A'}(s)</Text>
              </HStack>
            </VStack>
          )}
        </VStack>
      </Box>
    </Flex>
  );
};

export default TestCasesComponent;
