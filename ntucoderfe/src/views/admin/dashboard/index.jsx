import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import ScrollToTop from 'components/scroll/ScrollToTop';
import CardStatistic from './components/CardStatistic';
import SubmissionStatusChart from './components/SubmissionStatusChart';
export default function AdminDashboard() {
  return (
    <ScrollToTop>
      <Box
        pt={{ base: '130px', md: '80px', xl: '80px' }}
        px={{ base: 4, md: 10 }}
      >
        <CardStatistic />
        <SubmissionStatusChart />
        <Text
          fontSize="lg"
          color="gray.600"
          maxW="3xl"
          mx="auto"
          textAlign="center"
        >
          Ở đây bạn sẽ hiện các biểu đồ, bảng thống kê hoặc các thông tin cần
          thiết.
        </Text>
      </Box>
    </ScrollToTop>
  );
}
