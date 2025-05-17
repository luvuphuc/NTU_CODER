import React from 'react';
import { Box, Stack } from '@chakra-ui/react';
import ScrollToTop from 'components/scroll/ScrollToTop';
import CardStatistic from './components/CardStatistic';
import SubmissionStatusChart from './components/SubmissionStatusChart';
import UserGrowthChart from './components/UserGrowthChart';
import TopProblemsChart from './components/TopProblemChart';
import TopContestsChart from './components/TopContestChart';
export default function AdminDashboard() {
  return (
    <ScrollToTop>
      <Box
        pt={{ base: '130px', md: '80px', xl: '80px' }}
        px={{ base: 4, md: 10 }}
      >
        <CardStatistic />
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={6}
          mt={2}
          justify="center"
          align="stretch"
        >
          <Box flex="1" minW={{ md: '300px' }} height="250px">
            <UserGrowthChart />
          </Box>
          <Box flex="1" minW={{ md: '300px' }} height="250px">
            <SubmissionStatusChart />
          </Box>
        </Stack>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={6}
          mt={6}
          justify="center"
          align="stretch"
        >
          <Box flex="1" minW={{ md: '300px' }} height="250px">
            <TopProblemsChart />
          </Box>
          <Box flex="1" minW={{ md: '300px' }} height="250px">
            <TopContestsChart />
          </Box>
        </Stack>
      </Box>
    </ScrollToTop>
  );
}
