import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
  useColorModeValue,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Switch
} from '@chakra-ui/react';
import { BiSort, BiEdit } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Card from 'components/card/Card';
import api from 'utils/api';
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";
import EditTestCaseModal from './Update';
export default function TestCaseTable({ tableData, onSort, sortField, ascending, refetchData }) {
  const { colorMode } = useColorMode();
  const textColor = colorMode === 'light' ? 'black' : 'white';
  const borderColor = colorMode === 'light' ? 'gray.200' : 'whiteAlpha.300';
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [currentTestCaseID, setCurrentTestCaseID] = useState(null);
  const handleEditClick = (testCaseID) => {
    setCurrentTestCaseID(testCaseID);
    onEditOpen();
  };
  const handleToggleStatus = async (testCaseID, field, currentValue) => {
    try {
      const newValue = currentValue === 0 ? 1 : 0;
      const updatedTableData = tableData.map(testcase =>
        testcase.testCaseID === testCaseID ? { ...testcase, [field]: newValue } : testcase
      );
      refetchData(updatedTableData);

      const response = await api.put(`/TestCase/${testCaseID}`, { [field]: newValue });
  
      if (response.status === 200) {
        toast({
          title: "Cập nhật thành công!",
          description: `Trạng thái đã được cập nhật.`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
  
        refetchData();
      } else {
        throw new Error("Có lỗi xảy ra khi cập nhật trạng thái.");
      }
    } catch (error) {
      const revertedTableData = tableData.map(testcase =>
        testcase.testCaseID === testCaseID ? { ...testcase, [field]: currentValue } : testcase
      );
      refetchData(revertedTableData);
  
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi cập nhật trạng thái.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  
  const handleDeleteClick = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await api.delete(`/TestCase/${currentTestCaseID}`);
      if (response.status === 200) {
        toast({
          title: "Xóa thành công!",
          description: "Testcase đã bị xóa.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        onClose();
        refetchData();
      } else {
        throw new Error("Có lỗi xảy ra khi xóa");
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi xóa.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };
  const columnsData = [
    {
      Header: 'STT',
      accessor: 'stt',
      Cell: ({ rowIndex }) => rowIndex + 1,
      minWidth: '20px',
    },
    {
      Header: 'TestCaseOrder',
      accessor: 'testCaseOrder',
    },
    {
      Header: 'Input',
      accessor: 'input',
    },
    {
      Header: 'Output',
      accessor: 'output',
    },
    {
      Header: 'PreTest',
      accessor: 'preTest',
      Cell: ({ row }) => (
        <Switch
          isChecked={row.preTest === 1}
          onChange={() => handleToggleStatus(row.testCaseID, "preTest", row.preTest)}
        />
      ),
    },
    {
      Header: 'SampleTest',
      accessor: 'sampleTest',
      Cell: ({ row }) => (
        <Switch
          isChecked={row.sampleTest === 1}
          onChange={() => handleToggleStatus(row.testCaseID, "sampleTest", row.sampleTest)}
        />
      ),
    },
    {
      Header: '',
      accessor: 'action',
      Cell: ({ row }) => (
        <Flex gap={4} justify="center" align="center">
          <Button
            variant="solid"
            size="sm"
            colorScheme="blue"
            borderRadius="md"
            minW="auto"
            onClick={() => handleEditClick(row.testCaseID)}
          >
            <BiEdit size="18" />
          </Button>
          <Button
            variant="solid"
            size="sm"
            colorScheme="red"
            borderRadius="md"
            minW="auto"
            onClick={() => {
              setCurrentTestCaseID(row.testCaseID);
              onOpen();
            }}
          >
            <MdDelete size="18" />
          </Button>
        </Flex>
      ),
    },
  ];

  const renderSortIcon = (field) => {
    if (sortField !== field) return <AiOutlineSortAscending size="20px" />;
    return ascending ? (
      <Box as="span" fontWeight="bold">
        <AiOutlineSortAscending size="20px" />
      </Box>
    ) : (
      <Box as="span" fontWeight="bold">
        <AiOutlineSortDescending size="20px" />
      </Box>
    );
  };
  return (
    <>
      <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
        <Box>
          <Table variant="simple" color="gray.500" mb="24px" mt="12px" tableLayout="fixed">
            <Thead>
              <Tr>
                {columnsData.map((column) => (
                  <Th key={column.Header} borderColor={borderColor} width={column.width || 'auto'}>
                    <Flex align="center" gap={2}>
                      <Text fontSize={{ sm: '10px', lg: '12px' }} fontWeight="bold" color={textColor}>
                        {column.Header}
                      </Text>
                      {column.accessor === 'testCaseOrder' && onSort && (
                        <Box onClick={() => onSort(column.accessor)} cursor="pointer">
                          {renderSortIcon(column.accessor)}
                        </Box>
                      )}
                    </Flex>
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
                        <Text color={textColor}>{row[column.accessor] != null ? row[column.accessor] : 'N/A'}</Text>

                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xác nhận xóa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Bạn có chắc chắn muốn xóa hay không?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Hủy
            </Button>
            <Button colorScheme="red" isLoading={loading} loadingText="Đang xóa..." onClick={handleDeleteClick}>
              Xóa
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {currentTestCaseID !== null && (
        <EditTestCaseModal 
          isOpen={isEditOpen} 
          onClose={onEditClose} 
          testCaseID={currentTestCaseID} 
          refetchData={refetchData} 
        />
      )}
    </>
  );
}
