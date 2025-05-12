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
} from '@chakra-ui/react';
import { BiUpvote } from 'react-icons/bi';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { BsThreeDots } from 'react-icons/bs';
import { useEffect, useState, useRef } from 'react';
import api from 'utils/api';
import { AiOutlineComment } from 'react-icons/ai';
import LayoutUser from 'layouts/user';
import PostInput from './components/PostInput';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment-timezone';
import PostModal from './components/PostModal';
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
                _hover={{
                  textDecoration: 'underline',
                }}
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
              <MenuButton
                as={Button}
                variant="ghost"
                size="sm"
                _hover={{ bg: 'gray.100' }}
                _active={{ bg: 'gray.200' }}
                p={1.5}
                borderRadius="full"
              >
                <BsThreeDots size="18px" />
              </MenuButton>

              <MenuList
                minW="200px"
                py={2}
                px={1}
                borderRadius="lg"
                boxShadow="0px 8px 24px rgba(0, 0, 0, 0.1)"
                bg="white"
              >
                <MenuItem
                  icon={<EditIcon boxSize={4} color="blue.500" />}
                  fontSize="15px"
                  py={2}
                  px={3}
                  borderRadius="md"
                  _hover={{ bg: 'gray.200' }}
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsEditing(true);
                  }}
                >
                  Chỉnh sửa bài viết
                </MenuItem>

                <MenuItem
                  icon={<DeleteIcon boxSize={4} color="red.500" />}
                  fontSize="15px"
                  py={2}
                  px={3}
                  borderRadius="md"
                  _hover={{ bg: 'red.50' }}
                  color="red.500"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                >
                  Xóa bài viết
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>

        <Heading size="md" mb={2} color="gray.800">
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
            transition="color 0.2s"
          >
            <Icon as={AiOutlineComment} />
            <Text>{comments} người bình luận</Text>
          </HStack>
        </HStack>
      </Box>
      {isModalOpen && (
        <PostModal
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
      )}{' '}
      <AlertDialog
        isOpen={isDeleteConfirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteConfirmOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xác nhận xóa
            </AlertDialogHeader>

            <AlertDialogBody>
              Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không
              thể hoàn tác.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsDeleteConfirmOpen(false)}
                borderRadius="md"
              >
                Hủy
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  handleDeleteClick();
                }}
                borderRadius="md"
                ml={3}
              >
                Xóa
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

  const openPostModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closePostModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/Blog/all', {
        params: {
          sortField: 'blogDate',
          ascending: false,
          published: true,
        },
      });
      setPosts(res.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <LayoutUser>
      <Box bg="gray.50" minH="100vh" py={10}>
        <Flex maxW="1200px" mx="auto" gap={8}>
          {/* Posts Section */}
          <Box flex="7">
            <VStack spacing={6} w="100%">
              <PostInput onPostSuccess={fetchBlogs} isLoading={isLoading} />
              <Divider borderWidth="1.5px" />
              <Heading size="lg" mb={2} color="gray.700">
                Bài đăng mới nhất
              </Heading>
              <AnimatePresence initial={false}>
                {isLoading
                  ? Array.from({ length: 3 }).map((_, idx) => (
                      <Box
                        key={idx}
                        w="100%"
                        p={6}
                        bg="white"
                        rounded="2xl"
                        shadow="sm"
                        transition="all 0.2s"
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
                        <PostCard post={post} onEdit={fetchBlogs} />
                      </MotionBox>
                    ))}
              </AnimatePresence>
            </VStack>
          </Box>

          {/* Sidebar Section */}
          <Box flex="3">
            <PinHomeBlog onPostClick={openPostModal} />
            {selectedPost && (
              <PostModal
                isOpen={isModalOpen}
                onClose={closePostModal}
                post={selectedPost}
                isEditing={false}
                setIsEditing={() => {}}
                onUpdateSuccess={fetchBlogs}
              />
            )}
          </Box>
        </Flex>
      </Box>
    </LayoutUser>
  );
};

export default BlogIndex;
