import { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Avatar,
  Text,
  Box,
  VStack,
  HStack,
  Divider,
  Button,
  Input,
  useToast,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { TbSend2 } from 'react-icons/tb';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { BsThreeDots } from 'react-icons/bs';
import ReactQuill from 'react-quill';
import api from 'utils/api';
import 'react-quill/dist/quill.snow.css';
import { formatTimeFromNow } from 'utils/formatTime';
import CustomToast from 'components/toast/CustomToast';
import { useAuth } from 'contexts/AuthContext';
import CommentSection from './CommentSection';
import AuthToast from 'views/auth/auth_toast';
const PostModal = ({
  isOpen,
  onClose,
  post,
  isEditing,
  setIsEditing,
  onUpdateSuccess,
}) => {
  const toast = useToast();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const cancelRef = useRef();
  const [newComment, setNewComment] = useState('');
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [isSaving, setIsSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { coder } = useAuth();
  useEffect(() => {
    if (post) {
      setEditTitle(post.title);
      setEditContent(post.content);
    }
  }, [post]);
  if (!post) return null;
  const formattedTime = formatTimeFromNow(post.blogDate);

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
        onUpdateSuccess?.();
        onClose();
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
  const handlePostComment = async () => {
    if (!coder) {
      toast({
        render: () => <AuthToast />,
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const plainText = newComment.replace(/<(.|\n)*?>/g, '').trim();
      if (!plainText) return;

      await api.post('/Comment/create', {
        blogID: post.blogID,
        content: newComment,
      });

      setNewComment('');
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      toast({
        render: () => (
          <CustomToast success={false} messages="Không thể gửi bình luận!" />
        ),
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.put(`/Blog/${post.blogID}`, {
        title: editTitle,
        content: editContent,
      });
      toast({
        render: () => (
          <CustomToast success={true} messages="Cập nhật bài thành công!" />
        ),
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
      onUpdateSuccess?.();
      onClose();
    } catch (error) {
      toast({
        render: () => (
          <CustomToast success={false} messages="Lỗi khi sửa bài!" />
        ),
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent h="90vh" display="flex" flexDirection="column" pb={0}>
        <ModalHeader>
          <Text>{isEditing ? 'Chỉnh sửa bài viết' : `Bài viết`}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <Box px={4} pt={0} flex="1" overflowY="auto" sx={customScrollbarStyle}>
          <VStack align="start" spacing={4} pb={4}>
            <HStack w="100%" justify="space-between">
              <HStack>
                <Avatar
                  width="40px"
                  height="40px"
                  src={post.coderAvatar}
                  name={post.coderName}
                />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">{post.coderName}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {formattedTime}
                  </Text>
                </VStack>
              </HStack>

              {!isEditing &&
                (post.coderID === coder?.coderID ||
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
                      boxShadow="md"
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
                          setEditTitle(post.title);
                          setEditContent(post.content);
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
            </HStack>

            {isEditing ? (
              <VStack spacing={4} w="100%">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder={'Tiêu đề'}
                  bg="gray.100"
                  px={4}
                />

                <Box
                  w="100%"
                  border="1px solid"
                  borderColor="gray.200"
                  rounded="md"
                  className="quill-editor-wrapper"
                  sx={{
                    ...customScrollbarStyle,
                    '.ql-container': {
                      height: '200px',
                      overflowY: 'auto',
                    },
                    '.ql-editor': {
                      height: '100%',
                      overflowY: 'auto',
                    },
                  }}
                >
                  <Text fontWeight="semibold" fontSize="sm" px={3} py={2}>
                    Nội dung
                  </Text>
                  <ReactQuill
                    theme="snow"
                    value={editContent}
                    onChange={setEditContent}
                    placeholder="Chia sẻ điều gì đó..."
                    style={{ border: 'none' }}
                  />
                </Box>
              </VStack>
            ) : (
              <Box
                w="100%"
                dangerouslySetInnerHTML={{ __html: post.content }}
                bg="gray.50"
                p={4}
              />
            )}

            <Divider borderWidth="1.5px" color="black" />
            <Text fontWeight="bold">Tất cả bình luận</Text>

            <CommentSection blogID={post.blogID} refreshKey={refreshKey} />
          </VStack>
        </Box>
        {isEditing ? (
          <HStack
            px={6}
            py={4}
            justify="flex-end"
            bg="white"
            borderBottomRadius="xl"
          >
            <Button onClick={onClose} variant="ghost">
              Hủy
            </Button>
            <Button
              colorScheme="blue"
              borderRadius="md"
              isLoading={isSaving}
              onClick={handleSave}
            >
              Cập nhật
            </Button>
          </HStack>
        ) : (
          <Box
            px={6}
            py={2}
            bg="white"
            borderTop="1px solid #e2e8f0"
            borderBottomRadius="xl"
          >
            <HStack align="start">
              <Avatar size="sm" name="Lữ Vũ Phúc" />
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
                    value={newComment}
                    onChange={setNewComment}
                    placeholder={
                      coder
                        ? `Bình luận dưới tên ${coder.coderName || 'bạn'}...`
                        : 'Hãy đăng nhập để bình luận'
                    }
                    theme="snow"
                    modules={{ toolbar: false }}
                  />
                </Box>
                <HStack spacing={1} justify="end">
                  <Button
                    size="sm"
                    isDisabled={!newComment.replace(/<(.|\n)*?>/g, '').trim()}
                    variant="ghost"
                    p={2}
                    borderRadius="none"
                    _hover={{
                      borderRadius: 'full',
                      bg: 'gray.100',
                    }}
                    onClick={handlePostComment}
                  >
                    <TbSend2
                      color={
                        newComment.replace(/<(.|\n)*?>/g, '').trim()
                          ? 'blue'
                          : 'gray'
                      }
                    />
                  </Button>
                </HStack>
              </Box>
            </HStack>
          </Box>
        )}

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
                Bạn có chắc chắn muốn xóa bài viết này không? Hành động này
                không thể hoàn tác.
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
      </ModalContent>
    </Modal>
  );
};

export default PostModal;

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
