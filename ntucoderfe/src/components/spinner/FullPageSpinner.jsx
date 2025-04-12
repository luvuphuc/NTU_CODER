import { Box, Spinner, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const FullPageSpinner = () => {
  return (
    <MotionBox
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <VStack spacing={6}>
        <Spinner
          size="xl"
          thickness="6px"
          speed="0.8s"
          color="teal.500"
          emptyColor="gray.200"
          position="relative"
        />
      </VStack>
    </MotionBox>
  );
};

export default FullPageSpinner;
