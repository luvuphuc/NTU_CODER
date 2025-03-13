import React, { useEffect, useState, useCallback } from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import api from "../../../utils/api"; 
import ScrollToTop from "components/scroll/ScrollToTop";
import { MdAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import Pagination from "components/pagination/pagination";
import ContestTable from "./components/ColumnsTable";

export default function ContestIndex() {
  const [tableData, setTableData] = useState([]);
  const [sortField, setSortField] = useState("");
  const [ascending, setAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get('/Contest/all', {
        params: {
          Page: currentPage,
          PageSize: pageSize,
          ascending: ascending,
          sortField: sortField,
        },
      });
      const dataWithStatus = Array.isArray(response.data.data)
        ? response.data.data.map((item) => ({
            ...item
          }))
        : [];
      setTableData(dataWithStatus);
      setTotalPages(response.data.totalPages || 0);
      setTotalRows(response.data.totalCount || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [sortField, ascending, currentPage, pageSize]);

  useEffect(() => {
    fetchData();
  }, [sortField, ascending, currentPage, pageSize]);

  const handleSort = (field) => {
    setSortField(field);
    setAscending((prev) => (prev && sortField === field ? !ascending : true));  // Toggle the sorting order
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
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Flex mb="20px" justifyContent="end" align="end" px="25px">
          <Link to="create">
            <Button variant="solid" size="lg" colorScheme="green" borderRadius="md">
              Thêm <MdAdd size="25" />
            </Button>
          </Link>
        </Flex>
        <ContestTable
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
    </ScrollToTop>
  );
}
