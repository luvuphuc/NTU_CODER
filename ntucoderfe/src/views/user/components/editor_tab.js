import React, { useState, useEffect } from 'react';
import {
  Box,
  Select,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Text,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { CheckIcon, ChevronDownIcon, ChevronLeftIcon } from '@chakra-ui/icons';

import Editor from '@monaco-editor/react';
import { FiUpload } from 'react-icons/fi';
import api from 'utils/api';
import { useParams, useNavigate } from 'react-router-dom';
import TestCasesComponent from './testcase_tab';
const defaultSampleCode = {
  '.cpp': `#include <stdio.h>\nint main() {\n    printf("Hello world");\n    return 0;\n}`,
  '.py': `print("Hello, World!")`,
  '.java': `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
};

const EditorTab = () => {
  const [compilers, setCompilers] = useState([]);
  const [selectedCompiler, setSelectedCompiler] = useState(null);
  const [theme, setTheme] = useState('vs-dark');
  const [code, setCode] = useState('');
  const { id: problemId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isUploadModalOpen,
    onOpen: onUploadModalOpen,
    onClose: onUploadModalClose,
  } = useDisclosure();

  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploadModalCompilerId, setUploadModalCompilerId] = useState('');
  const [fileExtensionValid, setFileExtensionValid] = useState(true);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalStatus, setModalStatus] = useState('success');

  useEffect(() => {
    const fetchCompilers = async () => {
      try {
        const response = await api.get('/Compiler/all?ascending=true');
        if (response.status === 200) {
          const compilersData = response.data.data;
          setCompilers(compilersData);
          if (compilersData.length > 0) {
            const first = compilersData[0];
            setSelectedCompiler(first);
            setCode(defaultSampleCode[first.compilerExtension] || '');
            setUploadModalCompilerId(first.compilerID.toString());
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCompilers();
  }, []);

  useEffect(() => {
    if (fileToUpload) {
      const ext = `.${fileToUpload.name.split('.').pop()?.toLowerCase()}`;
      const selected = compilers.find(
        (c) => c.compilerID.toString() === uploadModalCompilerId,
      );
      setFileExtensionValid(selected?.compilerExtension === ext);
    }
  }, [uploadModalCompilerId, fileToUpload, compilers]);

  const handleCompilerChange = (e) => {
    const id = Number(e.target.value);
    const compiler = compilers.find((c) => c.compilerID === id);
    if (compiler) {
      setSelectedCompiler(compiler);
      setCode(defaultSampleCode[compiler.compilerExtension] || '');
      setUploadModalCompilerId(compiler.compilerID.toString());
    }
  };

  const validateCodeSyntax = () => {
    const ext = selectedCompiler?.compilerExtension;
    if (ext === '.cpp' || ext === '.c')
      return /#include\s+<\w+>|int\s+main\s*\(\)/.test(code);
    if (ext === '.java')
      return /public\s+class\s+\w+|public\s+static\s+void\s+main/.test(code);
    if (ext === '.py') return !/#include\s+<\w+>|int\s+main\s*\(\)/.test(code);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateCodeSyntax())
      return showModal(
        'Lỗi cú pháp!',
        'Mã nguồn không phù hợp với trình biên dịch đã chọn.',
        'error',
      );
    try {
      const res = await api.post('/Submission/create', {
        problemId,
        compilerId: selectedCompiler.compilerID,
        submissionCode: code,
        submissionStatus: 0,
      });
      if (res.status === 200)
        showModal(
          'Nộp bài thành công!',
          <>
            Bài của bạn đã được gửi.
            <br />
            Thời gian nộp: {new Date(new Date().toISOString()).toLocaleString()}
          </>,
          'success',
        );
    } catch {
      showModal(
        'Lỗi khi nộp bài!',
        'Đã xảy ra lỗi, vui lòng thử lại.',
        'error',
      );
    }
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const match = compilers.find((c) => c.compilerExtension === ext);
      setFileToUpload(file);
      setFileExtensionValid(Boolean(match));
      if (match) setUploadModalCompilerId(match.compilerID.toString());
      else
        toast({
          title: 'Không tìm thấy trình biên dịch khớp',
          description: `Không tự động tìm thấy compiler cho đuôi file "${ext}".`,
          status: 'warning',
          position: 'top-right',
          duration: 4000,
          isClosable: true,
        });
    }
  };

  const handleConfirmUpload = () => {
    if (!fileToUpload || !fileExtensionValid) {
      toast({
        title: 'File không hợp lệ',
        description: 'Vui lòng chọn một file hợp lệ.',
        status: 'error',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const compiler = compilers.find(
      (c) => c.compilerID === Number(uploadModalCompilerId),
    );
    if (!compiler) {
      toast({
        title: 'Chưa chọn trình biên dịch',
        description: 'Vui lòng chọn trình biên dịch phù hợp.',
        status: 'error',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        setCode(content);
        setSelectedCompiler(compiler);
        toast({
          title: 'Tải lên thành công',
          description: `File "${fileToUpload.name}" đã được tải lên.`,
          status: 'success',
          position: 'top-right',
          duration: 3000,
          isClosable: true,
        });
        onUploadModalClose();
        setFileToUpload(null);
      } else {
        toast({
          title: 'Lỗi đọc file',
          description: 'Không thể đọc nội dung file.',
          status: 'error',
          position: 'top-right',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    reader.onerror = () =>
      toast({
        title: 'Lỗi đọc file',
        description: 'Đã xảy ra lỗi khi đọc file.',
        status: 'error',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    reader.readAsText(fileToUpload);
  };

  const resetUploadModal = () => {
    setFileToUpload(null);
    setUploadModalCompilerId(
      selectedCompiler?.compilerID.toString() ||
        compilers[0]?.compilerID.toString() ||
        '',
    );
    onUploadModalClose();
  };

  const showModal = (title, message, status) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalStatus(status);
    onOpen();
  };
  return (
    <Box display="flex" flexDirection="column" p={4} height="100vh">
      <HStack justify="space-between" mb={4}>
        <HStack>
          <Select
            value={selectedCompiler?.compilerID || ''}
            onChange={handleCompilerChange}
            width="150px"
            border="1px"
          >
            {compilers.map((compiler) => (
              <option key={compiler.compilerID} value={compiler.compilerID}>
                {compiler.compilerName}
              </option>
            ))}
          </Select>

          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              colorScheme="purple"
              borderRadius="md"
            >
              Giao diện
            </MenuButton>
            <MenuList>
              {[
                { key: 'vs-light', label: 'VS Light' },
                { key: 'vs-dark', label: 'VS Dark' },
                { key: 'hc-black', label: 'High Contrast' },
              ].map(({ key, label }) => (
                <MenuItem key={key} onClick={() => setTheme(key)}>
                  <HStack justify="space-between" width="full">
                    <Text
                      fontWeight={theme === key ? 'bold' : 'normal'}
                      color={theme === key ? 'blue.500' : 'inherit'}
                    >
                      {label}
                    </Text>
                    {theme === key && <CheckIcon color="blue.500" />}
                  </HStack>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </HStack>

        <Button
          leftIcon={<ChevronLeftIcon boxSize={6} />}
          colorScheme="gray"
          variant="solid"
          onClick={() => navigate('/problem')}
          _hover={{ bg: 'gray.300', transform: 'scale(1.05)' }}
          _active={{ bg: 'gray.400', transform: 'scale(0.95)' }}
          bg="gray.400"
          color="black"
          borderRadius={5}
          boxShadow="md"
          px={4}
          py={2}
          size="md"
        >
          Quay lại
        </Button>
      </HStack>

      <Box
        borderRadius="md"
        overflow="hidden"
        border="1px solid #ddd"
        flex="1"
        height="70%"
      >
        <Editor
          width="100%"
          height="100%"
          language={
            selectedCompiler?.compilerExtension.replace('.', '') || 'plaintext'
          }
          theme={theme}
          value={code}
          onChange={(newValue) => setCode(newValue)}
          options={{ fontSize: 14, minimap: { enabled: false } }}
        />
      </Box>

      <Flex justify="space-between" mt={4}>
        <Button
          borderRadius="md"
          border="1px"
          variant="unstyled"
          display="flex"
          alignItems="center"
          padding="8px"
          onClick={onUploadModalOpen}
        >
          <FiUpload style={{ marginRight: '8px', color: 'gray' }} />
          <Text fontWeight="normal" _hover={{ textDecoration: 'underline' }}>
            Tải file lên
          </Text>
        </Button>
        <HStack spacing={4}>
          <Button colorScheme="blue" borderRadius="md">
            Chạy chương trình
          </Button>
          <Button colorScheme="green" borderRadius="md" onClick={handleSubmit}>
            Nộp bài
          </Button>
        </HStack>
      </Flex>
      <Box mt={4} maxHeight="200px" overflowY="auto">
        <TestCasesComponent />
      </Box>

      <Modal isOpen={isUploadModalOpen} onClose={resetUploadModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tải File Mã Nguồn</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Source File</FormLabel>
              <Flex>
                <Input
                  isReadOnly
                  placeholder="Chưa có file nào được chọn"
                  value={fileToUpload?.name || ''}
                  mr={3}
                  borderColor="gray.300"
                />
                <Button
                  colorScheme="blue"
                  onClick={() =>
                    document.getElementById('file-input-modal').click()
                  }
                  borderRadius="md"
                >
                  Chọn File
                </Button>
                <input
                  id="file-input-modal"
                  type="file"
                  accept={
                    selectedCompiler
                      ? selectedCompiler.compilerExtension
                      : '.cpp'
                  }
                  style={{ display: 'none' }}
                  onChange={handleFileSelected}
                />
              </Flex>
              {!fileExtensionValid && (
                <Text color="red.500" mt={2}>
                  <span>Không hỗ trợ dạng file này</span>
                </Text>
              )}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Trình biên dịch</FormLabel>
              <Select
                value={uploadModalCompilerId}
                onChange={(e) => setUploadModalCompilerId(e.target.value)}
                borderColor="gray.300"
                isDisabled={compilers.length === 0}
              >
                {compilers.map((compiler) => (
                  <option
                    key={`modal-${compiler.compilerID}`}
                    value={compiler.compilerID}
                  >
                    {compiler.compilerName}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={handleConfirmUpload}
              isDisabled={
                !fileToUpload || !uploadModalCompilerId || !fileExtensionValid
              }
              borderRadius="md"
            >
              Tải Lên
            </Button>
            <Button variant="ghost" onClick={resetUploadModal}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            color={modalStatus === 'success' ? 'green.500' : 'red.500'}
          >
            {modalTitle}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{modalMessage}</Text>
            {modalStatus === 'success' && modalTitle.includes('Nộp bài') && (
              <Text mt={2} fontSize="sm" color="gray.600">
                Ngôn ngữ: {selectedCompiler?.compilerName || 'N/A'}
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EditorTab;
