import React, { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Link,
  Badge,
  Input,
  Select,
  Flex,
  Box,
  Spinner,
  Text,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { ArrowUpIcon, ArrowDownIcon, RepeatIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import Card from 'components/card/Card';

const ContestTableUser = React.memo(
  ({ contests, loading, sortOrder, onSortStatusChange, onRefresh }) => {
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const contestStats = {
      total: contests.length,
      ongoing: contests.filter((c) => c.status === 1).length,
      upcoming: contests.filter((c) => c.status === 2).length,
      ended: contests.filter((c) => c.status === 0).length,
    };
    const filteredContests = contests.filter((contest) => {
      const matchStatus =
        filterStatus === 'all' || contest.status.toString() === filterStatus;
      const matchSearch = contest.contestName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
    return (
      <Card w="100%" p={4} h="full">
        <Box mb={4}>
          <Text fontSize="2xl" align="center" fontWeight="bold">
            CÁC CUỘC THI
          </Text>
          <HStack spacing={4} mt={2}>
            <Badge colorScheme="blue">Tổng: {contestStats.total}</Badge>
            <Badge colorScheme="green">
              Đang diễn ra: {contestStats.ongoing}
            </Badge>
            <Badge colorScheme="yellow">
              Sắp diễn ra: {contestStats.upcoming}
            </Badge>
            <Badge colorScheme="red">Đã kết thúc: {contestStats.ended}</Badge>
          </HStack>
        </Box>
        <Flex mb={4} justify="space-between" align="center">
          <Input
            placeholder="Tìm kiếm contest..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            maxW="300px"
          />
          <HStack spacing={4}>
            <Select
              maxW="200px"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="1">Đang diễn ra</option>
              <option value="2">Sắp diễn ra</option>
              <option value="0">Đã kết thúc</option>
            </Select>
            <IconButton
              aria-label="Refresh table"
              icon={<RepeatIcon />}
              onClick={onRefresh}
              variant="outline"
            />
          </HStack>
        </Flex>

        {loading ? (
          <Flex justify="center" align="center" minH="200px">
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : (
          <TableContainer>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Tên Contest</Th>
                  <Th>Thời gian bắt đầu</Th>
                  <Th>Thời gian kết thúc</Th>
                  <Th>Người tham gia</Th>
                  <Th>
                    <Flex align="center">
                      <Text>Trạng thái</Text>
                      <Box ml={2} cursor="pointer" onClick={onSortStatusChange}>
                        {sortOrder === 'asc' ? (
                          <ArrowUpIcon boxSize={4} />
                        ) : (
                          <ArrowDownIcon boxSize={4} />
                        )}
                      </Box>
                    </Flex>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredContests.map((contest) => (
                  <Tr key={contest.contestID}>
                    <Td>
                      <Link
                        as={RouterLink}
                        to={`/contest/${contest.id}`}
                        color="blue.500"
                      >
                        {contest.contestName}
                      </Link>
                    </Td>
                    <Td>{formatDateTime(contest.startTime)}</Td>
                    <Td>{formatDateTime(contest.endTime)}</Td>
                    <Td>{contest.participants || 0}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          contest.status === 1
                            ? 'green'
                            : contest.status === 2
                            ? 'yellow'
                            : 'red'
                        }
                      >
                        {contest.status === 1
                          ? 'Đang diễn ra'
                          : contest.status === 2
                          ? 'Sắp diễn ra'
                          : 'Đã kết thúc'}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Card>
    );
  },
);

function formatDateTime(dateTime) {
  const date = new Date(dateTime);
  return `${date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })} - ${date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })}`;
}

export default ContestTableUser;
