import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Card,
  CardBody,
  Stack,
  Button,
  Flex,
  Grid,
  Checkbox,
  Divider,
  IconButton,
  Spinner,
  Badge,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import Navigation from '../common/navigation';
import Header from '../common/header';
import { IoMdHeartEmpty } from 'react-icons/io';
import FooterUser from '../common/footer';
import api from '../../../utils/api';
import { Link } from 'react-router-dom';
import Pagination from 'components/pagination/pagination';
import Layout from 'layouts/user';

export default function ProblemPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [difficulty, setDifficulty] = useState({
    easy: false,
    medium: false,
    hard: false,
  });
  const [status, setStatus] = useState({
    unsolved: false,
    solved: false,
    attempted: false,
  });
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const response = await api.get('/problem/all', {
          params: {
            Page: currentPage,
            PageSize: pageSize,
            published: true,
          },
        });
        setProblems(response.data.data);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [currentPage, pageSize]);

  return (
    <Layout>
      <Box>
        <Container maxW="7xl" py={{ base: 12, md: 12 }} px={{ base: 4, md: 8 }}>
          <Heading textAlign="center" mb={10} color="gray.700">
            DANH SÁCH BÀI TẬP
          </Heading>

          <Grid
            templateColumns={{ base: '1fr', md: '7fr 3fr' }}
            gap={6}
            alignItems="start"
          >
            {loading && (
              <Box
                w="full"
                display="flex"
                flexDirection="column"
                bg="white"
                boxShadow="md"
                borderRadius="md"
              >
                <Flex justify="center" align="center" minH="365px">
                  <Spinner size="xl" color="blue.500" />
                </Flex>
              </Box>
            )}

            {!loading && (
              <Stack spacing={6} w="full">
                {problems.map((problem) => (
                  <Card
                    key={problem.problemId}
                    borderRadius="lg"
                    boxShadow="md"
                    p={4}
                    minH="150px"
                  >
                    <CardBody>
                      <Flex justify="space-between" align="center">
                        <Stack spacing={3} flex="1">
                          <Heading size="lg">{problem.problemName}</Heading>
                          <Wrap>
                            {problem.selectedCategoryNames.map(
                              (category, index) => (
                                <WrapItem key={index}>
                                  <Badge colorScheme="purple" fontSize="0.8rem">
                                    {category}
                                  </Badge>
                                </WrapItem>
                              ),
                            )}
                          </Wrap>
                          <Box
                            color="gray.600"
                            fontSize="md"
                            dangerouslySetInnerHTML={{
                              __html: problem.problemContent,
                            }}
                          />
                        </Stack>
                        <Flex align="center" ml={4}>
                          <Link to={`/problem/${problem.problemID}`}>
                            <Button
                              colorScheme="blue"
                              size="md"
                              mr={2}
                              borderRadius="10"
                            >
                              Giải bài tập
                            </Button>
                          </Link>
                          <IconButton
                            aria-label="Yêu thích"
                            icon={<IoMdHeartEmpty size={24} color="red" />}
                            variant="ghost"
                            bg="white"
                          />
                        </Flex>
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
                {!loading && problems.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                  />
                )}
              </Stack>
            )}

            <Box borderRadius="lg" boxShadow="md" p={4} bg="gray.100">
              <Stack spacing={3}>
                <Text fontWeight="bold" color="gray.600" fontSize="lg">
                  Độ khó
                </Text>
                <Checkbox
                  isChecked={difficulty.easy}
                  onChange={(e) =>
                    setDifficulty({ ...difficulty, easy: e.target.checked })
                  }
                >
                  Dễ
                </Checkbox>
                <Checkbox
                  isChecked={difficulty.medium}
                  onChange={(e) =>
                    setDifficulty({ ...difficulty, medium: e.target.checked })
                  }
                >
                  Trung bình
                </Checkbox>
                <Checkbox
                  isChecked={difficulty.hard}
                  onChange={(e) =>
                    setDifficulty({ ...difficulty, hard: e.target.checked })
                  }
                >
                  Khó
                </Checkbox>
                <Divider my={4} />
                <Text fontWeight="bold" color="gray.600">
                  Trạng thái
                </Text>
                <Checkbox
                  isChecked={status.unsolved}
                  onChange={(e) =>
                    setStatus({ ...status, unsolved: e.target.checked })
                  }
                >
                  Chưa giải
                </Checkbox>
                <Checkbox
                  isChecked={status.solved}
                  onChange={(e) =>
                    setStatus({ ...status, solved: e.target.checked })
                  }
                >
                  Đã giải
                </Checkbox>
                <Checkbox
                  isChecked={status.attempted}
                  onChange={(e) =>
                    setStatus({ ...status, attempted: e.target.checked })
                  }
                >
                  Đã thử
                </Checkbox>
                <Checkbox
                  colorScheme="blue"
                  isChecked={showFavorites}
                  onChange={(e) => setShowFavorites(e.target.checked)}
                >
                  Chỉ hiển thị bài tập yêu thích
                </Checkbox>
              </Stack>
            </Box>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
}
