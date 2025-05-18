import React, { useState, useEffect } from 'react';
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
  Switch,
} from '@chakra-ui/react';
import { BiSolidDetail } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { useNavigate, Link } from 'react-router-dom';
import Card from 'components/card/Card';
import api from 'config/api';
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from 'react-icons/ai';

export default function SubmissionTable({
  tableData,
  onSort,
  sortField,
  ascending,
  refetchData,
}) {
  const { colorMode } = useColorMode();
  const textColor = colorMode === 'light' ? 'black' : 'white';
  const borderColor = colorMode === 'light' ? 'gray.200' : 'whiteAlpha.300';
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [currentsubmissionID, setCurrentsubmissionID] = useState(null);
  const [testCaseCounts, setTestCaseCounts] = useState({});
  const handleDetailClick = (submissionID) => {
    navigate(`/admin/submission/detail/${submissionID}`);
  };

  const handleTogglePublished = async (submissionID, currentValue) => {
    try {
      const newValue = currentValue === 0 ? 1 : 0;
      const updatedTableData = tableData.map((submission) =>
        submission.submissionID === submissionID
          ? { ...submission, published: newValue }
          : submission,
      );

      refetchData(updatedTableData);

      const response = await api.put(`/Problem/${submissionID}`, {
        published: newValue,
      });

      if (response.status === 200) {
        toast({
          title: 'Cập nhật thành công!',
          description: `Trạng thái đã được cập nhật.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        refetchData();
      } else {
        throw new Error('Có lỗi xảy ra khi cập nhật trạng thái.');
      }
    } catch (error) {
      const revertedTableData = tableData.map((submission) =>
        submission.submissionID === submissionID
          ? { ...submission, published: currentValue }
          : submission,
      );
      refetchData(revertedTableData);

      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi cập nhật trạng thái.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleDeleteClick = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await api.delete(`/Submission/${currentsubmissionID}`);
      if (response.status === 200) {
        toast({
          title: 'Xóa thành công!',
          description: 'Bài làm đã bị xóa.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        onClose();
        refetchData();
      } else {
        throw new Error('Có lỗi xảy ra khi xóa');
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi xóa.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };
  const columnsData = [
    {
      Header: '#',
      accessor: 'index',
      Cell: ({ rowIndex }) => <Text>{rowIndex + 1}</Text>,
    },
    {
      Header: 'Tên bài tập',
      accessor: 'problemName',
    },
    {
      Header: 'Tên người nộp',
      accessor: 'coderName',
    },
    {
      Header: 'Thời gian nộp',
      accessor: 'submitTime',
      Cell: ({ value }) => (
        <Text>{new Date(value).toLocaleString('vi-VN')}</Text>
      ),
    },
    {
      Header: 'Thời gian chạy (ms)',
      accessor: 'maxTimeDuration',
      Cell: ({ value }) => <Text>{value != null ? value : 'N/A'}</Text>,
    },
    {
      Header: 'Kết quả',
      accessor: 'testResult',
      Cell: ({ value }) => (
        <Text color={value === 'Accepted' ? 'green.500' : 'red.500'}>
          {value === 'Accepted' ? 'Accepted' : 'Failed'}
        </Text>
      ),
    },
    {
      Header: 'Trạng thái',
      accessor: 'submissionStatus',
      Cell: ({ value }) => (
        <Text color={value === 1 ? 'blue.500' : 'orange.400'}>
          {value === 1 ? 'Đã chấm' : 'Đang chờ'}
        </Text>
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
            onClick={() => handleDetailClick(row.submissionID)}
          >
            <BiSolidDetail size="18" color="white" />
          </Button>
          <Button
            variant="solid"
            size="sm"
            colorScheme="red"
            borderRadius="md"
            minW="auto"
            onClick={() => {
              setCurrentsubmissionID(row.submissionID);
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
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
      >
        <Box>
          {tableData.length === 0 ? (
            <Text fontSize="lg" color="gray.500" textAlign="center">
              Không có dữ liệu nào
            </Text>
          ) : (
            <Table
              variant="simple"
              color="gray.500"
              mb="24px"
              mt="12px"
              tableLayout="fixed"
            >
              <Thead>
                <Tr>
                  {columnsData.map((column) => (
                    <Th
                      key={column.Header}
                      borderColor={borderColor}
                      width={column.width || 'auto'}
                    >
                      <Flex align="center" gap={2}>
                        <Text
                          fontSize={{ sm: '10px', lg: '12px' }}
                          fontWeight="bold"
                          color={textColor}
                        >
                          {column.Header}
                        </Text>
                        {column.sortField && onSort && (
                          <Box
                            onClick={() => onSort(column.sortField)}
                            cursor="pointer"
                          >
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
                      <Td
                        key={column.Header}
                        fontSize={{ sm: '16px' }}
                        width={column.width || 'auto'}
                        borderColor="transparent"
                      >
                        {column.Cell ? (
                          column.Cell({
                            value: row[column.accessor],
                            rowIndex: index,
                            row,
                          })
                        ) : (
                          <Text color={textColor}>
                            {row[column.accessor] || 'N/A'}
                          </Text>
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
            <Button
              colorScheme="red"
              isLoading={loading}
              loadingText="Đang xóa..."
              onClick={handleDeleteClick}
            >
              Xóa
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
