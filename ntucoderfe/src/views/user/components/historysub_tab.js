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

const historyData = [
  {
    stt: 1,
    time: "12:47 09/12/2021",
    language: "C",
    tests: "2/2",
    score: 100,
    executionTime: "0 ms",
  },
  {
    stt: 2,
    time: "12:47 09/12/2021",
    language: "C",
    tests: "2/2",
    score: 100,
    executionTime: "0 ms",
  },
];

const HistorySubTab = () => {
  return (
    <VStack spacing={1} w="full" align="stretch">
      <TableContainer w="full" minW="max-content" overflowX="auto" px={0} pl={0} mx={0} borderRadius="md" boxShadow="md">
        <Table variant="striped" colorScheme='blue' size="sm" w="full" minW="max-content" showColumnBorder="true">
          {/* Header */}
          <Thead bg="gray.300">
            <Tr borderBottom="2px solid gray.600">
              <Th p={2} fontSize="xs" textAlign="center" whiteSpace="normal" maxW="40px">
                STT
              </Th>
              <Th p={2} fontSize="xs" textAlign="left" whiteSpace="normal" maxW="80px">
                Thời gian
              </Th>
              <Th p={2} fontSize="xs" textAlign="center" whiteSpace="normal" maxW="80px">
                Ngôn ngữ
              </Th>
              <Th p={2} fontSize="xs" textAlign="center" whiteSpace="normal" maxW="80px">
                Kiểm thử
              </Th>
              <Th p={2} fontSize="xs" textAlign="center" whiteSpace="normal" maxW="60px">
                Điểm
              </Th>
              <Th p={2} fontSize="xs" textAlign="center" whiteSpace="normal" maxW="100px">
                Thời gian (ms)
              </Th>
            </Tr>
          </Thead>

          {/* Body */}
          <Tbody>
            {historyData.map((entry) => (
              <Tr key={entry.stt} borderBottom="1px solid gray.400">
                <Td p={2} fontSize="sm" textAlign="center" whiteSpace="nowrap" >
                  {entry.stt}
                </Td>
                <Td p={2} fontSize="sm" textAlign="left" whiteSpace="nowrap" >
                  {entry.time}
                </Td>
                <Td p={2} fontSize="sm" textAlign="center" whiteSpace="nowrap" >
                  {entry.language}
                </Td>
                <Td p={2} fontSize="sm" textAlign="center" whiteSpace="nowrap" >
                  {entry.tests}
                </Td>
                <Td p={2} fontSize="sm" textAlign="center" whiteSpace="nowrap">
                  {entry.score}
                </Td>
                <Td p={2} fontSize="sm" textAlign="center" whiteSpace="nowrap">
                  {entry.executionTime}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};

export default HistorySubTab;
