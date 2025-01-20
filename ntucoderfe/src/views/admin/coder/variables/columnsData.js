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
import Card from 'components/card/Card';
import SwitchField from "components/fields/SwitchField";
import { BiSolidDetail } from "react-icons/bi";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
// columnsData.js
export const columnsData = [
  {
    Header: 'No',
    accessor: 'stt',
    Cell: ({ rowIndex }) => rowIndex + 1,
    minWidth: '20px',
  },
  {
    Header: 'User Name',
    accessor: 'userName',
  },
  {
    Header: 'Coder Name',
    accessor: 'coderName',
  },
  {
    Header: 'Coder Email',
    accessor: 'coderEmail',
  },
  {
    Header: 'Phone Number',
    accessor: 'phoneNumber',
  },
  {
    Header: 'Status',
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
