import React, { useState, useEffect, useRef } from 'react';
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
  IconButton,
  Badge,
  Wrap,
  WrapItem,
  Skeleton,
  SkeletonText,
  Divider,
  Checkbox,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { IoMdHeartEmpty } from 'react-icons/io';
import { AiFillHeart } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import api from '../../../config/api';
import Pagination from 'components/pagination/pagination';
import Layout from 'layouts/user';
import Cookies from 'js-cookie';
import Multiselect from 'multiselect-react-dropdown';
import { RiResetLeftFill } from 'react-icons/ri';
import AuthToast from 'views/auth/auth_toast';
import { RiUser3Fill } from 'react-icons/ri';
import LeaderboardProblem from './components/LeaderboardProblem';
import CustomToast from 'components/toast/CustomToast';
export default function ProblemPage() {
  const [state, setState] = useState({
    problems: [],
    favouriteIds: new Set(),
    solvedProblemIds: new Set(),
    loading: true,
    currentPage: 1,
    pageSize: 5,
    totalPages: 1,
    totalRows: 0,
    categories: [],
    selectedCategories: [],
    filterByFavourite: false,
    solvedProblem: null,
  });
  const toast = useToast();
  const navigate = useNavigate();
  const favouriteIdsRef = useRef(new Set());
  const fetchSolvedCount = async (problemID) => {
    try {
      const res = await api.get(`/Problem/solved/${problemID}`);
      return res.data.count;
    } catch (error) {
      console.error(`Error:${problemID}`, error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const categoriesRes = await api.get('/Category/all');
        setState((prev) => ({
          ...prev,
          categories: categoriesRes.data.data || [],
        }));
      } catch (error) {
        console.error('Error:', error);
        setState((prev) => ({ ...prev, categories: [] }));
      }

      if (Cookies.get('token')) {
        try {
          const favouritesRes = await api.get('/Favourite/list');
          const favouriteSet = new Set(
            Array.isArray(favouritesRes.data)
              ? favouritesRes.data.map((f) => f.problemID)
              : [],
          );
          favouriteIdsRef.current = favouriteSet;
          setState((prev) => ({
            ...prev,
            favouriteIds: favouriteSet,
          }));
        } catch (error) {
          console.error('Error:', error);
          setState((prev) => ({ ...prev, favouriteIds: new Set() }));
        }
      } else {
        setState((prev) => ({ ...prev, favouriteIds: new Set() }));
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));

        const problemsRes = await api.get('/Problem/all', {
          params: {
            Page: state.currentPage,
            PageSize: state.pageSize,
            published: true,
            ...(state.selectedCategories.length > 0 && {
              catList: state.selectedCategories.map((cat) => cat.id),
            }),
            ...(state.solvedProblem !== null && {
              isSolved: state.solvedProblem,
            }),
            sortField: 'ProblemID',
            ascending: false,
          },
          paramsSerializer: { indexes: null },
        });
        if (state.filterByFavourite) {
          problemsRes.data.data = problemsRes.data.data.filter((p) =>
            favouriteIdsRef.current.has(p.problemID),
          );
          problemsRes.data.totalCount = problemsRes.data.data.length;
          problemsRes.data.totalPages = Math.ceil(
            problemsRes.data.totalCount / state.pageSize,
          );
        }
        const problemsWithSolvedCount = await Promise.all(
          problemsRes.data.data.map(async (problem) => {
            const solvedCount = await fetchSolvedCount(problem.problemID);
            return { ...problem, solvedCount };
          }),
        );
        setState((prev) => ({
          ...prev,
          problems: problemsWithSolvedCount,
          totalPages: problemsRes.data.totalPages || 1,
          totalRows: problemsRes.data.totalCount || 0,
          loading: false,
        }));
      } catch (error) {
        console.error('Error:', error);
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchProblems();
  }, [
    state.selectedCategories,
    state.currentPage,
    state.pageSize,
    state.filterByFavourite,
    state.solvedProblem,
  ]);

  const handleToggleFavorite = async (problemID) => {
    if (!Cookies.get('token')) {
      toast({
        position: 'top',
        duration: 3000,
        isClosable: true,
        render: () => <AuthToast />,
      });
      return;
    }

    try {
      const res = await api.post('/Favourite/toggle', { problemID });
      const updatedSet = new Set(favouriteIdsRef.current);
      res.data.isFavourite
        ? updatedSet.add(problemID)
        : updatedSet.delete(problemID);
      favouriteIdsRef.current = updatedSet;
      setState((prev) => ({ ...prev, favouriteIds: updatedSet }));
      toast({
        render: () => (
          <CustomToast
            success={true}
            messages={
              res.data.isFavourite
                ? 'Đã thêm vào yêu thích!'
                : 'Đã xóa khỏi yêu thích!'
            }
          />
        ),
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        render: (
          <CustomToast
            success={false}
            messages={error.response?.data?.message}
          />
        ),
        position: 'top',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCategoryChange = (selectedList) => {
    setState((prev) => ({
      ...prev,
      selectedCategories: [...selectedList],
      currentPage: 1,
    }));
  };
  const renderProblemCard = (problem) => {
    const isFavourited = state.favouriteIds.has(problem.problemID);
    const handleCardClick = (e) => {
      e.preventDefault();
      if (!Cookies.get('token')) {
        toast({
          position: 'top',
          duration: 3000,
          isClosable: true,
          render: () => <AuthToast />,
        });
      } else {
        navigate(`/problem/${problem.problemID}`);
      }
    };
    return (
      <Box position="relative" key={problem.problemID}>
        <Card
          borderRadius="lg"
          boxShadow="md"
          minH={{ base: '120px', md: '150px' }}
          overflow="hidden"
          _hover={{ bg: '#ebebf3', cursor: 'pointer' }}
          onClick={handleCardClick}
        >
          <CardBody _hover={{ bg: '#ebebf3' }}>
            <Flex direction="column" justify="space-between" height="100%">
              <Flex justify="space-between" align="start">
                <Heading
                  size={{ base: 'md', md: 'lg' }}
                  color="gray.700"
                  noOfLines={1}
                  maxW={{ base: '60%', md: '70%' }}
                >
                  {problem.problemName}
                </Heading>
                <Flex align="center" gap={1}>
                  <Text color="green.600" fontSize="sm">
                    {problem.solvedCount ?? 0}
                  </Text>
                  <RiUser3Fill color="#2F855A" />
                </Flex>
              </Flex>

              <Wrap mt={2}>
                {problem.selectedCategoryNames.map((category, index) => (
                  <WrapItem key={index}>
                    <Badge
                      colorScheme="purple"
                      fontSize={{ base: '0.75rem', md: '0.8rem' }}
                    >
                      {category}
                    </Badge>
                  </WrapItem>
                ))}
              </Wrap>

              <Text
                mt={2}
                color="gray.600"
                fontSize={{ base: 'sm', md: 'md' }}
                noOfLines={2}
                dangerouslySetInnerHTML={{ __html: problem.problemContent }}
              />
            </Flex>
          </CardBody>
        </Card>

        <Box
          position="absolute"
          right={{ base: '8px', md: '16px' }}
          top="50%"
          transform="translateY(-50%)"
          zIndex={1}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <IconButton
            icon={
              isFavourited ? (
                <AiFillHeart size={24} color="red" />
              ) : (
                <IoMdHeartEmpty size={22} color="gray" />
              )
            }
            aria-label="Yêu thích"
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              handleToggleFavorite(problem.problemID);
            }}
            _hover={{ transform: 'scale(1.2)', bg: 'transparent' }}
            transition="transform 0.2s ease"
          />
        </Box>
      </Box>
    );
  };

  return (
    <Layout>
      <Container
        maxW={{ base: 'sm', md: '7xl' }}
        px={{ base: 4, md: 8 }}
        py={{ base: 6, md: 12 }}
      >
        <Heading textAlign="center" mb={10} color="gray.700">
          DANH SÁCH BÀI TẬP
        </Heading>

        <Grid
          templateColumns={{ base: '1fr', lg: '7fr 3fr' }}
          gap={{ base: 4, md: 6 }}
          alignItems="start"
        >
          {state.loading ? (
            <Stack spacing={6} w="full">
              {[...Array(5)].map((_, i) => (
                <Box
                  key={i}
                  bg="white"
                  boxShadow="md"
                  borderRadius="md"
                  p={6}
                  minH="120px"
                >
                  <Skeleton height="24px" mb={4} />
                  <SkeletonText noOfLines={3} spacing={3} />
                </Box>
              ))}
            </Stack>
          ) : state.problems.length === 0 ? (
            <Flex
              direction="column"
              justify="center"
              align="center"
              minH="365px"
              bg="white"
              boxShadow="md"
              borderRadius="md"
              p={8}
            >
              <Box boxSize="120px" mb={4}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076507.png"
                  alt="No data"
                  style={{ width: '100%', height: 'auto' }}
                />
              </Box>
              <Heading size="md" color="gray.600">
                Không có dữ liệu
              </Heading>
            </Flex>
          ) : (
            <Stack spacing={6} w="full">
              {state.problems.map(renderProblemCard)}
              {state.problems.length > 0 && (
                <Pagination
                  currentPage={state.currentPage}
                  totalPages={state.totalPages}
                  onPageChange={(page) =>
                    setState((prev) => ({ ...prev, currentPage: page }))
                  }
                  onPageSizeChange={(size) =>
                    setState((prev) => ({ ...prev, pageSize: size }))
                  }
                />
              )}
            </Stack>
          )}

          <Stack>
            <LeaderboardProblem />
            <Box
              borderRadius="xl"
              boxShadow="lg"
              bg="white"
              p={{ base: 4, md: 5 }}
              border="1px solid"
              borderColor="gray.200"
            >
              <Stack spacing={4}>
                <Flex justify="space-between" align="center">
                  <Text
                    fontSize="md"
                    fontWeight="semibold"
                    color="gray.500"
                    mb={2}
                  >
                    THỂ LOẠI
                  </Text>
                  {state.selectedCategories.length > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCategoryChange([])}
                      leftIcon={<RiResetLeftFill />}
                      color="black"
                    >
                      Tải lại
                    </Button>
                  )}
                </Flex>

                <Box mb={3}>
                  <Multiselect
                    options={state.categories.map((cat) => ({
                      name: cat.catName,
                      id: cat.categoryID,
                    }))}
                    showCheckbox
                    showArrow
                    selectedValues={state.selectedCategories}
                    onSelect={handleCategoryChange}
                    onRemove={handleCategoryChange}
                    displayValue="name"
                    placeholder="Chọn thể loại"
                    style={{
                      chips: {
                        background: '#0096fb',
                        borderRadius: '5px',
                        fontSize: '14px',
                        padding: '5px 10px',
                      },
                      searchBox: {
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        fontSize: '14px',
                      },
                      multiselectContainer: {
                        color: '#2D3748',
                      },
                      optionContainer: {
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                      },
                      option: {
                        padding: '10px 14px',
                      },
                    }}
                  />
                </Box>

                <Divider borderWidth="2px" borderColor="gray.200" />
                <Box>
                  <Text
                    fontSize="md"
                    fontWeight="semibold"
                    color="gray.500"
                    mb={2}
                  >
                    TRẠNG THÁI
                  </Text>
                  <Stack spacing={2}>
                    <Checkbox
                      isChecked={state.solvedProblem === true}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          solvedProblem: e.target.checked ? true : null,
                          currentPage: 1,
                        }))
                      }
                    >
                      Đã hoàn thành
                    </Checkbox>
                    <Checkbox
                      isChecked={state.solvedProblem === false}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          solvedProblem: e.target.checked ? false : null,
                          currentPage: 1,
                        }))
                      }
                    >
                      Chưa hoàn thành
                    </Checkbox>
                  </Stack>
                </Box>
                <Divider borderWidth="2px" borderColor="gray.200" />
                <Box>
                  <Text
                    fontSize="md"
                    fontWeight="semibold"
                    color="gray.500"
                    mb={2}
                  >
                    YÊU THÍCH
                  </Text>
                  <Checkbox
                    colorScheme="purple"
                    isChecked={state.filterByFavourite}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        filterByFavourite: e.target.checked,
                        currentPage: 1,
                      }))
                    }
                  >
                    Danh sách yêu thích
                  </Checkbox>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Grid>
      </Container>
    </Layout>
  );
}
