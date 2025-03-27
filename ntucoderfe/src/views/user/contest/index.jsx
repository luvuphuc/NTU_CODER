import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, Grid } from '@chakra-ui/react';
import LayoutUser from 'layouts/user';
import ContestTableUser from './components/ColumnsTable';
import RankingTable from './components/RankingsTable';
import Pagination from 'components/pagination/pagination';
import api from 'utils/api';
import UpcomingContests from './components/UpcomingContest';

export default function ContestPage() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSortStatusChange = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const fetchContests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/contest/all', {
        params: { 
          page: currentPage, 
          pageSize,
          sortField: 'status',
          ascending: sortOrder === 'asc'
        },
      });
      setContests(response.data.data);
      setTotalPages(response.data.totalPages || 1);
      setTotalRows(response.data.totalCount || 0);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, sortOrder]);

  useEffect(() => {
    fetchContests();
  }, [fetchContests]);

  const handleRefresh = () => {
    fetchContests();
  };

  return (
    <LayoutUser>
      <Box>
        <Container maxW="7xl" py={12} px={0}>
          <UpcomingContests />
          <Grid templateColumns={{ base: '1fr', md: '3.2fr 1fr' }} gap={8} alignItems="stretch">
            <ContestTableUser 
              contests={contests} 
              loading={loading} 
              sortOrder={sortOrder} 
              onSortStatusChange={handleSortStatusChange}
              onRefresh={handleRefresh}  
            />
            <Box alignSelf="start">
              <RankingTable />
            </Box>
          </Grid>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            totalRows={totalRows}
            onPageSizeChange={setPageSize}
          />
        </Container>
      </Box>
    </LayoutUser>
  );
}
