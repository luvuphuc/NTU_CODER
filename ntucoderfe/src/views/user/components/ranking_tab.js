import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

const RankingTab = () => {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Thứ hạng</Th>
          <Th>Tên coder</Th>
          <Th>Điểm</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>1</Td>
          <Td>Nguyễn Văn A</Td>
          <Td>100</Td>
        </Tr>
      </Tbody>
    </Table>
  );
};

export default RankingTab;
