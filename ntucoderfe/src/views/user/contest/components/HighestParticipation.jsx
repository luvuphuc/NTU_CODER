import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Box,
  Heading,
  Spinner,
  Center,
  Avatar,
  Text,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import api from 'utils/api';

const HighestParticipation = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await api.get('/Contest/ranking-highest');
        setRanking(res.data);
      } catch (err) {
        console.error('Error fetching ranking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  return (
    <Card w="100%" h="full" p={4}>
      <Box w="100%">
        <Heading size="md" mb={4} textAlign="center">
          Bảng Xếp Hạng Cao Nhất
        </Heading>

        {loading ? (
          <Center py={10}>
            <Spinner />
          </Center>
        ) : ranking.length === 0 ? (
          <Text textAlign="center" fontStyle="italic" color="gray.500">
            Chưa có người được xếp hạng.
          </Text>
        ) : (
          <TableContainer w="100%">
            <Table
              variant="striped"
              colorScheme="blue"
              size="sm"
              tableLayout="fixed"
            >
              <Thead>
                <Tr>
                  <Th w="60px">Hạng</Th>
                  <Th>Tên</Th>
                  <Th w="80px">Điểm</Th>
                </Tr>
              </Thead>
              <Tbody>
                {ranking.slice(0, 10).map((user, index) => (
                  <Tr key={user.coderID || index}>
                    <Td>
                      <Badge
                        colorScheme={
                          user.rank === 1
                            ? 'yellow'
                            : user.rank === 2
                            ? 'gray'
                            : user.rank === 3
                            ? 'orange'
                            : 'blue'
                        }
                      >
                        {user.rank}
                      </Badge>
                    </Td>
                    <Td>
                      <Text isTruncated maxW="140px">
                        {user.coderName}
                      </Text>
                    </Td>
                    <Td>{user.pointScore}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Card>
  );
};

export default HighestParticipation;
