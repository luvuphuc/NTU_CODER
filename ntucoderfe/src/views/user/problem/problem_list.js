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
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  ModalContent,
  useToast,
} from '@chakra-ui/react';
import { IoMdHeartEmpty } from 'react-icons/io';
import { AiFillHeart } from 'react-icons/ai';
import api from '../../../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from 'components/pagination/pagination';
import Layout from 'layouts/user';
import Cookies from 'js-cookie';

export default function ProblemPage() {
  const [problems, setProblems] = useState([]);
  const [favouriteIds, setFavouriteIds] = useState(new Set());
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

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
        setTotalRows(response.data.totalCount || 0);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFavourites = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) return;
        const res = await api.get('/Favourite/list');
        const ids = new Set(res.data.map((f) => f.problemID));
        setFavouriteIds(ids);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách yêu thích:', error);
      }
    };

    fetchProblems();
    fetchFavourites();
  }, [currentPage, pageSize]);

  const handleToggleFavorite = async (problemID) => {
    const token = Cookies.get('token');

    if (!token) {
      onOpen();
      return;
    }

    try {
      const response = await api.post('/Favourite/toggle', { problemID });
      const { isFavourite, message } = response.data;

      const updatedSet = new Set(favouriteIds);
      if (isFavourite) {
        updatedSet.add(problemID);
      } else {
        updatedSet.delete(problemID);
      }
      setFavouriteIds(updatedSet);

      toast({
        title: isFavourite ? 'Đã thêm yêu thích' : 'Đã bỏ yêu thích',
        description: message,
        status: 'success',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Lỗi khi thao tác với yêu thích.';

      toast({
        title: 'Lỗi',
        description: errorMessage,
        status: 'error',
        position: 'top-right',
        duration: 5000,
        isClosable: true,
      });
    }
  };

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
            {loading ? (
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
            ) : (
              <Stack spacing={6} w="full">
                {problems.map((problem) => {
                  const isFavourited = favouriteIds.has(problem.problemID);
                  return (
                    <Card
                      key={problem.problemId}
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
                                {problem.selectedCategoryNames.map(
                                  (category, index) => (
                                    <WrapItem key={index}>
                                      <Badge
                                        colorScheme="purple"
                                        fontSize="0.8rem"
                                      >
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
                                noOfLines={2}
                              />
                            </Stack>

                            <Flex align="center" ml={4}>
                              <IconButton
                                aria-label="Yêu thích"
                                icon={
                                  isFavourited ? (
                                    <AiFillHeart size={26} color="red" />
                                  ) : (
                                    <IoMdHeartEmpty size={24} color="gray" />
                                  )
                                }
                                variant="ghost"
                                transition="transform 0.2s ease"
                                _hover={{
                                  transform: 'scale(1.2)',
                                  bg: 'transparent',
                                }}
                                onClick={(e) => {
                                  e.preventDefault(); // Ngăn click lan lên Link
                                  handleToggleFavorite(problem.problemID);
                                }}
                              />
                            </Flex>
                          </Flex>
                        </CardBody>
                      </Link>
                    </Card>
                  );
                })}

                {problems.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
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
