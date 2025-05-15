import {
  Box,
  Flex,
  Avatar,
  Input,
  Button,
  Text,
  FormControl,
  FormLabel,
  Skeleton,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import { AnimatePresence, motion } from 'framer-motion';
import 'react-quill/dist/quill.snow.css';
import { Global } from '@emotion/react';
import { useAuth } from 'contexts/AuthContext';
import CustomToast from 'components/toast/CustomToast';
import api from 'config/api';
import Cookies from 'js-cookie';
import AuthToast from 'views/auth/auth_toast';
const MotionBox = motion(Box);

const BlogInput = ({ onPostSuccess, isLoading }) => {
  const { coder } = useAuth();
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const toast = useToast();
  const token = Cookies.get('token');
  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };
  const handlePost = async () => {
    if (!token) {
      toast({
        position: 'top',
        duration: 3000,
        isClosable: true,
        render: () => <AuthToast />,
      });
      return;
    }
    const payload = {
      title,
      content: value,
    };

    try {
      await api.post('/Blog/create', payload);
      toast({
        render: () => (
          <CustomToast success={true} messages="Đăng bài thành công!" />
        ),
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
      setTitle('');
      setValue('');
      setIsExpanded(false);
      if (onPostSuccess) onPostSuccess();
    } catch (error) {
      toast({
        render: () => (
          <CustomToast success={false} messages="Không thể đăng bài!" />
        ),
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    setTitle('');
    setValue('');
    setIsExpanded(false);
  };

  return (
    <>
      <Global styles={customScrollbarStyle} />
      {isLoading ? (
        <Box w="100%" p={4} bg="white" rounded="2xl" shadow="sm">
          <Skeleton height="40px" mb={4} />
          <Skeleton height="200px" mb={3} />
          <Flex justify="flex-end" gap={2}>
            <Skeleton height="32px" width="80px" />
            <Skeleton height="32px" width="80px" />
          </Flex>
        </Box>
      ) : (
        <Box
          w="100%"
          bg="white"
          rounded="2xl"
          shadow="sm"
          p={4}
          mb={6}
          border="1px solid"
          borderColor="gray.200"
        >
          <Flex align="start" mb={isExpanded ? 3 : 0}>
            {!isExpanded && (
              <Avatar
                width="40px"
                height="40px"
                mr={3}
                name={coder?.coderName}
                src={coder?.avatar || undefined}
              />
            )}

            <Box flex="1">
              {isExpanded && (
                <Text
                  fontSize="sm"
                  color="gray.500"
                  mb={1}
                  ml={2}
                  transition="all 0.2s"
                >
                  Tiêu đề bài viết
                </Text>
              )}
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  coder?.coderName
                    ? `${coder.coderName} ơi, bạn đang nghĩ gì thế?`
                    : 'Bạn đang nghĩ gì thế?'
                }
                bg="gray.100"
                rounded="full"
                px={4}
                onFocus={() => setIsExpanded(true)}
              />
            </Box>
          </Flex>

          <AnimatePresence>
            {isExpanded && (
              <MotionBox
                key="editor"
                initial={{ opacity: 0, height: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, height: 'auto', scale: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
                overflow="hidden"
              >
                {/* Nội dung */}
                <Box
                  border="1px solid"
                  borderColor="gray.200"
                  rounded="md"
                  overflow="hidden"
                  mb={3}
                  className="quill-editor-wrapper"
                >
                  <Text fontWeight="semibold" fontSize="sm" px={3} py={2}>
                    Nội dung
                  </Text>
                  <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={setValue}
                    placeholder="Chia sẻ điều gì đó..."
                    style={{ height: '200px', border: 'none' }}
                  />
                </Box>

                {/* Buttons */}
                <Flex justify="flex-end" gap={2}>
                  <Button
                    size="sm"
                    variant="ghost"
                    borderRadius="md"
                    onClick={handleCancel}
                  >
                    Hủy
                  </Button>
                  <Button
                    colorScheme="blue"
                    borderRadius="md"
                    size="sm"
                    onClick={handlePost}
                    isDisabled={!stripHtml(value).trim() || !title.trim()}
                  >
                    Đăng bài
                  </Button>
                </Flex>
              </MotionBox>
            )}
          </AnimatePresence>
        </Box>
      )}
    </>
  );
};

export default BlogInput;

const customScrollbarStyle = {
  styles: `
    .quill-editor-wrapper .ql-editor {
      max-height: 200px;
      overflow-y: auto;
    }
    .quill-editor-wrapper .ql-editor::-webkit-scrollbar {
      width: 8px;
    }
    .quill-editor-wrapper .ql-editor::-webkit-scrollbar-thumb {
      background-color: #888;
      border-radius: 4px;
    }
    .quill-editor-wrapper .ql-editor::-webkit-scrollbar-thumb:hover {
      background-color: #555;
    }
    .quill-editor-wrapper .ql-editor::-webkit-scrollbar-track {
      background-color: #f0f0f0;
    }
  `,
};
