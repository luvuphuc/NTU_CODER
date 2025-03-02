import React, { useState } from 'react';
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
  Switch,
  useToast,
  Text,
  VisuallyHiddenInput,
} from '@chakra-ui/react';
import { HiUpload } from "react-icons/hi";
import api from 'utils/api';

export default function CreateTestCaseModal({ isOpen, onClose, refetchData, problemID, problemName }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [newTestCase, setNewTestCase] = useState({
    testCaseOrder: '',
    sampleTest: 0,
    preTest: 0,
    input: '',
    output: '',
  });

  const handleChange = (e) => {
    setNewTestCase({ ...newTestCase, [e.target.name]: e.target.value });
  };

  const handleToggle = (field) => {
    setNewTestCase({ ...newTestCase, [field]: newTestCase[field] === 1 ? 0 : 1 });
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewTestCase({ ...newTestCase, [field]: event.target.result });
      };
      reader.readAsText(file);
    }
  };

  const handleCreateTestCase = async () => {
    if (!newTestCase.testCaseOrder || isNaN(newTestCase.testCaseOrder) || parseInt(newTestCase.testCaseOrder) <= 0) {
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
    if (!newTestCase.input || !newTestCase.output) {
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
      const response = await api.post('/TestCase/create', { ...newTestCase, problemID });

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
          Thêm TestCase mới - <Text as="span" color="blue.500">{problemName}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={4}>
            <Input name="testCaseOrder" placeholder="TestCase Order" value={newTestCase.testCaseOrder} onChange={handleChange} />
          </Box>
          <Box mb={4}>
            <Input name="input" placeholder="Input" value={newTestCase.input} onChange={handleChange} />
            <Button mt={2} leftIcon={<HiUpload />} as="label" cursor="pointer">
              Import File
              <VisuallyHiddenInput type="file" onChange={(e) => handleFileUpload(e, 'input')} />
            </Button>
          </Box>
          <Box mb={4}>
            <Input name="output" placeholder="Output" value={newTestCase.output} onChange={handleChange} />
            <Button mt={2} borderRadius={2} bg="gray.300" leftIcon={<HiUpload />} as="label" cursor="pointer">
              Import File
              <VisuallyHiddenInput type="file" onChange={(e) => handleFileUpload(e, 'output')} />
            </Button>
          </Box>
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <Switch isChecked={newTestCase.sampleTest === 1} onChange={() => handleToggle('sampleTest')} />
            <Text>Sample Test</Text>
          </Box>
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <Switch isChecked={newTestCase.preTest === 1} onChange={() => handleToggle('preTest')} />
            <Text>Pre Test</Text>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" onClick={onClose}>Hủy</Button>
          <Button colorScheme="blue" isLoading={loading} onClick={handleCreateTestCase}>Thêm mới</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
