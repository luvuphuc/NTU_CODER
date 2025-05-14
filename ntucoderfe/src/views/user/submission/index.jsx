import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container } from '@chakra-ui/react';
import LayoutUser from 'layouts/user';
import SubmissionTableUser from './components/submission_table';
import Pagination from 'components/pagination/pagination';
import api from 'config/api';
import { useDebounce } from 'use-debounce';

export default function SubmissionPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [sortField, setSortField] = useState('submitTime');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchString, setSearchString] = useState('');
  const [compilerFilter, setCompilerFilter] = useState('');
  const [compilers, setCompilers] = useState([]);

  const [debouncedPage] = useDebounce(currentPage, 200);
  const [debouncedSize] = useDebounce(pageSize, 200);
  const [debouncedSearch] = useDebounce(searchString, 300);
  const [debouncedCompiler] = useDebounce(compilerFilter, 300);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/Submission/all', {
        params: {
          page: debouncedPage,
          pageSize: debouncedSize,
          sortField: sortField,
          ascending: sortOrder === 'asc',
          searchString: debouncedSearch,
          compilerFilter: debouncedCompiler,
        },
      });
      setSubmissions(res.data.data);
      setTotalPages(res.data.totalPages || 1);
      setTotalRows(res.data.totalCount || 0);
    } catch (err) {
      console.error('Fetch submissions failed:', err);
    } finally {
      setLoading(false);
    }
  }, [
    debouncedPage,
    debouncedSize,
    sortOrder,
    sortField,
    debouncedSearch,
    debouncedCompiler,
  ]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  useEffect(() => {
    api
      .get('/Compiler/all', { params: { ascending: true } })
      .then((res) => setCompilers(res.data.data || []))
      .catch((err) => console.error('Fetch compilers failed:', err));
  }, []);

  return (
    <LayoutUser>
      <Box>
        <Container maxW="8xl" py={12} px={0}>
          <SubmissionTableUser
            submissions={submissions}
            loading={loading}
            currentPage={currentPage}
            pageSize={pageSize}
            totalRows={totalRows}
            searchString={searchString}
            setSearchString={setSearchString}
            compilerFilter={compilerFilter}
            setCompilerFilter={setCompilerFilter}
            compilers={compilers}
            sortField={sortField}
            setSortField={setSortField}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </Container>
      </Box>
    </LayoutUser>
  );
}
