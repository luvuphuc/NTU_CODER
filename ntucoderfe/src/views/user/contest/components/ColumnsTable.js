import React, { useEffect } from 'react';
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
  Skeleton,
  SkeletonText,
  HStack,
  IconButton,
  Text,
  Heading,
} from '@chakra-ui/react';
import { ArrowUpIcon, ArrowDownIcon, RepeatIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import Card from 'components/card/Card';
import Pagination from 'components/pagination/pagination';
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
    currentPage,
    totalPages,
    onPageChange,
    onPageSizeChange,
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

    const renderSkeletonRows = () => {
      return Array(5)
        .fill('')
        .map((_, index) => (
          <Tr key={index}>
            <Td>
              <Skeleton height="16px" />
            </Td>
            <Td>
              <Skeleton height="16px" />
            </Td>
            <Td>
              <Skeleton height="16px" />
            </Td>
            <Td>
              <Skeleton height="16px" />
            </Td>
            <Td>
              <Skeleton height="16px" />
            </Td>
          </Tr>
        ));
    };

    return (
      <Box w="100%" p={0}>
        <Card w="100%" p={4} h="600px">
          <Box mb={4}>
            <Text fontSize="2xl" align="center" fontWeight="bold">
              CÁC CUỘC THI
            </Text>
            <HStack spacing={4} mt={2}>
              <Badge colorScheme="blue">Tổng: {contests.length}</Badge>
              <Badge colorScheme="green">
                Đang diễn ra:{' '}
                {
                  contests.filter(
                    (c) =>
                      getContestStatus(c.startTime, c.endTime) === 'ongoing',
                  ).length
                }
              </Badge>
              <Badge colorScheme="yellow">
                Sắp diễn ra:{' '}
                {
                  contests.filter(
                    (c) =>
                      getContestStatus(c.startTime, c.endTime) === 'upcoming',
                  ).length
                }
              </Badge>
              <Badge colorScheme="red">
                Đã kết thúc:{' '}
                {
                  contests.filter(
                    (c) => getContestStatus(c.startTime, c.endTime) === 'ended',
                  ).length
                }
              </Badge>
            </HStack>
          </Box>

          <Flex mb={4} justify="space-between" align="center">
            <Input
              placeholder="Tìm kiếm cuộc thi..."
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
                type="button"
                variant="outline"
              />
            </HStack>
          </Flex>

          {/* Table */}
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
                  {loading ? (
                    renderSkeletonRows()
                  ) : contests.length === 0 ? (
                    <Tr>
                      <Td colSpan={5}>
                        <Flex
                          direction="column"
                          justify="center"
                          align="center"
                          minH="350px"
                          p={8}
                        >
                          <Box boxSize="120px" mb={4}>
                            <img
                              src="https://cdn-icons-png.flaticon.com/512/4076/4076507.png"
                              alt="No data"
                              style={{ width: '100%', height: 'auto' }}
                            />
                          </Box>
                          <Heading size="md" color="gray.600">
                            Không có dữ liệu
                          </Heading>
                        </Flex>
                      </Td>
                    </Tr>
                  ) : (
                    contests.map((contest) => (
                      <Tr key={contest.contestID}>
                        <Td maxWidth="200px" isTruncated>
                          <Link
                            as={RouterLink}
                            to={`/contest/${contest.contestID}`}
                            color="blue.500"
                          >
                            {contest.contestName}
                          </Link>
                        </Td>
                        <Td>{formatDateTime(contest.startTime)}</Td>
                        <Td>{formatDateTime(contest.endTime)}</Td>
                        <Td textAlign="center">{contest.participants || 0}</Td>
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
                    ))
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Card>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </Box>
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
