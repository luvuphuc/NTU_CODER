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
  Input
} from '@chakra-ui/react';
import { BiSort, BiEdit } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Card from 'components/card/Card';
import api from 'utils/api';
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";

export default function CategoryTable({ tableData, onSort, sortField, ascending, refetchData }) {
  const { colorMode } = useColorMode();
  const textColor = colorMode === 'light' ? 'black' : 'white';
  const borderColor = colorMode === 'light' ? 'gray.200' : 'whiteAlpha.300';
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [currentcategoryID, setCurrentcategoryID] = useState(null);

  const [editData, setEditData] = useState({ categoryID: '', catName: '', catOrder: '' });
  const handleEditClick = (row) => {
    setEditData(row);
    onEditOpen();
  };
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };
  const handleDeleteClick = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await api.delete(`/Category/${currentcategoryID}`);
      if (response.status === 200) {
        toast({
          title: "Xóa thành công!",
          description: "Thể loại đã bị xóa.",
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
  const handleUpdateCategory = async () => {
    try {
      setLoading(true);
      const response = await api.put(`/Category/${editData.categoryID}`, {
        catName: editData.catName,
        catOrder: editData.catOrder,
      });

      if (response.status === 200) {
        toast({
          title: "Cập nhật thành công!",
          description: "Thể loại đã được cập nhật.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        onEditClose();
        refetchData();
      } else {
        throw new Error("Có lỗi xảy ra khi cập nhật");
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi cập nhật.",
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
      Header: 'Tên thể loại',
      accessor: 'catName',
    },
    {
      Header: 'Sắp xếp',
      accessor: 'catOrder',
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
            onClick={() => handleEditClick(row)}
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
              setCurrentcategoryID(row.categoryID);
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
    if (sortField !== field) return <BiSort size="18px" />;
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
                      {/* Sorting icon is enabled only for the "CatOrder" column */}
                      {column.accessor === 'CatOrder' && onSort && (
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
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chỉnh sửa thể loại</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={4}>
              <Text fontSize="sm" mb={1}>Tên thể loại</Text>
              <Input name="catName" value={editData.catName} onChange={handleChange} />
            </Box>
            <Box mb={4}>
              <Text fontSize="sm" mb={1}>Sắp xếp</Text>
              <Input name="catOrder" type="number" value={editData.catOrder} onChange={handleChange} />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" onClick={onEditClose}>Hủy</Button>
            <Button colorScheme="blue" isLoading={loading} onClick={handleUpdateCategory}>
              Lưu
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
