import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, Grid } from '@chakra-ui/react';
import LayoutUser from 'layouts/user';
import ContestTableUser from './components/ColumnsTable';
import RankingTable from './components/RankingsTable';
import api from 'utils/api';
import UpcomingContests from './components/UpcomingContest';
import OnGoingContests from './components/OnGoingContest';
export default function ContestPage() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
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
          ascending: sortOrder === 'asc',
          status: filterStatus !== 'all' ? filterStatus : null,
          searchString: searchTerm || null,
        },
      });
      setContests(response.data.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, sortOrder, filterStatus, searchTerm]);

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
          <OnGoingContests contests={contests.filter((c) => c.status === 1)} />
          <Grid
            templateColumns={{ base: '1fr', md: '3.2fr 1fr' }}
            gap={8}
            alignItems="stretch"
          >
            <ContestTableUser
              contests={contests}
              loading={loading}
              sortOrder={sortOrder}
              onSortStatusChange={handleSortStatusChange}
              onRefresh={handleRefresh}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
            <Box alignSelf="start">
              <RankingTable />
            </Box>
          </Grid>
        </Container>
      </Box>
    </LayoutUser>
  );
}
