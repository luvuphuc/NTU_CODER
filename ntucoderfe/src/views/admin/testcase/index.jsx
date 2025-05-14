import React, { useEffect, useState, useCallback } from 'react';
import { Box, Button, Flex, useToast } from '@chakra-ui/react';
import api from '../../../config/api';
import CoderTable from './components/ColumnsTable';
import ScrollToTop from 'components/scroll/ScrollToTop';
import { MdAdd } from 'react-icons/md';
import Pagination from 'components/pagination/pagination';
import { useParams } from 'react-router-dom';
import CreateTestCaseModal from './components/Create';

export default function TestCaseIndex() {
  const { problemID } = useParams();
  const [tableData, setTableData] = useState([]);
  const [problemName, setProblemName] = useState(''); // Thêm state để lưu problemName
  const [sortField, setSortField] = useState('');
  const [ascending, setAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();
  const fetchData = useCallback(async () => {
    if (!problemID) return;
    try {
      const response = await api.get('/TestCase/all', {
        params: {
          problemID,
          ascending,
          Page: currentPage,
          PageSize: pageSize,
          sortField,
        },
      });

      if (response.data.data.length > 0) {
        setProblemName(response.data.data[0].problemName || '');
      }

      const dataWithStatus = response.data.data.map((item) => ({
        ...item,
        status: true,
      }));

      setTableData(dataWithStatus);
      setTotalPages(response.data.totalPages || 0);
      setTotalRows(response.data.totalCount || 0);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu TestCase',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [problemID, sortField, ascending, currentPage, pageSize, toast]);

  useEffect(() => {
    fetchData();
  }, [problemID, sortField, ascending, currentPage, pageSize]);

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

  return (
    <ScrollToTop>
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Flex mb="20px" justifyContent="end" align="end" px="25px">
          <Button
            variant="solid"
            size="lg"
            colorScheme="green"
            borderRadius="md"
            onClick={() => setIsModalOpen(true)}
          >
            Thêm <MdAdd size="25" />
          </Button>
        </Flex>
        <CoderTable
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
        <CreateTestCaseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          refetchData={refetchData}
          problemID={problemID}
          problemName={problemName}
        />
      </Box>
    </ScrollToTop>
  );
}
