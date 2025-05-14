import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  VStack,
  Box,
} from '@chakra-ui/react';
import { FaMedal } from 'react-icons/fa';
import api from 'config/api';
import { useParams } from 'react-router-dom';

const RankingTab = () => {
  const { contestId, id } = useParams();
  const [rankingData, setRankingData] = useState([]);

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const res = await api.get(`/Problem/ranking-problem`, {
          params: { problemId: id, contestId },
        });
        if (res.status === 200) {
          setRankingData(res.data);
        } else {
          console.error('Đã xảy ra lỗi');
        }
      } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
      }
    };

    fetchRankingData();
  }, [id, contestId]);

  const getRankStyle = (rank) => {
    if (rank === 1) return { color: 'gold', icon: <FaMedal color="gold" /> };
    if (rank === 2)
      return { color: 'silver', icon: <FaMedal color="silver" /> };
    if (rank === 3)
      return { color: '#cd7f32', icon: <FaMedal color="#cd7f32" /> };
    return { color: 'inherit', icon: null };
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
          colorScheme="purple"
          size="sm"
          w="full"
          minW="max-content"
        >
          {/* Header */}
          <Thead bg="gray.300">
            <Tr borderBottom="2px solid gray.600">
              <Th px={3} p={2} fontSize="xs" textAlign="center" maxW="40px">
                Hạng
              </Th>
              <Th px={3} p={2} fontSize="xs" textAlign="left" maxW="120px">
                Tên coder
              </Th>
              <Th p={2} fontSize="xs" textAlign="center" maxW="80px">
                Ngôn ngữ
              </Th>
              <Th p={2} fontSize="xs" textAlign="center" maxW="60px">
                Điểm
              </Th>
              <Th p={2} fontSize="xs" textAlign="center" maxW="80px">
                Thời gian (ms)
              </Th>
            </Tr>
          </Thead>

          {/* Body */}
          <Tbody>
            {rankingData.length === 0 ? (
              <Tr>
                <Td colSpan={5} textAlign="center" fontSize="md">
                  Bạn hãy là người đầu tiên!
                </Td>
              </Tr>
            ) : (
              rankingData.map((entry) => {
                const { color, icon } = getRankStyle(entry.rank);
                return (
                  <Tr key={entry.rank} borderBottom="1px solid gray.400">
                    <Td
                      p={2}
                      fontSize={entry.rank <= 3 ? 'md' : 'sm'}
                      fontWeight={entry.rank <= 3 ? 'bold' : 'normal'}
                      textAlign="center"
                      color={color}
                    >
                      {icon ? (
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          gap={2}
                        >
                          {icon} {entry.rank}
                        </Box>
                      ) : (
                        entry.rank
                      )}
                    </Td>
                    <Td
                      p={2}
                      fontSize="sm"
                      textAlign="left"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      maxWidth="120px"
                    >
                      {entry.coderName}
                    </Td>
                    <Td
                      p={2}
                      fontSize="sm"
                      textAlign="center"
                      whiteSpace="nowrap"
                    >
                      {entry.compilerName}
                    </Td>
                    <Td p={2} fontSize="sm" textAlign="center">
                      {entry.pointScore}
                    </Td>
                    <Td p={2} fontSize="sm" textAlign="center">
                      {entry.timeScore}
                    </Td>
                  </Tr>
                );
              })
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};

export default RankingTab;
