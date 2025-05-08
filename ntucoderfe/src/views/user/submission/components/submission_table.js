import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Icon,
  Text,
  Badge,
  Center,
  Box,
  HStack,
  Skeleton,
  Input,
  Select,
  Flex,
  VStack,
} from '@chakra-ui/react';
import { FiCheckCircle } from 'react-icons/fi';
import { RiCloseCircleLine } from 'react-icons/ri';
import { MdPending } from 'react-icons/md';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

const SubmissionTableUser = ({
  submissions,
  loading,
  currentPage,
  pageSize,
  totalRows,
  searchString,
  setSearchString,
  compilerFilter,
  setCompilerFilter,
  compilers = [],
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
}) => {
  const renderSkeletonRows = () => {
    return Array(pageSize)
      .fill('')
      .map((_, index) => (
        <Tr key={index}>
          {Array(8)
            .fill('')
            .map((_, colIndex) => (
              <Td key={colIndex}>
                <Skeleton height="20px" />
              </Td>
            ))}
        </Tr>
      ));
  };
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  const renderSortIcon = (field) => {
    if (sortField === field) {
      return sortOrder === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
    }
    return null;
  };
  return (
    <Box
      borderRadius="2xl"
      boxShadow="xl"
      p={6}
      bgGradient="linear(to-b, white, gray.50)"
      border="1px solid"
      borderColor="gray.200"
    >
      {/* --- Tiêu đề và bộ lọc --- */}
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        gap={4}
        direction={{ base: 'column', md: 'row' }}
        flexWrap="wrap"
      >
        <VStack align="flex-start" spacing={0}>
          <Text fontSize="2xl" fontWeight="bold" color="teal.600">
            Danh sách bài nộp
          </Text>
          <Text fontSize="sm" color="gray.500">
            Tổng số: {totalRows}
          </Text>
        </VStack>

        <HStack spacing={4}>
          <Select
            width="200px"
            placeholder="Tất cả"
            value={compilerFilter}
            onChange={(e) => setCompilerFilter(e.target.value)}
            bg="white"
          >
            {compilers.map((c) => (
              <option key={c.compilerID} value={c.compilerName}>
                {c.compilerName}
              </option>
            ))}
          </Select>
          <Input
            placeholder="Tìm kiếm..."
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            maxW="250px"
            bg="white"
          />
        </HStack>
      </Flex>

      <TableContainer overflowX="auto">
        <Table variant="simple" size="md">
          <Thead bg="teal.50">
            <Tr>
              <Th color="teal.700">#</Th>

              <Th
                color="teal.700"
                onClick={() => handleSort('coderName')}
                cursor="pointer"
              >
                <HStack spacing={1} align="center">
                  <Text>Tên coder</Text>
                  <Box color="gray.500">
                    {renderSortIcon('coderName') ?? (
                      <FiChevronDown opacity={0.3} />
                    )}
                  </Box>
                </HStack>
              </Th>

              <Th
                color="teal.700"
                onClick={() => handleSort('problemName')}
                cursor="pointer"
              >
                <HStack spacing={1} align="center">
                  <Text>Bài tập</Text>
                  <Box color="gray.500">
                    {renderSortIcon('problemName') ?? (
                      <FiChevronDown opacity={0.3} />
                    )}
                  </Box>
                </HStack>
              </Th>

              <Th color="teal.700">Ngôn ngữ</Th>

              <Th
                color="teal.700"
                onClick={() => handleSort('submitTime')}
                cursor="pointer"
              >
                <HStack spacing={1} align="center">
                  <Text>Thời gian nộp</Text>
                  <Box color="gray.500">
                    {renderSortIcon('submitTime') ?? (
                      <FiChevronDown opacity={0.3} />
                    )}
                  </Box>
                </HStack>
              </Th>

              <Th
                color="teal.700"
                onClick={() => handleSort('maxTimeDuration')}
                cursor="pointer"
              >
                <HStack spacing={1} align="center">
                  <Text>Thời gian</Text>
                  <Box color="gray.500">
                    {renderSortIcon('maxTimeDuration') ?? (
                      <FiChevronDown opacity={0.3} />
                    )}
                  </Box>
                </HStack>
              </Th>

              <Th color="teal.700">Trạng thái</Th>
              <Th color="teal.700">Kết quả</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              renderSkeletonRows()
            ) : submissions.length === 0 ? (
              <Tr>
                <Td colSpan={8}>
                  <Center py={6}>
                    <Text color="gray.500" fontSize="lg">
                      Không có dữ liệu nộp bài
                    </Text>
                  </Center>
                </Td>
              </Tr>
            ) : (
              submissions.map((submission, index) => (
                <Tr
                  key={submission.submissionID}
                  _hover={{ bg: 'gray.100', transition: '0.2s' }}
                >
                  <Td fontWeight="bold">
                    {(currentPage - 1) * pageSize + index + 1}
                  </Td>
                  <Td>{submission.coderName}</Td>
                  <Td>{submission.problemName}</Td>
                  <Td>
                    <Badge colorScheme="purple" px={2} py={1} borderRadius="md">
                      {submission.compilerName}
                    </Badge>
                  </Td>
                  <Td>{new Date(submission.submitTime).toLocaleString()}</Td>
                  <Td>
                    <Text color="gray.700">
                      {submission.maxTimeDuration ?? '0'} ms
                    </Text>
                  </Td>
                  <Td>
                    <Badge
                      px={3}
                      py={1}
                      borderRadius="full"
                      colorScheme={
                        submission.submissionStatus === 0 ? 'yellow' : 'green'
                      }
                      display="flex"
                      alignItems="center"
                      fontWeight="medium"
                    >
                      <HStack spacing={1}>
                        <Icon
                          as={
                            submission.submissionStatus === 0
                              ? MdPending
                              : FiCheckCircle
                          }
                        />
                        <Text>
                          {submission.submissionStatus === 0
                            ? 'Đang xử lý'
                            : 'Hoàn thành'}
                        </Text>
                      </HStack>
                    </Badge>
                  </Td>
                  <Td>
                    <HStack color="gray.700">
                      {submission.testResult === 'Accepted' ? (
                        <Text color="green.500" fontWeight="semibold">
                          <Icon as={FiCheckCircle} mr={1} />
                          Accepted
                        </Text>
                      ) : (
                        <Text color="red.500" fontWeight="semibold">
                          <Icon as={RiCloseCircleLine} mr={1} />
                          Failed
                        </Text>
                      )}
                    </HStack>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SubmissionTableUser;
