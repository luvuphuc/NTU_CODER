import {
  Box,
  Flex,
  Avatar,
  Text,
  Heading,
  HStack,
  Icon,
  Divider,
  VStack,
  Link,
  Menu,
  MenuButton,
  Button,
  Spinner,
  MenuList,
  MenuItem,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  Skeleton,
  SkeletonText,
  Tooltip,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { BsThreeDots } from 'react-icons/bs';
import { useEffect, useState, useRef } from 'react';
import api from 'config/api';
import { AiOutlineComment } from 'react-icons/ai';
import LayoutUser from 'layouts/user';
import BlogInput from './components/BlogInput';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronsUp } from 'react-icons/fi';
import BlogModal from './components/BlogModal';
import PinHomeBlog from './components/PinHomeBlog';
import { formatTimeFromNow } from 'utils/formatTime';
import CustomToast from 'components/toast/CustomToast';
import { useAuth } from 'contexts/AuthContext';

const MotionBox = motion(Box);

const PostCard = ({ post, onEdit }) => {
  const { coder } = useAuth();
  const [showFullContent, setShowFullContent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const contentLimit = 200;
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const cancelRef = useRef();
  const toast = useToast();

  const {
    title,
    content = 'Không có nội dung',
    countComment: comments = 0,
    blogDate,
    coderID,
    coderName: author,
    coderAvatar: avatar,
  } = post;

  const formattedTime = formatTimeFromNow(blogDate);

  const handleDeleteClick = async () => {
    try {
      const response = await api.delete(`/Blog/${post.blogID}`);
      if (response.status === 200) {
        toast({
          render: () => (
            <CustomToast success={true} messages="Xóa bài thành công!" />
          ),
          position: 'top',
          duration: 3000,
          isClosable: true,
        });
        onEdit?.();
      } else {
        throw new Error('Có lỗi xảy ra khi xóa');
      }
    } catch (error) {
      toast({
        render: () => (
          <CustomToast success={false} messages="Có lỗi xảy ra khi xóa!" />
        ),
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const truncatedContent =
    content.length > contentLimit
      ? content.slice(0, contentLimit) + '...'
      : content;

  const shouldTruncate = content.length > contentLimit;

  return (
    <>
      <Box
        w="100%"
        p={6}
        bg="white"
        rounded="2xl"
        shadow="sm"
        _hover={{ shadow: 'md' }}
        transition="all 0.2s"
      >
        <Flex align="center" mb={3} justify="space-between">
          <Flex align="center">
            <Avatar
              width="40px"
              height="40px"
              mr={2}
              src={avatar || undefined}
              name={author}
            />
            <VStack align="start" spacing={0}>
              <Link
                href={`/user/${coderID}`}
                fontSize="15px"
                fontWeight="bold"
                color="gray.800"
                _hover={{ textDecoration: 'underline' }}
              >
                {author || 'Anonymous'}
              </Link>
              <HStack spacing={1} color="gray.500">
                <Box w="4px" h="4px" bg="gray.500" borderRadius="full" />
                <Text fontSize="13px">{formattedTime}</Text>
              </HStack>
            </VStack>
          </Flex>

          {(post.coderID === coder?.coderID ||
            coder?.roleID === 1 ||
            coder?.roleID === 3) && (
            <Menu placement="bottom-end" autoSelect={false}>
              <Tooltip label="Tùy chọn" hasArrow placement="top">
                <MenuButton
                  as={Button}
                  variant="ghost"
                  size="sm"
                  p={1.5}
                  borderRadius="full"
                >
                  <BsThreeDots size="18px" />
                </MenuButton>
              </Tooltip>
              <MenuList minW="200px" py={2} px={1} borderRadius="lg">
                <MenuItem
                  icon={<EditIcon boxSize={4} color="blue.500" />}
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsEditing(true);
                  }}
                >
                  Chỉnh sửa bài viết
                </MenuItem>
                <MenuItem
                  icon={<DeleteIcon boxSize={4} color="red.500" />}
                  color="red.500"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                >
                  Xóa bài viết
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>

        <Heading size="md" mb={2}>
          {title}
        </Heading>

        <Box p={2}>
          <Box
            dangerouslySetInnerHTML={{
              __html: showFullContent ? content : truncatedContent,
            }}
          />
          {shouldTruncate && (
            <Text
              mt={2}
              fontWeight="bold"
              fontSize="sm"
              cursor="pointer"
              onClick={() => setShowFullContent(!showFullContent)}
            >
              {showFullContent ? 'Thu gọn' : 'Xem thêm'}
            </Text>
          )}
        </Box>

        <HStack spacing={5} mt={4} color="gray.400" fontSize="sm">
          <HStack
            cursor="pointer"
            onClick={() => setIsModalOpen(true)}
            _hover={{ color: 'blue.500' }}
          >
            <Icon as={AiOutlineComment} />
            <Text>{comments} người bình luận</Text>
          </HStack>
        </HStack>
      </Box>

      {isModalOpen && (
        <BlogModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setIsEditing(false);
          }}
          post={post}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onUpdateSuccess={onEdit}
        />
      )}

      <AlertDialog
        isOpen={isDeleteConfirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteConfirmOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Xác nhận xóa</AlertDialogHeader>
            <AlertDialogBody>
              Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không
              thể hoàn tác.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                colorScheme="red"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  handleDeleteClick();
                }}
                mr={3}
              >
                Xóa
              </Button>
              <Button
                ref={cancelRef}
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Hủy
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

const BlogIndex = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 5;

  const openBlogModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeBlogModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  const fetchBlogs = async (currentPage = 1) => {
    try {
      const res = await api.get('/Blog/all', {
        params: {
          sortField: 'blogDate',
          ascending: false,
          published: true,
          page: currentPage,
          pageSize,
        },
      });

      const newPosts = res.data.data;
      if (newPosts.length < pageSize) setHasMore(false);

      setPosts((prev) =>
        currentPage === 1 ? newPosts : [...prev, ...newPosts],
      );
    } catch (err) {
      console.error('Fetch blogs failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1);
  }, []);

  useEffect(() => {
    if (page === 1) return;
    fetchBlogs(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
      if (nearBottom && !isLoading && hasMore) {
        setIsLoading(true);
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore]);

  return (
    <LayoutUser>
      <Box bg="gray.50" minH="100vh" py={10}>
        <Flex maxW="1200px" mx="auto" gap={8}>
          <Box flex="7">
            <VStack spacing={6}>
              <BlogInput
                onPostSuccess={() => fetchBlogs(1)}
                isLoading={isLoading}
              />
              <Divider />
              <Heading size="lg" mb={2} color="gray.700">
                Bài đăng mới nhất
              </Heading>
              <AnimatePresence initial={false}>
                {isLoading && posts.length === 0
                  ? Array.from({ length: 3 }).map((_, idx) => (
                      <Box
                        key={idx}
                        w="100%"
                        p={6}
                        bg="white"
                        rounded="2xl"
                        shadow="sm"
                      >
                        <Flex align="center" mb={4}>
                          <Skeleton circle height="40px" width="40px" mr={3} />
                          <Box flex="1">
                            <Skeleton height="14px" width="120px" mb={2} />
                            <Skeleton height="12px" width="80px" />
                          </Box>
                        </Flex>
                        <Skeleton height="20px" mb={3} width="60%" />
                        <SkeletonText mt="4" noOfLines={4} spacing="3" />
                      </Box>
                    ))
                  : posts.map((post) => (
                      <MotionBox
                        key={post.blogID}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        w="100%"
                      >
                        <PostCard post={post} onEdit={() => fetchBlogs(1)} />
                      </MotionBox>
                    ))}
              </AnimatePresence>
              {!isLoading && posts.length === 0 && (
                <Text color="gray.500">Không có bài viết nào.</Text>
              )}
              {isLoading && page > 1 && (
                <Flex justify="center" mt={4}>
                  <Spinner size="lg" color="blue.500" />
                </Flex>
              )}
            </VStack>
          </Box>
          <Box flex="3">
            <PinHomeBlog onPostClick={openBlogModal} />
            {selectedPost && (
              <BlogModal
                isOpen={isModalOpen}
                onClose={closeBlogModal}
                post={selectedPost}
                isEditing={false}
                setIsEditing={() => {}}
                onUpdateSuccess={() => fetchBlogs(1)}
              />
            )}
          </Box>
        </Flex>
      </Box>
      <Button
        position="fixed"
        bottom="30px"
        right="30px"
        bg="blue.500"
        color="white"
        _hover={{ bg: 'blue.600', transform: 'scale(1.05)' }}
        _active={{ bg: 'blue.700' }}
        borderRadius="full"
        w="60px"
        h="60px"
        boxShadow="lg"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Icon as={FiChevronsUp} boxSize={7} />
      </Button>
    </LayoutUser>
  );
};

export default BlogIndex;
