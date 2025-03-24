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
  ModalBody,
  ModalFooter,
  useDisclosure,
  Text,
  Flex,
} from '@chakra-ui/react';
import { CheckIcon, ChevronDownIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import Editor from '@monaco-editor/react';
import api from 'utils/api';
import { useParams, useNavigate } from 'react-router-dom';
const defaultSampleCode = {
  '.cpp': `#include <stdio.h>\nint main() {\n    printf("Hello world");\n    return 0;\n}`,
  '.py': `print("Hello, World!")`,
  '.java': `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
};

const EditorTab = () => {
  const [compilers, setCompilers] = useState([]);
  const [selectedCompiler, setSelectedCompiler] = useState(null);
  const [theme, setTheme] = useState('vs-light');
  const [code, setCode] = useState('');
  const { id: problemId } = useParams();
  const navigate = useNavigate();
  // State cho Modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalStatus, setModalStatus] = useState('success'); // success | error
  useEffect(() => {
    const fetchCompilers = async () => {
      try {
        const response = await api.get('/Compiler/all?ascending=true');
        if (response.status === 200) {
          setCompilers(response.data.data);
          if (response.data.data.length > 0) {
            const firstCompiler = response.data.data[0];
            setSelectedCompiler(firstCompiler);
            setCode(defaultSampleCode[firstCompiler.compilerExtension] || '');
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách compiler:', error);
      }
    };
    fetchCompilers();
  }, []);
  // Xử lý thay đổi ngôn ngữ
  const handleCompilerChange = (e) => {
    const compilerId = Number(e.target.value);
    const newCompiler = compilers.find((c) => c.compilerID === compilerId);
    if (newCompiler) {
      setSelectedCompiler(newCompiler);
      setCode(defaultSampleCode[newCompiler.compilerExtension] || '');
    }
  };
  const validateCodeSyntax = () => {
    if (!selectedCompiler) return false;

    const extension = selectedCompiler.compilerExtension;
    if (extension === '.cpp' || extension === '.c') {
      return /#include\s+<\w+>|int\s+main\s*\(\)/.test(code);
    }
    if (extension === '.java') {
      return /public\s+class\s+\w+|public\s+static\s+void\s+main/.test(code);
    }
    if (extension === '.py') {
      return !/#include\s+<\w+>|int\s+main\s*\(\)/.test(code);
    }
    return true;
  };
  const handleSubmit = async () => {
    if (!validateCodeSyntax()) {
      setModalTitle('Lỗi cú pháp!');
      setModalMessage('Mã nguồn không phù hợp với trình biên dịch đã chọn.');
      setModalStatus('error');
      onOpen();
      return;
    }
    try {
      const response = await api.post('/Submission/create', {
        problemId: problemId,
        compilerId: selectedCompiler.compilerID,
        submitTime: new Date().toISOString(),
        submissionCode: code,
        submissionStatus: 0,
      });

      if (response.status === 201) {
        setModalTitle('Nộp bài thành công!');
        setModalMessage('Bài của bạn đã được gửi.');
        setModalStatus('success');
        onOpen();
      }
    } catch (error) {
      setModalTitle('Lỗi khi nộp bài!');
      setModalMessage('Đã xảy ra lỗi, vui lòng thử lại.');
      setModalStatus('error');
      onOpen();
    }
  };

  return (
    <Box display="flex" flexDirection="column" p={4}>
      <HStack justify="space-between" mb={4}>
        {/* Nhóm 2 nút chọn compiler và giao diện */}
        <HStack>
          <Select
            value={selectedCompiler?.compilerID || ''}
            onChange={handleCompilerChange}
            width="150px"
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

        {/* Nút Quay lại */}
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

      {/* Trình soạn thảo */}
      <Box borderRadius="md" overflow="hidden" border="1px solid #ddd">
        <Editor
          width="100%"
          height="450px"
          language={
            selectedCompiler?.compilerExtension.replace('.', '') || 'plaintext'
          }
          theme={theme}
          value={code}
          onChange={(newValue) => setCode(newValue)}
          options={{ fontSize: 14, minimap: { enabled: false } }}
        />
      </Box>

      <HStack justify="flex-end" mt={4}>
        <Button colorScheme="blue">Chạy chương trình</Button>
        <Button colorScheme="green" onClick={handleSubmit}>
          Nộp bài
        </Button>
      </HStack>

      {/* Modal Thông báo */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            color={modalStatus === 'success' ? 'green.500' : 'red.500'}
          >
            {modalTitle}
          </ModalHeader>
          <ModalBody>
            <Text>{modalMessage}</Text>
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
