import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  Flex,
  FormLabel,
  FormErrorMessage,
  Input,
  Checkbox,
  Text,
  Box,
  useToast,
  Switch,
} from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from 'utils/api';

export default function BlogModal({ isOpen, onClose, onDone, blogID = null }) {
  const isEditMode = Boolean(blogID);

  const [title, setBlogTitle] = useState('');
  const [content, setBlogContent] = useState('');
  const [published, setPublished] = useState(0);
  const [pinHome, setPinHome] = useState(0);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if (isOpen && isEditMode) {
      setIsFetching(true);
      api
        .get(`/Blog/${blogID}`)
        .then((res) => {
          const data = res.data;
          setBlogTitle(data.title || '');
          setBlogContent(data.content || '');
          setPublished(data.published || 0);
          setPinHome(data.pinHome || 0);
        })
        .catch((error) => {
          toast({
            title: 'Lỗi khi lấy dữ liệu bài viết',
            description: error.message || 'Đã có lỗi xảy ra.',
            status: 'error',
            duration: 4000,
            isClosable: true,
          });
          onClose(); // đóng modal nếu lỗi
        })
        .finally(() => {
          setIsFetching(false);
        });
    } else if (isOpen && !isEditMode) {
      // Reset form nếu là tạo mới
      setBlogTitle('');
      setBlogContent('');
      setPublished(0);
      setPinHome(0);
    }
    setErrors({});
  }, [blogID, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Tên bài viết là bắt buộc';
    if (!content.trim()) newErrors.content = 'Nội dung bài viết là bắt buộc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsLoading(true);
    const payload = { title, content, published, pinHome };
    try {
      if (isEditMode) {
        await api.put(`/Blog/update/${blogID}`, payload);
        toast({
          title: 'Cập nhật bài viết thành công!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await api.post('/Blog/create', payload);
        toast({
          title: 'Tạo bài viết thành công!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onDone?.();
      onClose();
    } catch (error) {
      toast({
        title: isEditMode
          ? 'Lỗi khi cập nhật bài viết'
          : 'Lỗi khi tạo bài viết',
        description: error.message || 'Đã có lỗi xảy ra.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent
        maxW="90vw"
        maxH="90vh"
        overflow="auto"
        display="flex"
        flexDirection="column"
      >
        <ModalHeader pb={0}>
          {isEditMode ? 'CẬP NHẬT BÀI VIẾT' : 'THÊM BÀI VIẾT'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isFetching ? (
            <Text>Đang tải dữ liệu...</Text>
          ) : (
            <>
              <FormControl isInvalid={errors.title} mb={4}>
                <FormLabel fontWeight="bold">
                  Tên bài viết{' '}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </FormLabel>
                <Input
                  placeholder="Nhập tên bài viết"
                  value={title}
                  onChange={(e) => setBlogTitle(e.target.value)}
                />
                <FormErrorMessage>{errors.title}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.content} mb={6}>
                <FormLabel fontWeight="bold">
                  Nội dung bài viết{' '}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </FormLabel>
                <Box mb={4}>
                  <ReactQuill
                    value={content}
                    onChange={setBlogContent}
                    placeholder="Nhập nội dung bài viết"
                    style={{
                      height: '270px',
                      paddingBottom: '20px',
                      wordWrap: 'break-word',
                    }}
                  />
                </Box>
                <FormErrorMessage>{errors.content}</FormErrorMessage>
              </FormControl>

              <Flex mt={6} gap={4}>
                <FormControl w="auto">
                  <FormLabel fontWeight="bold">Công khai</FormLabel>
                  <Switch
                    isChecked={published === 1}
                    onChange={(e) => setPublished(e.target.checked ? 1 : 0)}
                    colorScheme="blue"
                    size="md"
                  />
                </FormControl>

                <FormControl w="auto">
                  <FormLabel fontWeight="bold">Ghim bài</FormLabel>
                  <Switch
                    isChecked={pinHome === 1}
                    onChange={(e) => setPinHome(e.target.checked ? 1 : 0)}
                    colorScheme="blue"
                    size="md"
                  />
                </FormControl>
              </Flex>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Hủy
          </Button>
          <Button
            colorScheme="green"
            onClick={handleSave}
            isLoading={isLoading || isFetching}
            isDisabled={isFetching}
          >
            {isEditMode ? 'Cập nhật' : 'Lưu'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
