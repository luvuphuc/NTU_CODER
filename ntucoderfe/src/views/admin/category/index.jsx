import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  Flex,
  useToast,
  useDisclosure,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormErrorMessage,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import api from '../../../utils/api';
import CategoryTable from './components/ColumnsTable';
import ScrollToTop from 'components/scroll/ScrollToTop';
import { MdAdd } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Pagination from 'components/pagination/pagination';

export default function CategoryIndex() {
  const [tableData, setTableData] = useState([]);
  const [sortField, setSortField] = useState('');
  const [ascending, setAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const [newCategory, setNewCategory] = useState({ catName: '', catOrder: 0 });
  const [errors, setErrors] = useState({});
  const fetchData = useCallback(async () => {
    try {
      const response = await api.get('/category/all', {
        params: {
          Page: currentPage,
          PageSize: pageSize,
          ascending: ascending,
          sortField: sortField,
        },
      });
      const dataWithStatus = Array.isArray(response.data.data)
        ? response.data.data.map((item) => ({
            ...item,
            status: true,
          }))
        : [];
      setTableData(dataWithStatus);
      setTotalPages(response.data.totalPages || 0); // Mặc định là 0 nếu không có
      setTotalRows(response.data.totalCount || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [sortField, ascending, currentPage, pageSize]);
  useEffect(() => {
    fetchData();
  }, [sortField, ascending, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setAscending(!ascending);
    } else {
      setSortField(field);
      setAscending(true);
    }
  };
  const refetchData = () => {
    fetchData();
  };
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (value) => {
    const newPageSize = parseInt(value, 10);
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1);
    }
  };
  const handleAddChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleAddCategory = async () => {
    try {
      setLoading(true);
      const response = await api.post('/Category/create', newCategory);
      if (response.status === 201) {
        toast({
          title: 'Thêm mới thành công!',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        onAddClose();
        refetchData();
        setErrors({});
      } else {
        throw new Error('Có lỗi xảy ra khi thêm thể loại');
      }
    } catch (error) {
      if (Array.isArray(error.response.data.errors)) {
        const errorMap = {};
        error.response.data.errors.forEach((err) => {
          if (err.includes('Tên thể loại')) errorMap.catName = err;
          if (err.includes('Thứ tự')) errorMap.catOrder = err;
        });
        setErrors(errorMap);
      } else {
        toast({
          title: 'Đã xảy ra lỗi.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const handleOpenModel = () => {
    setNewCategory({ catName: '', catOrder: 0 });
    setErrors({});
    onAddOpen();
  };

  return (
    <ScrollToTop>
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Flex mb="20px" justifyContent="end" align="end" px="25px">
          <Link to="">
            <Button
              variant="solid"
              size="lg"
              colorScheme="green"
              borderRadius="md"
              onClick={handleOpenModel}
            >
              Thêm <MdAdd size="25" />
            </Button>
          </Link>
        </Flex>
        <CategoryTable
          tableData={tableData}
          onSort={handleSort}
          sortField={sortField}
          ascending={ascending}
          refetchData={refetchData}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRows={totalRows}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>
      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm thể loại</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!errors.catName} mb={3}>
              <FormLabel>Tên thể loại</FormLabel>
              <Input
                name="catName"
                placeholder="Tên thể loại"
                onChange={handleAddChange}
              />
              <FormErrorMessage>{errors.catName}</FormErrorMessage>
            </FormControl>
            {/* Sắp xếp */}
            <FormControl isInvalid={!!errors.catOrder}>
              <FormLabel>Sắp xếp</FormLabel>
              <Input
                name="catOrder"
                type="number"
                placeholder="Sắp xếp"
                value={newCategory.catOrder}
                onChange={handleAddChange}
              />
              <FormErrorMessage>{errors.catOrder}</FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" onClick={onAddClose}>
              Hủy
            </Button>
            <Button
              colorScheme="blue"
              isLoading={loading}
              onClick={handleAddCategory}
            >
              Thêm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ScrollToTop>
  );
}
