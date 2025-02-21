import { Box, Text } from '@chakra-ui/react';

export default function FooterUser() {
  return (
    <Box
      bg="gray.800"
      color="white"
      py={6}
      textAlign="center"
      borderTop="1px solid"
      borderColor="gray.700">
      <Text fontSize="sm">&copy; 2025 Your Company. All rights reserved.</Text>
    </Box>
  );
}
