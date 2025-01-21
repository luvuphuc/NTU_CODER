import React, { useEffect, useState } from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import api from "../../../utils/api"; 
import ColumnsTable from "views/admin/coder/components/ColumnsTable";
import ScrollToTop from "components/scroll/ScrollToTop";
import { MdAdd } from "react-icons/md";
import { useNavigate,Link } from "react-router-dom";
export default function CoderIndex() {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/Coder/all")
      .then((response) => {
        const dataWithStatus = response.data.data.map(item => ({
          ...item,
          status: true,
        }));
        setTableData(dataWithStatus);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <ScrollToTop>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Flex mb="8px" justifyContent="end" align="end" px="25px">
          <Link to="create"><Button 
            variant="solid" 
            size="lg" 
            colorScheme="green" 
            borderRadius="md" 
          >
            Thêm <MdAdd size="25" />
          </Button>
          </Link>
        </Flex>
        <ColumnsTable tableData={tableData} />
      </Box>
    </ScrollToTop>
  );
}
