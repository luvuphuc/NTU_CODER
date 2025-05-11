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
} from '@chakra-ui/react';
import { BiUpvote } from 'react-icons/bi';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { BsThreeDots } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import api from 'utils/api';
import { AiOutlineComment } from 'react-icons/ai';
import LayoutUser from 'layouts/user';
import PostInput from './components/PostInput';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment-timezone';
import PostModal from './components/PostModal';
import PinHomeBlog from './components/PinHomeBlog';
import { formatTimeFromNow } from 'utils/formatTime';
const MotionBox = motion(Box);

const PostCard = ({ post, onEdit }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const contentLimit = 200;

  const {
    title,
    content = 'Không có nội dung',
    countComment: comments = 0,
    blogDate,
    coderName: author,
    coderAvatar: avatar,
  } = post;

  const formattedTime = formatTimeFromNow(blogDate);

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
              <Text fontSize="15px" fontWeight="medium" color="gray.800">
                {author || 'Anonymous'}
              </Text>
              <HStack spacing={1} color="gray.500">
                <Box w="4px" h="4px" bg="gray.500" borderRadius="full" />
                <Text fontSize="13px">{formattedTime}</Text>
              </HStack>
            </VStack>
          </Flex>

          <Menu placement="bottom-end" autoSelect={false}>
            <MenuButton
              as={Button}
              variant="ghost"
              size="sm"
              _hover={{ bg: 'gray.100' }}
              p={1.5}
            >
              <BsThreeDots size="18px" />
            </MenuButton>

            <MenuList minW="240px" py={2} borderRadius="md" boxShadow="lg">
              <MenuItem
                icon={<EditIcon boxSize={4} />}
                fontSize="15px"
                py={2}
                onClick={onEdit}
              >
                Chỉnh sửa bài viết
              </MenuItem>

              <Divider my={1} mx={3} borderColor="gray.200" />

              <MenuItem
                icon={<DeleteIcon boxSize={4} />}
                fontSize="15px"
                py={2}
                color="red.500"
                onClick={() => {
                  // TODO: Delete handler
                }}
              >
                Xóa bài viết
              </MenuItem>
            </MenuList>
          </Menu>
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
          <HStack cursor="pointer" onClick={() => setIsModalOpen(true)}>
            <Icon as={AiOutlineComment} />
            <Text>{comments}</Text>
          </HStack>
        </HStack>
      </Box>

      {/* Modal */}
      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        post={post}
      />
    </>
  );
};

const BlogIndex = () => {
  const [posts, setPosts] = useState([]);

  const fetchBlogs = async () => {
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
              <PostInput onPostSuccess={fetchBlogs} />
              <Divider borderWidth="1.5px" />
              <Heading size="lg" mb={2} color="gray.700">
                Bài đăng mới nhất
              </Heading>
              <AnimatePresence initial={false}>
                {posts.map((post) => (
                  <MotionBox
                    key={post.blogID}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    w="100%"
                  >
                    <PostCard post={post} />
                  </MotionBox>
                ))}
              </AnimatePresence>
            </VStack>
          </Box>

          {/* Sidebar Section */}
          <Box flex="3">
            <PinHomeBlog />
          </Box>
        </Flex>
      </Box>
    </LayoutUser>
  );
};

export default BlogIndex;
