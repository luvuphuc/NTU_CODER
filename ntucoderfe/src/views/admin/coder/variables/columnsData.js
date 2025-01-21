import {
  Flex,
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Button
} from '@chakra-ui/react';
import * as React from 'react';
import SwitchField from "components/fields/SwitchField";
import { BiSolidDetail } from "react-icons/bi";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
// columnsData.js
export const columnsData = [
  {
    Header: 'STT',
    accessor: 'stt',
    Cell: ({ rowIndex }) => rowIndex + 1,
    minWidth: '20px',
  },
  {
    Header: 'Tài khoản',
    accessor: 'userName',
  },
  {
    Header: 'Tên ND',
    accessor: 'coderName',
  },
  {
    Header: 'Email',
    accessor: 'coderEmail',
  },
  {
    Header: 'SĐT',
    accessor: 'phoneNumber',
  },
  {
    Header: 'Trạng thái',
    accessor: 'status',
    Cell: ({ value }) => (
      <SwitchField
        isChecked={value || false}
        reversed={true}
        fontSize="sm"
      />
    ),
  },
  {
    Header: '',
    accessor: 'action',
    Cell: () => (
      <Flex gap={4} justify="center" align="center">
        <Button variant="solid" size="sm" colorScheme="yellow" borderRadius="md" minW="auto">
          <MdEdit size="18" />
        </Button>
        <Button variant="solid" size="sm" colorScheme="facebook" borderRadius="md" minW="auto">
          <BiSolidDetail size="18" />
        </Button>
        <Button variant="solid" size="sm" colorScheme="red" borderRadius="md" minW="auto">
          <MdDelete size="18" />
        </Button>
      </Flex>
    ),
  },
];
