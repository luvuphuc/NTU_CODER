import React from 'react';
import { VStack, Heading, Text, Box } from '@chakra-ui/react';

const ProblemTab = ({ problem }) => {
  return (
    <VStack align="start" spacing={4}>
      <Heading size="lg">{problem.problemName}</Heading>
      <Text>
        <strong>Mã bài toán:</strong> {problem.problemCode}
      </Text>
      <Text>
        <strong>Thời gian chạy:</strong> {problem.timeLimit} giây
      </Text>
      <Text>
        <strong>Giới hạn bộ nhớ:</strong> {problem.memoryLimit} KB
      </Text>
      <Text fontWeight="bold">Nội dung bài toán:</Text>
      <Box p={3} bg="gray.200" borderRadius="md" boxShadow="sm">
        <Box dangerouslySetInnerHTML={{ __html: problem.problemContent }} />
      </Box>

      {/* Hiển thị Input mẫu */}
      <Text fontWeight="bold">Input mẫu:</Text>
      <Box
        p={3}
        bg="gray.200"
        borderRadius="md"
        boxShadow="sm"
        fontFamily="monospace"
      >
        {problem.sampleInput || 'Không có dữ liệu'}
      </Box>

      {/* Hiển thị Output mẫu */}
      <Text fontWeight="bold">Output mẫu:</Text>
      <Box
        p={3}
        bg="gray.200"
        borderRadius="md"
        boxShadow="sm"
        fontFamily="monospace"
      >
        {problem.sampleOutput || 'Không có dữ liệu'}
      </Box>
    </VStack>
  );
};

export default ProblemTab;
