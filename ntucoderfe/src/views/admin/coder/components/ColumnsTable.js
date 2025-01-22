import { columnsData } from '../variables/columnsData';
import {
  useColorMode,
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import * as React from 'react';
import Card from 'components/card/Card';


export default function ColumnTable({ tableData }) {
  const { colorMode } = useColorMode(); // Lấy trạng thái chế độ màu
  const textColor = colorMode === 'light' ? 'black' : 'white'; // Đổi màu text
  const borderColor = colorMode === 'light' ? 'gray.200' : 'whiteAlpha.300';

  return (
    <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Box>
        <Table variant="simple" color="gray.500" mb="24px" mt="12px" tableLayout="fixed">
          <Thead>
            <Tr>
              {columnsData.map((column) => (
                <Th key={column.Header} borderColor={borderColor} width={column.width || 'auto'}>
                  <Text fontSize={{ sm: '10px', lg: '12px' }} fontWeight="bold" color={textColor}>
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
                  <Td key={column.Header} fontSize={{ sm: '16px' }} width={column.width || 'auto'} borderColor="transparent">
                    {column.Cell ? (
                      column.Cell({ value: row[column.accessor], rowIndex: index, row })
                    ) : (
                      <Text color={textColor}>{row[column.accessor] || 'N/A'}</Text>
                    )}
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
