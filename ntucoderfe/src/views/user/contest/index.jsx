import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Card,
  CardBody,
  Stack,
  Button,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Navigation from '../common/navigation';
import Header from '../common/header';
import FooterUser from '../common/footer';
import api from '../../../utils/api';

export default function ContestPage() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await api.get('/contest/all');
        setContests(response.data.data);
      } catch (error) {
        console.error('Error fetching contests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  const filterContests = (status) => {
    return contests.filter((contest) => contest.status === status);
  };

  return (
    <Box>
      <Header />
      <Navigation />
      <Container maxW="7xl" py={12} px={6}>
        <Heading textAlign="center" mb={8} color="gray.700">
          DANH SÁCH CUỘC THI
        </Heading>

        {loading ? (
          <Flex justify="center" align="center" minH="300px">
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : (
          <Stack spacing={8}>
            {/* Đang diễn ra */}
            <Section title="Đang diễn ra" data={filterContests('ongoing')} />
            {/* Sắp diễn ra */}
            <Section title="Sắp diễn ra" data={filterContests('upcoming')} />
            {/* Đã kết thúc */}
            <Section title="Đã kết thúc" data={filterContests('finished')} />
          </Stack>
        )}
      </Container>
      <FooterUser />
    </Box>
  );
}

function Section({ title, data }) {
  return (
    <Box>
      <Heading size="lg" mb={4}>{title}</Heading>
      {data.length === 0 ? (
        <Text color="gray.500">Không có cuộc thi nào.</Text>
      ) : (
        <Table variant="simple" size="md" boxShadow="md" borderRadius="lg">
          <Thead>
            <Tr>
              <Th>Tên cuộc thi</Th>
              <Th>Thời gian</Th>
              <Th>Trạng thái</Th>
              <Th>Hành động</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((contest) => (
              <Tr key={contest.id}>
                <Td>
                  <Link to={`/contest/${contest.id}`}>
                    <Text fontWeight="bold" color="blue.600">{contest.name}</Text>
                  </Link>
                </Td>
                <Td>{contest.startTime} - {contest.endTime}</Td>
                <Td>
                  <Badge colorScheme={contest.status === 'ongoing' ? 'green' : 'gray'}>
                    {contest.status === 'ongoing' ? 'Đang diễn ra' : 'Đã kết thúc'}
                  </Badge>
                </Td>
                <Td>
                  {contest.status === 'ongoing' && (
                    <Link to={`/contest/${contest.id}`}>
                      <Button colorScheme="blue" size="sm">Tham gia</Button>
                    </Link>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}