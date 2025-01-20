import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import api from "../../../utils/api"; 
import ColumnsTable from "views/admin/coder/components/ColumnsTable";
import ScrollToTop from "components/scroll/ScrollToTop";

export default function Settings() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    api
      .get("/Coder/all?ascending=true")
      .then((response) => {
        console.log("API Response:", response);
        const dataWithStatus = response.data.data.map(item => ({
          ...item,
          status: true, // Default 'status' field added
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
        <ColumnsTable
          tableData={tableData} 
        />
      </Box>
    </ScrollToTop>
  );
}
