import React from "react";
import { VStack, Box, Text } from "@chakra-ui/react";

const DiscussionTab = () => {
  return (
    <VStack align="start" spacing={4}>
      <Box p={4} bg="gray.100" borderRadius="md" boxShadow="sm">
        <Text>
          <strong>Nguyễn Văn C:</strong> Bài này có thể dùng thuật toán quy hoạch động không?
        </Text>
      </Box>
    </VStack>
  );
};

export default DiscussionTab;
