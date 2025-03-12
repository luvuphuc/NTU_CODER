import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  VStack,
} from "@chakra-ui/react";

const rankingData = [
  {
    rank: 1,
    coder: "Nguyen Van A",
    language: "C++",
    score: 100,
    executionTime: "0 ms",
  },
  {
    rank: 2,
    coder: "Tran Van B",
    language: "Python",
    score: 95,
    executionTime: "10 ms",
  },
];

const RankingTab = () => {
  return (
    <VStack spacing={1} w="full" align="stretch">
      <TableContainer w="full" minW="max-content" overflowX="auto" px={0} pl={0} mx={0} borderRadius="md" boxShadow="md">
        <Table variant="striped" colorScheme='purple' size="sm" w="full" minW="max-content" >
          {/* Header */}
          <Thead bg="gray.300">
            <Tr borderBottom="2px solid gray.600">
              <Th p={2} fontSize="xs" textAlign="center" whiteSpace="normal" maxW="40px">Thứ hạng</Th>
              <Th p={2} fontSize="xs" textAlign="left" whiteSpace="normal" maxW="120px">Tên coder</Th>
              <Th p={2} fontSize="xs" textAlign="center" whiteSpace="normal" maxW="80px">Ngôn ngữ</Th>
              <Th p={2} fontSize="xs" textAlign="center" whiteSpace="normal" maxW="60px">Điểm</Th>
              <Th p={2} fontSize="xs" textAlign="center" whiteSpace="normal" maxW="80px">Thời gian (ms)</Th>
            </Tr>
          </Thead>

          {/* Body */}
          <Tbody>
            {rankingData.map((entry) => (
              <Tr key={entry.rank} borderBottom="1px solid gray.400">
                <Td p={2} fontSize="sm" textAlign="center" whiteSpace="nowrap">{entry.rank}</Td>
                <Td p={2} fontSize="sm" textAlign="left" whiteSpace="nowrap">{entry.coder}</Td>
                <Td p={2} fontSize="sm" textAlign="center" whiteSpace="nowrap">{entry.language}</Td>
                <Td p={2} fontSize="sm" textAlign="center" whiteSpace="nowrap">{entry.score}</Td>
                <Td p={2} fontSize="sm" textAlign="center" whiteSpace="nowrap">{entry.executionTime}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};

export default RankingTab;