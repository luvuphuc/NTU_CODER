import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Flex,
  Spinner,
  Stack,
  Heading,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import ContestSection from './components/contest_section';
import api from 'config/api';

const MotionBox = motion(Box);

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

  const filterContests = (status) =>
    contests.filter((contest) => contest.status === status);

  return (
    <Box>
      <Container maxW="7xl" py={10}>
        {loading ? (
          <Flex justify="center" align="center" minH="300px">
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : (
          <Stack spacing={10}>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <ContestSection
                title="Các cuộc thi sắp diễn ra"
                contests={filterContests(2)}
              />
            </MotionBox>
          </Stack>
        )}
      </Container>
    </Box>
  );
}
