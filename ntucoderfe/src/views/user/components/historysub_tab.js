import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  VStack,
} from "@chakra-ui/react";

const historyData = [
  {
    stt: 1,
    time: "12:47 09/12/2021",
    language: "C",
    tests: "2/2",
    score: 100,
    user: "luvu****@gmail.com",
    executionTime: "0 ms",
  },
];

const HistorySubTab = () => {
  return (
    <VStack align="start" spacing={4} w="full">
      <TableContainer w="full" overflow="auto">
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>STT</Th>
              <Th>Thời gian nộp</Th>
              <Th>Ngôn ngữ</Th>
              <Th>Kiểm thử</Th>
              <Th>Điểm</Th>
              <Th>Người nộp</Th>
              <Th>Thời gian thực thi (ms)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {historyData.map((entry) => (
              <Tr key={entry.stt}>
                <Td>{entry.stt}</Td>
                <Td>{entry.time}</Td>
                <Td>{entry.language}</Td>
                <Td>{entry.tests}</Td>
                <Td>{entry.score}</Td>
                <Td>{entry.user}</Td>
                <Td>{entry.executionTime}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};

export default HistorySubTab;