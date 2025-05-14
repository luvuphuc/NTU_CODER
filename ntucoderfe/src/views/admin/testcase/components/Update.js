import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Checkbox,
  FormLabel,
  FormControl,
  useToast,
  Textarea,
  VisuallyHiddenInput,
  Spinner,
} from '@chakra-ui/react';
import { HiUpload } from 'react-icons/hi';
import api from 'config/api';

export default function EditTestCaseModal({
  isOpen,
  onClose,
  refetchData,
  testCaseID,
}) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [testCase, setTestCase] = useState({
    testCaseOrder: '',
    sampleTest: 0,
    preTest: 0,
    input: '',
    output: '',
  });

  useEffect(() => {
    if (isOpen && testCaseID) {
      fetchTestCase();
    }
  }, [isOpen, testCaseID]);

  const fetchTestCase = async () => {
    try {
      setFetching(true);
      const response = await api.get(`/TestCase/${testCaseID}`);
      if (response.status === 200) {
        setTestCase(response.data);
      } else {
        throw new Error('Không thể tải dữ liệu TestCase.');
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi khi tải dữ liệu.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setTestCase({ ...testCase, [e.target.name]: e.target.value });
  };

  const handleToggle = (field) => {
    setTestCase({ ...testCase, [field]: testCase[field] === 1 ? 0 : 1 });
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTestCase({ ...testCase, [field]: event.target.result });
      };
      reader.readAsText(file);
    }
  };

  const handleUpdateTestCase = async () => {
    if (
      !testCase.testCaseOrder ||
      isNaN(testCase.testCaseOrder) ||
      parseInt(testCase.testCaseOrder) <= 0
    ) {
      toast({
        title: 'Lỗi',
        description: 'TestCase Order phải là số nguyên lớn hơn 0.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }
    if (!testCase.input || !testCase.output) {
      toast({
        title: 'Lỗi',
        description: 'Không được để trống Input hoặc Output.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }
    try {
      setLoading(true);
      const response = await api.put(`/TestCase/${testCaseID}`, testCase);

      if (response.status === 200) {
        toast({
          title: 'Cập nhật thành công!',
          description: 'TestCase đã được cập nhật.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        onClose();
        refetchData();
      } else {
        throw new Error('Có lỗi xảy ra khi cập nhật.');
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi cập nhật.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chỉnh sửa TestCase</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {fetching ? (
            <Box textAlign="center">
              <Spinner size="lg" />
            </Box>
          ) : (
            <>
              <FormControl mb={4}>
                <FormLabel fontWeight="bold">TestCase Order</FormLabel>
                <Input
                  name="testCaseOrder"
                  placeholder="Nhập thứ tự TestCase"
                  value={testCase.testCaseOrder}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel fontWeight="bold">Input</FormLabel>
                <Textarea
                  name="input"
                  placeholder="Nhập dữ liệu đầu vào"
                  value={testCase.input}
                  onChange={handleChange}
                  h="50px"
                />
                <Button
                  mt={2}
                  bg="gray.200"
                  borderRadius={3}
                  leftIcon={<HiUpload />}
                  as="label"
                  cursor="pointer"
                >
                  Import File
                  <VisuallyHiddenInput
                    type="file"
                    accept=".txt"
                    onChange={(e) => handleFileUpload(e, 'input')}
                  />
                </Button>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel fontWeight="bold">Output</FormLabel>
                <Textarea
                  name="output"
                  placeholder="Nhập dữ liệu đầu ra"
                  value={testCase.output}
                  onChange={handleChange}
                />
                <Button
                  mt={2}
                  bg="gray.200"
                  borderRadius={3}
                  leftIcon={<HiUpload />}
                  as="label"
                  cursor="pointer"
                >
                  Import File
                  <VisuallyHiddenInput
                    type="file"
                    accept=".txt"
                    onChange={(e) => handleFileUpload(e, 'output')}
                  />
                </Button>
              </FormControl>
              <FormControl display="flex" justifyContent="space-between" mb={4}>
                <Checkbox
                  isChecked={testCase.sampleTest === 1}
                  onChange={() => handleToggle('sampleTest')}
                >
                  Sample Test
                </Checkbox>
                <Checkbox
                  isChecked={testCase.preTest === 1}
                  onChange={() => handleToggle('preTest')}
                >
                  Pre Test
                </Checkbox>
              </FormControl>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" onClick={onClose}>
            Hủy
          </Button>
          <Button
            colorScheme="blue"
            isLoading={loading}
            onClick={handleUpdateTestCase}
          >
            Cập nhật
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
