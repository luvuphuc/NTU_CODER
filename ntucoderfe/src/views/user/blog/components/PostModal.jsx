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
} from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import { TbSend2 } from 'react-icons/tb';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { formatTimeFromNow } from 'utils/formatTime';
const PostModal = ({ isOpen, onClose, post }) => {
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const formattedTime = formatTimeFromNow(post.blogDate);
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newItem = {
      id: Date.now(),
      author: 'Bạn',
      content: newComment,
    };
    setComments([...comments, newItem]);
    setNewComment('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent h="90vh" display="flex" flexDirection="column">
        <ModalHeader>Bài viết của {post.coderName}</ModalHeader>
        <ModalCloseButton />

        {/* Scrollable content area */}
        <Box px={4} pt={0} flex="1" overflowY="auto" sx={customScrollbarStyle}>
          <VStack align="start" spacing={4} pb={4}>
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

            <Box
              w="100%"
              dangerouslySetInnerHTML={{ __html: post.content }}
              bg="gray.50"
              p={4}
              rounded="md"
            />

            <Divider />

            <Text fontWeight="bold">Bình luận</Text>

            {comments.length > 0 ? (
              <VStack spacing={3} align="start" w="full">
                {comments.map((cmt) => (
                  <HStack key={cmt.id} align="start" spacing={3} w="100%">
                    <Avatar width="40px" height="40px" name={cmt.author} />
                    <Box bg="gray.100" p={2} rounded="lg" w="100%">
                      <Text fontWeight="medium">{cmt.author}</Text>
                      <Text>{cmt.content}</Text>
                    </Box>
                  </HStack>
                ))}
              </VStack>
            ) : (
              <Text fontSize="sm" color="gray.500">
                Chưa có bình luận nào.
              </Text>
            )}
          </VStack>
        </Box>

        {/* Fixed comment input area */}
        <Box px={6} py={4} bg="white" borderTop="1px solid #e2e8f0">
          <HStack align="start">
            <Avatar size="sm" name="Lữ Vũ Phúc" />
            <Box bg="#f2f4f7" p={3} borderRadius="xl" w="full">
              <Box
                className="custom-quill"
                sx={{
                  '.ql-container': {
                    border: 'none !important',
                  },
                  '.ql-editor': {
                    outline: 'none !important',
                    padding: 0,
                  },
                }}
              >
                <ReactQuill
                  value={newComment}
                  onChange={setNewComment}
                  placeholder="Bình luận dưới tên Lữ Vũ Phúc..."
                  theme="snow"
                  modules={{ toolbar: false }}
                />
              </Box>

              <HStack mt={3} spacing={4} justify="end">
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  isDisabled={!newComment.replace(/<(.|\n)*?>/g, '').trim()}
                  variant="ghost"
                  p={2}
                  borderRadius="none"
                  _hover={{
                    borderRadius: 'full',
                    bg: 'gray.100',
                  }}
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
