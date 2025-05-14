import React, { useEffect, useState } from 'react';
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
  useToast,
  Text,
  VisuallyHiddenInput,
  Textarea,
  FormControl,
} from '@chakra-ui/react';
import { HiUpload } from 'react-icons/hi';
import api from 'config/api';

export default function CreateTestCaseModal({
  isOpen,
  onClose,
  refetchData,
  problemID,
  problemName,
}) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const initialState = {
    testCaseOrder: '',
    sampleTest: 0,
    preTest: 0,
    input: '',
    output: '',
  };
  const [newTestCase, setNewTestCase] = useState(initialState);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setNewTestCase(initialState);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setNewTestCase({ ...newTestCase, [e.target.name]: e.target.value });
  };

  const handleToggleCheckbox = (field, checked) => {
    setNewTestCase((prev) => ({
      ...prev,
      [field]: checked ? 1 : 0,
    }));
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewTestCase((prev) => ({
          ...prev,
          [field]: event.target.result,
        }));
      };
      reader.readAsText(file);
    }
  };

  const handleCreateTestCase = async () => {
    if (!newTestCase.testCaseOrder || !newTestCase.output) {
      toast({
        title: 'Lỗi',
        description: 'Không được để trống.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }
    if (
      isNaN(newTestCase.testCaseOrder) ||
      parseInt(newTestCase.testCaseOrder) <= 0
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

    try {
      setLoading(true);
      const response = await api.post('/TestCase/create', {
        ...newTestCase,
        problemID,
      });

      if (response.status === 200 || response.status === 201) {
        toast({
          title: 'Thêm mới thành công!',
          description: 'TestCase đã được tạo.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        onClose();
        refetchData();
      } else {
        throw new Error('Có lỗi xảy ra khi thêm mới.');
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi thêm mới.',
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
        <ModalHeader>
          Thêm TestCase mới -{' '}
          <Text as="span" color="blue.500">
            {problemName}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel fontWeight="bold">TestCase Order</FormLabel>
            <Input
              name="testCaseOrder"
              placeholder="Nhập thứ tự TestCase"
              value={newTestCase.testCaseOrder}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Input</FormLabel>
            <Textarea
              name="input"
              placeholder="Nhập dữ liệu đầu vào"
              value={newTestCase.input}
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
              value={newTestCase.output}
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
          <FormControl mb={2} fontWeight="bold">
            <Checkbox
              isChecked={newTestCase.sampleTest === 1}
              onChange={(e) =>
                handleToggleCheckbox('sampleTest', e.target.checked)
              }
            >
              Sample Test
            </Checkbox>
          </FormControl>
          <FormControl fontWeight="bold">
            <Checkbox
              isChecked={newTestCase.preTest === 1}
              onChange={(e) =>
                handleToggleCheckbox('preTest', e.target.checked)
              }
            >
              Pre Test
            </Checkbox>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" onClick={onClose}>
            Hủy
          </Button>
          <Button
            colorScheme="blue"
            isLoading={loading}
            onClick={handleCreateTestCase}
          >
            Thêm mới
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
