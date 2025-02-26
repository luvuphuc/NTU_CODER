import React from "react";
import { VStack, Heading, Text, Box } from "@chakra-ui/react";

const ProblemTab = ({ problem }) => {
  return (
    <VStack align="start">
      <Heading size="lg">{problem.problemName}</Heading>
      <Text>
        <strong>Mã bài toán:</strong> {problem.problemCode}
      </Text>
      <Text>
        <strong>Thời gian chạy:</strong> {problem.timeLimit} giây
      </Text>
      <Text>
        <strong>Giới hạn bộ nhớ:</strong> {problem.memoryLimit} MB
      </Text>
      <Text fontWeight="bold">Nội dung bài toán:</Text>
      <Box p={3} bg="gray.100" borderRadius="md" boxShadow="sm">
        {problem.problemContent}
      </Box>
    </VStack>
  );
};

export default ProblemTab;
