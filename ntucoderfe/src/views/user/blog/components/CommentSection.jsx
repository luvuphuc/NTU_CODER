import { useEffect, useState, useRef } from 'react';
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
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Tooltip,
} from '@chakra-ui/react';
import api from 'utils/api';
import ReactQuill from 'react-quill';
import { BsThreeDots } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTimeFromNow } from 'utils/formatTime';
import { TbSend2 } from 'react-icons/tb';
import { useAuth } from 'contexts/AuthContext';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
const MotionBox = motion(Box);

const CommentSection = ({ blogID, refreshKey }) => {
  const { coder } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingCommentID, setEditingCommentID] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const cancelRef = useRef();
  const [commentToDelete, setCommentToDelete] = useState(null);
  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/Comment/all', {
        params: {
          ascending: false,
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
  const handleDeleteClick = async () => {
    if (!commentToDelete) return;
    try {
      await api.delete(`/Comment/${commentToDelete}`);
      setComments((prev) =>
        prev.filter((comment) => comment.commentID !== commentToDelete),
      );
      setCommentToDelete(null);
    } catch (error) {
      console.error('Lỗi khi xóa bình luận:', error);
    }
  };

  useEffect(() => {
    if (blogID) fetchComments();
  }, [blogID, refreshKey]);

  const handleUpdateComment = async (commentID) => {
    try {
      const response = await api.put(`/Comment/${commentID}`, {
        content: editedContent,
      });
      console.log(response.data);
      if (response.status === 200) {
        setComments((prev) =>
          prev.map((c) =>
            c.commentID === commentID
              ? {
                  ...c,
                  content: editedContent,
                  commentTime: response.data.commentTime,
                }
              : c,
          ),
        );

        setEditingCommentID(null);
        setEditedContent('');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật bình luận:', error);
    }
  };

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
    <VStack spacing={3} align="start" w="full">
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
            <HStack align="start" spacing={5} w="full">
              <Avatar
                width="40px"
                height="40px"
                name={cmt.coderName}
                src={cmt.coderAvatar}
              />
              {editingCommentID === cmt.commentID ? (
                <VStack align="start" spacing={1} w="full">
                  <Box bg="#f2f4f7" p={2} borderRadius="xl" w="full">
                    <Box
                      className="custom-quill"
                      sx={{
                        '.ql-container': {
                          border: 'none !important',
                          maxHeight: '300px',
                          overflowY: 'auto',
                          ...customScrollbarStyle,
                        },
                        '.ql-editor': {
                          outline: 'none !important',
                          padding: 0,
                          minHeight: '15px',
                        },
                      }}
                    >
                      <ReactQuill
                        value={editedContent}
                        onChange={setEditedContent}
                        placeholder={`Chỉnh sửa bình luận dưới tên ${cmt.coderName}...`}
                        theme="snow"
                        modules={{ toolbar: false }}
                      />
                    </Box>
                    <HStack spacing={1} justify="end">
                      <Button
                        size="sm"
                        isDisabled={
                          !editedContent.replace(/<(.|\n)*?>/g, '').trim()
                        }
                        variant="ghost"
                        p={2}
                        borderRadius="none"
                        _hover={{
                          borderRadius: 'full',
                          bg: 'gray.100',
                        }}
                        onClick={() => handleUpdateComment(cmt.commentID)}
                      >
                        <TbSend2
                          color={
                            editedContent.replace(/<(.|\n)*?>/g, '').trim()
                              ? 'blue'
                              : 'gray'
                          }
                        />
                      </Button>
                    </HStack>
                  </Box>
                </VStack>
              ) : (
                <VStack align="start" spacing={1} w="full" position="relative">
                  <HStack justify="start" align="center" w="full">
                    <Box
                      bg="#f2f4f7"
                      p={2}
                      rounded="xl"
                      w="fit-content"
                      whiteSpace="pre-wrap"
                      wordBreak="break-word"
                    >
                      <Text fontWeight="bold" fontSize=".8125rem" mr={2}>
                        {cmt.coderName}
                      </Text>
                      <Box
                        fontSize=".9375rem"
                        dangerouslySetInnerHTML={{ __html: cmt.content }}
                      />
                    </Box>

                    {(coder?.coderID === cmt.coderID ||
                      coder?.roleID === 1 ||
                      coder?.roleID === 3) && (
                      <Menu placement="bottom-end" autoSelect={false}>
                        <Tooltip
                          label="Tùy chọn bình luận"
                          hasArrow
                          placement="top"
                          bg="gray.700"
                          color="white"
                          fontSize="12px"
                          borderRadius="md"
                          boxShadow="md"
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
                        </Tooltip>

                        <MenuList
                          icon={<EditIcon boxSize={4} color="blue.500" />}
                          minW="160px"
                          py={2}
                          px={1}
                          borderRadius="lg"
                          boxShadow="md"
                        >
                          <MenuItem
                            icon={<EditIcon boxSize={4} color="blue.500" />}
                            fontSize="14px"
                            onClick={() => {
                              setEditingCommentID(cmt.commentID);
                              setEditedContent(cmt.content);
                            }}
                            _hover={{ bg: 'gray.200' }}
                          >
                            Sửa bình luận
                          </MenuItem>
                          <MenuItem
                            icon={<DeleteIcon boxSize={4} color="red.500" />}
                            fontSize="14px"
                            color="red.500"
                            _hover={{ bg: 'red.50' }}
                            onClick={() => {
                              setCommentToDelete(cmt.commentID);
                              setIsDeleteConfirmOpen(true);
                            }}
                          >
                            Xóa bình luận
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    )}
                  </HStack>
                  <Text fontSize="13px" color="gray.500" pl={2}>
                    {formatTimeFromNow(cmt.commentTime)}
                  </Text>
                </VStack>
              )}
            </HStack>
          </MotionBox>
        ))}
      </AnimatePresence>
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
              Bạn có chắc chắn muốn xóa bình luận này không? Hành động này không
              thể hoàn tác.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                colorScheme="red"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  handleDeleteClick();
                }}
                borderRadius="md"
                mr={3}
              >
                Xóa
              </Button>
              <Button
                ref={cancelRef}
                onClick={() => setIsDeleteConfirmOpen(false)}
                borderRadius="md"
              >
                Hủy
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
};

export default CommentSection;

const customScrollbarStyle = {
  '&::-webkit-scrollbar': {
    width: '10px',
    backgroundColor: '#f0f0f0',
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '5px',
    backgroundColor: '#888',
    border: '2px solid #f0f0f0',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#555',
  },
};
