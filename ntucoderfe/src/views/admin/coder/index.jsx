import React, { useEffect, useState, useCallback } from "react";
import { Box, Button, Flex,useToast } from "@chakra-ui/react";
import api from "../../../utils/api"; 
import CoderTable from "./components/ColumnsTable";
import ScrollToTop from "components/scroll/ScrollToTop";
import { MdAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import Pagination from "components/pagination/pagination";

export default function CoderIndex() {
  const [tableData, setTableData] = useState([]);
  const [sortField, setSortField] = useState("coderName");
  const [ascending, setAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const fetchData = useCallback(async () => {
  try {
    const response = await api.get('/coder/all', {
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
    setTotalRows (response.data.totalCount || 0);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}, [sortField, ascending,currentPage, pageSize]);
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
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Flex mb="20px" justifyContent="end" align="end" px="25px">
          <Link to="create">
            <Button 
              variant="solid" 
              size="lg" 
              colorScheme="green" 
              borderRadius="md"
            >
              Thêm <MdAdd size="25" />
            </Button>
          </Link>
        </Flex>
        <CoderTable 
          tableData={tableData} 
          onSort={handleSort} 
          sortField={sortField} 
          ascending={ascending}
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
    </ScrollToTop>
  );
}