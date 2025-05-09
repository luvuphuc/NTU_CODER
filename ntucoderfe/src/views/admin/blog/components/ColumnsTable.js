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
export default function BlogTable({
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
  const [currentblogID, setCurrentblogID] = useState(null);
  const [problemCount, setProblemCounts] = useState({});
  const handleDetailClick = (blogID) => {
    navigate(`/admin/blog/detail/${blogID}`);
  };
  const handleToggleStatus = async (blogID, field, currentValue) => {
    try {
      const newValue = currentValue === 0 ? 1 : 0;
      const updatedTableData = tableData.map((blog) =>
        blog.blogID === blogID ? { ...blog, [field]: newValue } : blog,
      );
      refetchData(updatedTableData);

      const response = await api.put(`/Blog/${blogID}`, {
        [field]: newValue,
      });

      if (response.status === 200) {
        toast({
          title: 'Cập nhật thành công!',
          description: `Trạng thái đã được cập nhật.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });

        refetchData();
      } else {
        throw new Error('Có lỗi xảy ra khi cập nhật trạng thái.');
      }
    } catch (error) {
      const revertedTableData = tableData.map((blog) =>
        blog.blogID === blogID ? { ...blog, [field]: currentValue } : blog,
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

      const response = await api.delete(`/Contest/${currentblogID}`);
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
      Header: 'Tiêu đề',
      accessor: 'title',
      sortField: 'title',
    },
    {
      Header: 'Ngày tạo',
      accessor: 'blogDate',
      sortField: 'blogDate',
      Cell: ({ value, row }) => (
        <Text>
          {moment.utc(value).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm')}
        </Text>
      ),
    },
    {
      Header: 'Người tạo',
      accessor: 'coderName',
    },
    {
      Header: 'Công khai',
      accessor: 'published',
      Cell: ({ row }) => (
        <Switch
          isChecked={row.published === 1}
          onChange={() =>
            handleToggleStatus(row.blogID, 'published', row.published)
          }
        />
      ),
    },
    {
      Header: 'Ghim bài',
      accessor: 'pinHome',
      Cell: ({ row }) => (
        <Switch
          isChecked={row.pinHome === 1}
          onChange={() =>
            handleToggleStatus(row.blogID, 'pinHome', row.pinHome)
          }
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
            onClick={() => handleDetailClick(row.blogID)}
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
              setCurrentblogID(row.blogID);
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
  useEffect(() => {
    const fetchProblemCounts = async () => {
      try {
        const counts = {};
        for (const contest of tableData) {
          const response = await api.get(
            `/HasProblem/count?contestId=${contest.blogID}`,
          );
          counts[contest.blogID] = response.data.count || 0;
        }
        setProblemCounts(counts);
      } catch (error) {
        console.error('Lỗi khi lấy số lượng problem:', error);
      }
    };

    if (tableData.length > 0) {
      fetchProblemCounts();
    }
  }, [tableData]);

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
