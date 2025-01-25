import React, { useEffect, useState } from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import api from "../../../utils/api"; 
import ColumnsTable from "views/admin/coder/components/ColumnsTable";
import ScrollToTop from "components/scroll/ScrollToTop";
import { MdAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import Pagination from "components/pagination/pagination";

export default function CoderIndex() {
  const [tableData, setTableData] = useState([]);
  const [sortField, setSortField] = useState("coderName");
  const [ascending, setAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTableData = () => {
    api
      .get(`/Coder/all?sortField=${sortField}&ascending=${ascending}&page=${currentPage}&size=${pageSize}`)
      .then((response) => {
        const dataWithStatus = response.data.data.map(item => ({
          ...item,
          status: true,
        }));
        setTableData(dataWithStatus);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchTableData();
  }, [sortField, ascending, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setAscending(!ascending);
    } else {
      setSortField(field);
      setAscending(true);
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
        <ColumnsTable 
          tableData={tableData} 
          onSort={handleSort} 
          sortField={sortField} 
          ascending={ascending}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </Box>
    </ScrollToTop>
  );
}
