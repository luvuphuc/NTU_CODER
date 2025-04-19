import React from 'react';
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
} from '@chakra-ui/react';
import Card from 'components/card/Card';

const mockRankingData = [
  { id: 1, name: 'User A', score: 1500, rank: 1 },
  { id: 2, name: 'User B', score: 1450, rank: 2 },
  { id: 3, name: 'User C', score: 1400, rank: 3 },
  { id: 4, name: 'User D', score: 1350, rank: 4 },
  { id: 5, name: 'User E', score: 1300, rank: 5 },
];

const RankingTable = () => {
  return (
    <Card w="100%" h="full" p={4} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Box>
        <Heading size="md" mb={4} textAlign="center">
          Bảng Xếp Hạng
        </Heading>
        <TableContainer>
          <Table variant="striped" colorScheme="blue">
            <Thead>
              <Tr>
                <Th>Hạng</Th>
                <Th>Tên</Th>
                <Th>Điểm</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockRankingData.map((user) => (
                <Tr key={user.id}>
                  <Td>
                    <Badge colorScheme={user.rank === 1 ? 'yellow' : 'gray'}>
                      {user.rank}
                    </Badge>
                  </Td>
                  <Td>{user.name}</Td>
                  <Td>{user.score}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Card>
  );
};

export default RankingTable;
