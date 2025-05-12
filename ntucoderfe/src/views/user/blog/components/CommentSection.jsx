import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  HStack,
  Text,
  VStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import api from 'utils/api';
import { BsThreeDots } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTimeFromNow } from 'utils/formatTime';
const MotionBox = motion(Box);

const CommentSection = ({ blogID, refreshKey }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingCommentID, setEditingCommentID] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  useEffect(() => {
    if (!blogID) return;

    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await api.get('/Comment/all', {
          params: {
            ascending: false,
            sortfield: 'commenttime',
            blogID,
          },
        });
        setComments(response.data?.data || []);
        setError('');
      } catch (err) {
        console.error('Lỗi khi tải bình luận:', err);
        setError('Không thể tải bình luận.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [blogID, refreshKey]);

  if (loading) {
    return (
      <VStack spacing={4} align="start" w="full">
        {[...Array(3)].map((_, i) => (
          <HStack key={i} align="start" spacing={3} w="100%">
            <SkeletonCircle boxSize="40px" />
            <Box flex="1">
              <Skeleton height="14px" width="120px" mb={2} />
              <SkeletonText noOfLines={2} spacing="2" skeletonHeight="10px" />
            </Box>
          </HStack>
        ))}
      </VStack>
    );
  }

  if (error) {
    return (
      <Text fontSize="sm" color="red.500">
        {error}
      </Text>
    );
  }

  if (!comments.length) {
    return (
      <Text fontSize="sm" color="gray.500">
        Chưa có bình luận nào.
      </Text>
    );
  }

  return (
    <VStack spacing={3} align="start">
      <AnimatePresence>
        {comments.map((cmt) => (
          <MotionBox
            key={cmt.commentID}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            w="100%"
          >
            <HStack align="start" spacing={3} justify="space-between">
              <Avatar
                width="40px"
                height="40px"
                name={cmt.coderName}
                src={cmt.coderAvatar}
              />
              <VStack align="start" w="full" spacing={1} position="relative">
                <HStack justify="space-between" w="full" align="center">
                  <Box
                    bg="#f2f4f7"
                    p={2}
                    rounded="xl"
                    maxW="100%"
                    w="fit-content"
                    whiteSpace="pre-wrap"
                    wordBreak="break-word"
                    pr={4}
                    flex="1"
                  >
                    <Text fontWeight="bold" fontSize=".8125rem">
                      {cmt.coderName}
                    </Text>
                    <Box
                      fontSize=".9375rem"
                      dangerouslySetInnerHTML={{ __html: cmt.content }}
                    />
                  </Box>

                  {/* Menu ba chấm */}
                  <Menu
                    placement="bottom-end"
                    justifyContent="center"
                    alignItem="center"
                    autoSelect={false}
                  >
                    <MenuButton
                      as={Box}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      p={1}
                      _hover={{ bg: 'gray.100' }}
                      borderRadius="full"
                      cursor="pointer"
                    >
                      <BsThreeDots size="16px" />
                    </MenuButton>

                    <MenuList
                      minW="160px"
                      py={2}
                      px={1}
                      borderRadius="lg"
                      boxShadow="md"
                    >
                      <MenuItem
                        fontSize="14px"
                        onClick={() => {
                          setEditingCommentID(cmt.commentID);
                          setEditedContent(cmt.content);
                        }}
                      >
                        Sửa bình luận
                      </MenuItem>
                      <MenuItem
                        fontSize="14px"
                        color="red.500"
                        _hover={{ bg: 'red.50' }}
                        onClick={() =>
                          console.log('Xóa bình luận', cmt.commentID)
                        }
                      >
                        Xóa bình luận
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
                <Text fontSize="13px" color="gray.500" pl={2}>
                  {formatTimeFromNow(cmt.commentTime)}
                </Text>
              </VStack>
            </HStack>
          </MotionBox>
        ))}
      </AnimatePresence>

      {loading && (
        <HStack align="start" spacing={3} w="100%">
          <SkeletonCircle boxSize="40px" />
          <Box flex="1">
            <Skeleton height="14px" width="120px" mb={2} />
            <SkeletonText noOfLines={2} spacing="2" skeletonHeight="10px" />
          </Box>
        </HStack>
      )}
    </VStack>
  );
};

export default CommentSection;
