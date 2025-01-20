import { columnsData } from '../variables/columnsData';
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

export default function ColumnTable({ tableData }) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  return (
    <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text color={textColor} fontSize="22px" mb="4px" fontWeight="700" lineHeight="100%">
          Table name
        </Text>
        <Button variant="solid" size="lg" colorScheme="green" borderRadius="md">
          Thêm<MdAdd size="25" />
        </Button>
      </Flex>
      <Box>
        <Table variant="simple" color="gray.500" mb="24px" mt="12px" tableLayout="fixed">
          <Thead>
            <Tr>
              {columnsData.map((column) => (
                <Th key={column.Header} borderColor={borderColor} width={column.width || 'auto'}>
                  <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
                    {column.Header}
                  </Text>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {tableData.map((row, index) => (
              <Tr key={index}>
                {columnsData.map((column) => (
                  <Td key={column.Header} fontSize={{ sm: '14px' }} width={column.width || 'auto'} borderColor="transparent">
                    {column.Cell ? column.Cell({ value: row[column.accessor], rowIndex: index }) : row[column.accessor] || 'N/A'}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}
