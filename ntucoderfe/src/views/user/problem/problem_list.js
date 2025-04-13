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
  IconButton,
  Spinner,
  Badge,
  Wrap,
  WrapItem,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  ModalContent,
  Divider,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { IoMdHeartEmpty } from 'react-icons/io';
import { AiFillHeart } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import Pagination from 'components/pagination/pagination';
import Layout from 'layouts/user';
import Cookies from 'js-cookie';
import Multiselect from 'multiselect-react-dropdown';
export default function ProblemPage() {
  const [state, setState] = useState({
    problems: [],
    favouriteIds: new Set(),
    loading: true,
    currentPage: 1,
    pageSize: 5,
    totalPages: 1,
    totalRows: 0,
    categories: [],
    selectedCategories: [],
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, favouritesRes] = await Promise.all([
          api.get('/Category/all'),
          Cookies.get('token') ? api.get('/Favourite/list') : { data: [] },
        ]);

        setState((prev) => ({
          ...prev,
          categories: categoriesRes.data.data,
          favouriteIds: new Set(favouritesRes.data.map((f) => f.problemID)),
        }));
      } catch (error) {
        console.error('Error fetching initial data:', error);
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
          },
          paramsSerializer: { indexes: null },
        });

        setState((prev) => ({
          ...prev,
          problems: problemsRes.data.data,
          totalPages: problemsRes.data.totalPages || 1,
          totalRows: problemsRes.data.totalCount || 0,
          loading: false,
        }));
      } catch (error) {
        console.error('Error fetching problems:', error);
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchProblems();
  }, [state.selectedCategories, state.currentPage, state.pageSize]);

  const handleToggleFavorite = async (problemID) => {
    if (!Cookies.get('token')) return onOpen();

    try {
      const res = await api.post('/Favourite/toggle', { problemID });
      const updatedSet = new Set(state.favouriteIds);
      res.data.isFavourite
        ? updatedSet.add(problemID)
        : updatedSet.delete(problemID);

      setState((prev) => ({ ...prev, favouriteIds: updatedSet }));
      toast({
        title: res.data.isFavourite ? 'Đã thêm yêu thích' : 'Đã bỏ yêu thích',
        description: res.data.message,
        status: 'success',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description:
          error.response?.data?.message || 'Lỗi khi thao tác với yêu thích.',
        status: 'error',
        position: 'top-right',
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

    return (
      <Card
        key={problem.problemID}
        borderRadius="lg"
        boxShadow="md"
        minH="150px"
        overflow="hidden"
        _hover={{ bg: '#ebebf3', cursor: 'pointer' }}
      >
        <Link
          to={`/problem/${problem.problemID}`}
          style={{ textDecoration: 'none' }}
        >
          <CardBody _hover={{ bg: '#ebebf3' }}>
            <Flex justify="space-between" align="center">
              <Stack spacing={3} flex="1">
                <Heading size="lg" color="gray.700" noOfLines={1}>
                  {problem.problemName}
                </Heading>
                <Wrap>
                  {problem.selectedCategoryNames.map((category, index) => (
                    <WrapItem key={index}>
                      <Badge colorScheme="purple" fontSize="0.8rem">
                        {category}
                      </Badge>
                    </WrapItem>
                  ))}
                </Wrap>
                <Text
                  color="gray.600"
                  fontSize="md"
                  noOfLines={2}
                  dangerouslySetInnerHTML={{ __html: problem.problemContent }}
                />
              </Stack>
              <IconButton
                icon={
                  isFavourited ? (
                    <AiFillHeart size={26} color="red" />
                  ) : (
                    <IoMdHeartEmpty size={24} color="gray" />
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
            </Flex>
          </CardBody>
        </Link>
      </Card>
    );
  };

  return (
    <Layout>
      <Container maxW="7xl" py={{ base: 12, md: 12 }} px={{ base: 4, md: 8 }}>
        <Heading textAlign="center" mb={10} color="gray.700">
          DANH SÁCH BÀI TẬP
        </Heading>

        <Grid
          templateColumns={{ base: '1fr', md: '7fr 3fr' }}
          gap={6}
          alignItems="start"
        >
          {state.loading ? (
            <Flex
              justify="center"
              align="center"
              minH="365px"
              bg="white"
              boxShadow="md"
              borderRadius="md"
            >
              <Spinner size="xl" color="blue.500" />
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

          <Box
            borderRadius="xl"
            boxShadow="lg"
            bg="white"
            p={5}
            border="1px solid"
            borderColor="gray.200"
          >
            <Stack spacing={4}>
              <Heading size="md" color="gray.700">
                Bộ lọc
              </Heading>

              <Box>
                <Multiselect
                  options={state.categories.map((cat) => ({
                    name: cat.catName,
                    id: cat.categoryID,
                  }))}
                  showCheckbox
                  selectedValues={state.selectedCategories}
                  onSelect={handleCategoryChange}
                  onRemove={handleCategoryChange}
                  displayValue="name"
                  placeholder="Chọn thể loại"
                  style={{
                    chips: {
                      background: '#805AD5',
                    },
                    searchBox: {
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E0',
                    },
                    multiselectContainer: {
                      color: 'black',
                    },
                  }}
                />
              </Box>

              {state.selectedCategories.length > 0 && (
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => handleCategoryChange([])}
                >
                  Xóa lọc
                </Button>
              )}
            </Stack>
          </Box>
        </Grid>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Yêu cầu đăng nhập</ModalHeader>
          <ModalBody>
            <Text>Bạn cần đăng nhập để thực hiện hành động.</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              borderRadius="md"
              onClick={() => navigate('/login')}
            >
              Đăng nhập
            </Button>
            <Button borderRadius="md" onClick={onClose}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
}
