
import { Box, SimpleGrid } from "@chakra-ui/react";
import ColumnsTable from "views/admin/dataTables/components/ColumnsTable";
import {
  columnsDataDevelopment,
  columnsDataCheck,
  columnsDataColumns,
  columnsDataComplex,
} from "views/admin/dataTables/variables/columnsData";
import tableDataColumns from "views/admin/dataTables/variables/tableDataColumns.json";
import React from "react";
import ScrollToTop from "components/scroll/ScrollToTop";

export default function Settings() {
  // Chakra Color Mode
  return (
    <ScrollToTop>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        spacing={{ base: "20px", xl: "20px" }}>
        <ColumnsTable
          columnsData={columnsDataColumns}
          tableData={tableDataColumns}
        />
      </SimpleGrid>
    </Box></ScrollToTop>
    
  );
}
