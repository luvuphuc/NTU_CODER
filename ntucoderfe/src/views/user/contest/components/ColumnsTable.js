import React, { useState, useEffect } from 'react';
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
import moment from 'moment-timezone';

const ContestTableUser = React.memo(
  ({
    contests,
    loading,
    sortOrder,
    onSortStatusChange,
    onRefresh,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
  }) => {
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };

    const handleStatusChange = (e) => {
      setFilterStatus(e.target.value);
    };

    useEffect(() => {
      const delayDebounce = setTimeout(() => {
        onRefresh();
      }, 500);

      return () => clearTimeout(delayDebounce);
    }, [searchTerm, filterStatus]);

    const contestStats = {
      total: contests.length,
      ongoing: contests.filter(
        (c) => getContestStatus(c.startTime, c.endTime) === 'ongoing',
      ).length,
      upcoming: contests.filter(
        (c) => getContestStatus(c.startTime, c.endTime) === 'upcoming',
      ).length,
      ended: contests.filter(
        (c) => getContestStatus(c.startTime, c.endTime) === 'ended',
      ).length,
    };

    return (
      <Card w="100%" p={4} h="600px">
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
            onChange={handleSearchChange}
            maxW="300px"
          />
          <HStack spacing={4}>
            <Select
              maxW="200px"
              value={filterStatus}
              onChange={handleStatusChange}
            >
              <option value="all">Tất cả</option>
              <option value="1">Đang diễn ra</option>
              <option value="2">Sắp diễn ra</option>
              <option value="0">Đã kết thúc</option>
            </Select>
            <IconButton
              aria-label="Refresh table"
              icon={<RepeatIcon />}
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                onRefresh();
              }}
              variant="outline"
            />
          </HStack>
        </Flex>

        {loading ? (
          <Flex justify="center" align="center" minH="200px">
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : (
          <Box flex="1" overflowY="auto" sx={customScrollbarStyle}>
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
                        <Box
                          ml={2}
                          cursor="pointer"
                          onClick={onSortStatusChange}
                        >
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
                  {contests.map((contest) => (
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
                            getContestStatus(
                              contest.startTime,
                              contest.endTime,
                            ) === 'ongoing'
                              ? 'green'
                              : getContestStatus(
                                  contest.startTime,
                                  contest.endTime,
                                ) === 'upcoming'
                              ? 'yellow'
                              : 'red'
                          }
                        >
                          {getContestStatus(
                            contest.startTime,
                            contest.endTime,
                          ) === 'ongoing'
                            ? 'Đang diễn ra'
                            : getContestStatus(
                                contest.startTime,
                                contest.endTime,
                              ) === 'upcoming'
                            ? 'Sắp diễn ra'
                            : 'Đã kết thúc'}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Card>
    );
  },
);

function getContestStatus(startTime, endTime) {
  const currentTime = moment().tz('Asia/Ho_Chi_Minh');
  const start = moment.utc(startTime).tz('Asia/Ho_Chi_Minh');
  const end = moment.utc(endTime).tz('Asia/Ho_Chi_Minh');

  if (currentTime.isBefore(start)) {
    return 'upcoming';
  } else if (currentTime.isBetween(start, end)) {
    return 'ongoing';
  } else {
    return 'ended';
  }
}

function formatDateTime(dateTime) {
  return moment
    .utc(dateTime)
    .tz('Asia/Ho_Chi_Minh')
    .format('DD-MM-YYYY - HH:mm');
}

const customScrollbarStyle = {
  '&::-webkit-scrollbar': {
    width: '10px',
    backgroundColor: '#f0f0f0',
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '5px',
    backgroundColor: '#888',
    border: '2px solid #f0f0f0',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#555',
  },
};

export default ContestTableUser;
