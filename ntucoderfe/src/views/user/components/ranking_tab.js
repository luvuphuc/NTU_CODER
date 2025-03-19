import React from "react";
import { 
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, VStack, 
  Box, Text 
} from "@chakra-ui/react";
import { FaMedal } from "react-icons/fa";

const rankingData = [
  { rank: 1, coder: "Nguyen Van A", language: "C++", score: 100, executionTime: "0 ms" },
  { rank: 2, coder: "Tran Van B", language: "Python", score: 95, executionTime: "10 ms" },
  { rank: 3, coder: "Le Thi C", language: "Java", score: 90, executionTime: "15 ms" },
  { rank: 4, coder: "Pham Van D", language: "C#", score: 85, executionTime: "20 ms" },
];

const getRankStyle = (rank) => {
  if (rank === 1) return { color: "gold", icon: <FaMedal color="gold" /> };
  if (rank === 2) return { color: "silver", icon: <FaMedal color="silver" /> };
  if (rank === 3) return { color: "#cd7f32", icon: <FaMedal color="#cd7f32" /> };
  return { color: "inherit", icon: null };
};

const RankingTab = () => {
  return (
    <VStack spacing={1} w="full" align="stretch">
      <TableContainer w="full" minW="max-content" overflowX="auto" px={0} pl={0} mx={0} borderRadius="md" boxShadow="md">
        <Table variant="striped" colorScheme='purple' size="sm" w="full" minW="max-content">
          {/* Header */}
          <Thead bg="gray.300">
            <Tr borderBottom="2px solid gray.600">
              <Th p={2} fontSize="xs" textAlign="center" maxW="40px">Thứ hạng</Th>
              <Th p={2} fontSize="xs" textAlign="left" maxW="120px">Tên coder</Th>
              <Th p={2} fontSize="xs" textAlign="center" maxW="80px">Ngôn ngữ</Th>
              <Th p={2} fontSize="xs" textAlign="center" maxW="60px">Điểm</Th>
              <Th p={2} fontSize="xs" textAlign="center" maxW="80px">Thời gian (ms)</Th>
            </Tr>
          </Thead>

          {/* Body */}
          <Tbody>
            {rankingData.map((entry) => {
              const { color, icon } = getRankStyle(entry.rank);
              return (
                <Tr key={entry.rank} borderBottom="1px solid gray.400">
                  <Td p={2} fontSize={entry.rank <= 3 ? "md" : "sm"} fontWeight={entry.rank <= 3 ? "bold" : "normal"} textAlign="center" color={color}>
                    {icon ? <Box display="flex" alignItems="center" justifyContent="center" gap={2}>{icon} {entry.rank}</Box> : entry.rank}
                  </Td>
                  <Td p={2} fontSize="sm" textAlign="left">{entry.coder}</Td>
                  <Td p={2} fontSize="sm" textAlign="center">{entry.language}</Td>
                  <Td p={2} fontSize="sm" textAlign="center">{entry.score}</Td>
                  <Td p={2} fontSize="sm" textAlign="center">{entry.executionTime}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};

export default RankingTab;
