import React, { useState, useEffect } from 'react';
import { Box, Container, Flex, Spinner, Stack } from '@chakra-ui/react';
import LayoutUser from 'layouts/user';
import ContestSection from './components/contest_section';
import api from 'utils/api';

export default function HeroContestSection() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await api.get('/contest/all?published=false');
        setContests(response.data.data);
      } catch (error) {
        console.error('Error fetching contests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  const filterContests = (status) => contests.filter((contest) => contest.status === status);

  return (
      <Box>
        <Container maxW="7xl" py={8} px={0}>
          {loading ? (
            <Flex justify="center" align="center" minH="300px">
              <Spinner size="xl" color="blue.500" />
            </Flex>
          ) : (
            <Stack spacing={8}>
              <ContestSection title="Sắp diễn ra" contests={filterContests(2)} />
            </Stack>
          )}
        </Container>
      </Box>
  );
}
