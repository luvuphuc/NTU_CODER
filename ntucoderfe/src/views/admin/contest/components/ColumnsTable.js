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
import api from 'utils/api';
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from 'react-icons/ai';
import moment from 'moment-timezone';
export default function ContestTable({
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
  const [currentcontestID, setCurrentcontestID] = useState(null);
  const [testCaseCounts, setTestCaseCounts] = useState({});
  const handleDetailClick = (contestID) => {
    navigate(`/admin/contest/detail/${contestID}`);
  };
  const getStatusColor = (status) => {
    const statusMap = {
      0: 'red.500', // Đã kết thúc
      1: 'green.500', // Đang diễn ra
      2: 'blue.500', // Sắp diễn ra
    };
    return statusMap[status] || 'gray.500';
  };
  const handleTogglePublished = async (contestID, currentValue) => {
    try {
      const newValue = currentValue === 0 ? 1 : 0;
      const updatedTableData = tableData.map((contest) =>
        contest.contestID === contestID
          ? { ...contest, published: newValue }
          : contest,
      );

      refetchData(updatedTableData);

      const response = await api.put(`/Contest/${contestID}`, {
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
      const revertedTableData = tableData.map((contest) =>
        contest.contestID === contestID
          ? { ...contest, published: currentValue }
          : contest,
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

      const response = await api.delete(`/Contest/${currentcontestID}`);
      if (response.status === 200) {
        toast({
          title: 'Xóa thành công!',
          description: 'Cuộc thi đã bị xóa.',
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
      Header: 'Tên cuộc thi',
      accessor: 'contestName',
      sortField: 'contestName',
    },
    {
      Header: 'Bắt đầu',
      accessor: 'startTime',
      sortField: 'startTime',
      Cell: ({ value, row }) => (
        <Text color={getStatusColor(row.status)}>
          {moment.utc(value).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm')}
        </Text>
      ),
    },
    {
      Header: 'Kết thúc',
      accessor: 'endTime',
      Cell: ({ value, row }) => (
        <Text color={getStatusColor(row.status)}>
          {moment.utc(value).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm')}
        </Text>
      ),
    },
    {
      Header: 'Người tạo',
      accessor: 'coderName',
    },
    {
      Header: 'Trạng thái',
      accessor: 'status',
      Cell: ({ row }) => {
        const statusMap = {
          0: { label: 'Đã kết thúc', color: 'red.500' },
          1: { label: 'Đang diễn ra', color: 'green.500' },
          2: { label: 'Sắp diễn ra', color: 'blue.500' },
        };

        const status = statusMap[row.status] || {
          label: 'Không xác định',
          color: 'gray.500',
        };

        return (
          <Text color={status.color} fontWeight="bold">
            {status.label}
          </Text>
        );
      },
    },
    {
      Header: 'Công khai',
      accessor: 'published',
      Cell: ({ row }) => (
        <Switch
          isChecked={row.published === 1}
          onChange={() => handleTogglePublished(row.contestID, row.published)}
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
            onClick={() => handleDetailClick(row.contestID)}
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
              setCurrentcontestID(row.contestID);
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
