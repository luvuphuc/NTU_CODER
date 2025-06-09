import React from 'react';
import { VStack, Heading, Text, Box } from '@chakra-ui/react';

const ProblemTab = ({ problem }) => {
  return (
    <VStack align="start" spacing={4}>
      <Heading size="lg" maxWidth="100%">
        {problem.problemName}
      </Heading>
      <Text fontWeight="bold">Nội dung bài toán:</Text>
      <Box
        maxWidth="100%"
        p={6}
        bg="gray.200"
        borderRadius="md"
        boxShadow="sm"
        style={{
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
        }}
      >
        <Box dangerouslySetInnerHTML={{ __html: problem.problemContent }} />
      </Box>
    </VStack>
  );
};

export default ProblemTab;
