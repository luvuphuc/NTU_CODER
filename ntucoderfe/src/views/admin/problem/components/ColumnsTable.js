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
  Switch
} from '@chakra-ui/react';
import { BiSort, BiSortUp, BiSortDown, BiSolidDetail } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Card from 'components/card/Card';
import api from 'utils/api';
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";

export default function ProblemTable({ tableData, onSort, sortField, ascending, refetchData }) {
  const { colorMode } = useColorMode();
  const textColor = colorMode === 'light' ? 'black' : 'white';
  const borderColor = colorMode === 'light' ? 'gray.200' : 'whiteAlpha.300';
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [currentproblemID, setCurrentproblemID] = useState(null);

  const handleDetailClick = (problemID) => {
    navigate(`/admin/problem/detail/${problemID}`);
  };

  const handleTogglePublished = async (problemID, currentValue) => {
    try {
      const newValue = currentValue === 0 ? 1 : 0;
      const updatedTableData = tableData.map(problem =>
        problem.problemID === problemID ? { ...problem, published: newValue } : problem
      );
    
      refetchData(updatedTableData);

      const response = await api.put(`/Problem/${problemID}`, { published: newValue });
    
      if (response.status === 200) {
        toast({
          title: "Cập nhật thành công!",
          description: `Trạng thái đã được cập nhật.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        refetchData();
      } else {
        throw new Error("Có lỗi xảy ra khi cập nhật trạng thái.");
      }
    } catch (error) {
      const revertedTableData = tableData.map(problem =>
        problem.problemID === problemID ? { ...problem, published: currentValue } : problem
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

      const response = await api.delete(`/Problem/${currentproblemID}`);
      if (response.status === 200) {
        toast({
          title: "Xóa thành công!",
          description: "Bài tập đã bị xóa.",
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
      Header: 'Mã bài tập',
      accessor: 'problemCode',
      sortField: 'problemCode',
    },
    {
      Header: 'Tên bài tập',
      accessor: 'problemName',
      sortField: 'problemName',
    },
    {
      Header: 'Tên ND',
      accessor: 'coderID',
    },
    {
      Header: 'Kiểu test',
      accessor: 'testType',
    },
    {
      Header: 'Trạng thái',
      accessor: 'published',
      Cell: ({ row }) => (
        <Switch
          isChecked={row.published === 1}
          onChange={() => handleTogglePublished(row.problemID, row.published)}
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
            colorScheme="facebook"
            borderRadius="md"
            minW="auto"
            onClick={() => handleDetailClick(row.problemID)}
          >
            <BiSolidDetail size="18" />
          </Button>
          <Button
            variant="solid"
            size="sm"
            colorScheme="red"
            borderRadius="md"
            minW="auto"
            onClick={() => {
              setCurrentproblemID(row.problemID);
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
    return sortField === field ? (
      ascending ? (
        <Box as="span" fontWeight="bold">
          <AiOutlineSortAscending size="20px" />
        </Box>
      ) : (
        <Box as="span" fontWeight="bold">
          <AiOutlineSortDescending size="20px" />
        </Box>
      )
    ) : (
      <Box as="span" fontWeight="bold">
        <AiOutlineSortAscending size="20px" />
      </Box>
    );
  };
  

  return (
    <>
      <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
        <Box>
          {tableData.length === 0 ? (
            <Text fontSize="lg" color="gray.500" textAlign="center">
              Không có dữ liệu nào
            </Text>
          ) : (
            <Table variant="simple" color="gray.500" mb="24px" mt="12px" tableLayout="fixed">
              <Thead>
                <Tr>
                  {columnsData.map((column) => (
                    <Th key={column.Header} borderColor={borderColor} width={column.width || 'auto'}>
                      <Flex align="center" gap={2}>
                        <Text fontSize={{ sm: '10px', lg: '12px' }} fontWeight="bold" color={textColor}>
                          {column.Header}
                        </Text>
                        {column.sortField && onSort && (
                          <Box onClick={() => onSort(column.sortField)} cursor="pointer">
                            {renderSortIcon(column.sortField)}
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
                          <Text color={textColor}>{row[column.accessor] || 'N/A'}</Text>
                        )}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
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
    </>
  );
}

