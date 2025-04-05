import React from 'react';
import { VStack, Heading, Text, Box } from '@chakra-ui/react';

const ProblemTab = ({ problem }) => {
  return (
    <VStack align="start" spacing={4}>
      <Heading size="lg">{problem.problemName}</Heading>
      <Text>
        <strong>Mã bài toán:</strong> {problem.problemCode}
      </Text>
      <Text fontWeight="bold">Nội dung bài toán:</Text>
      <Box
        maxWidth="100%" // Giới hạn chiều rộng
        p={3}
        bg="gray.200"
        borderRadius="md"
        boxShadow="sm"
        overflow="hidden" // Không cho phép cuộn ngang
        style={{
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
        }}
      >
        <Box dangerouslySetInnerHTML={{ __html: problem.problemContent }} />
      </Box>
    </VStack>
  );
};

export default ProblemTab;
