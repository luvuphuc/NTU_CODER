import { React, useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  VStack,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import api from 'utils/api';
import moment from 'moment-timezone';

const HistorySubTab = ({ takepartId, onSubmissionSelect }) => {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('submitTime');
  const [ascending, setAscending] = useState(false);
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const params = {
        problemId: id,
        sortField: sortField,
        ascending: ascending,
      };
      if (takepartId) {
        params.takePartId = takepartId;
      }
      const res = await api.get('/Submission/history', { params });
      setSubmissions(res.data);
    } catch (error) {
      console.error('Lỗi', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchHistory();
    }
  }, [id, takepartId, sortField, ascending]);

  const handleSort = (field) => {
    if (sortField === field) {
      setAscending((prev) => !prev);
    } else {
      setSortField(field);
      setAscending(true);
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return ascending ? (
      <TriangleUpIcon fontSize="xs" pb={1} />
    ) : (
      <TriangleDownIcon fontSize="xs" pb={1} />
    );
  };
  return (
    <VStack spacing={1} w="full" align="stretch">
      <TableContainer
        w="full"
        minW="max-content"
        overflowX="auto"
        px={0}
        pl={0}
        mx={0}
        borderRadius="md"
        boxShadow="md"
      >
        <Table
          variant="striped"
          colorScheme="blue"
          size="sm"
          w="full"
          minW="max-content"
        >
          <Thead bg="gray.300">
            <Tr borderBottom="2px solid gray.600">
              <Th p={2} fontSize="xs" textAlign="center" maxW="40px">
                STT
              </Th>
              <Th
                p={2}
                fontSize="xs"
                textAlign="left"
                maxW="80px"
                cursor="pointer"
                onClick={() => handleSort('submitTime')}
              >
                Thời gian nộp {renderSortIcon('submitTime')}
              </Th>
              <Th p={2} fontSize="xs" textAlign="center" maxW="80px">
                Ngôn ngữ
              </Th>
              <Th p={2} fontSize="xs" textAlign="center" maxW="80px">
                Kiểm thử
              </Th>
              <Th p={2} fontSize="xs" textAlign="center" maxW="60px">
                Điểm
              </Th>
              <Th
                p={2}
                fontSize="xs"
                textAlign="center"
                maxW="100px"
                cursor="pointer"
                onClick={() => handleSort('maxTimeDuration')}
              >
                Thời gian {renderSortIcon('maxTimeDuration')}
              </Th>
              <Th p={2} fontSize="xs" textAlign="center" maxW="60px"></Th>
            </Tr>
          </Thead>

          <Tbody>
            {submissions.length === 0 ? (
              <Tr>
                <Td colSpan={7} textAlign="center" fontSize="sm">
                  Chưa có bài làm nào
                </Td>
              </Tr>
            ) : (
              submissions.map((submission, index) => (
                <Tr
                  key={submission.submissionID}
                  borderBottom="1px solid gray.400"
                >
                  <Td p={2} fontSize="sm" textAlign="center">
                    {index + 1}
                  </Td>
                  <Td p={2} fontSize="sm" textAlign="left">
                    {moment
                      .utc(submission.submitTime)
                      .tz('Asia/Ho_Chi_Minh')
                      .format('HH:mm DD/MM/YYYY')}
                  </Td>
                  <Td p={2} fontSize="sm" textAlign="center">
                    {submission.compilerName || '---'}
                  </Td>
                  <Td
                    p={2}
                    fontSize="sm"
                    textAlign="center"
                    fontWeight="bold"
                    color={
                      submission.testResult === 'Accepted'
                        ? 'green.500'
                        : /fail|wrong|error/i.test(submission.testResult)
                        ? 'red.500'
                        : 'yellow.500'
                    }
                  >
                    {submission.testResult || '--/--'}
                  </Td>

                  <Td p={2} fontSize="sm" textAlign="center">
                    {submission.point}
                  </Td>
                  <Td p={2} fontSize="sm" textAlign="center">
                    {submission.maxTimeDuration != null
                      ? `${submission.maxTimeDuration} ms`
                      : '--'}
                  </Td>
                  <Td
                    fontSize="sm"
                    textAlign="center"
                    onClick={() =>
                      onSubmissionSelect(submission.submissionCode)
                    }
                    cursor="pointer"
                    color="blue.500"
                  >
                    Chi tiết
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};

export default HistorySubTab;
