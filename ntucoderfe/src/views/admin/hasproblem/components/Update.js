import React, { useState, useEffect, useCallback } from 'react';
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
  FormLabel,
  useToast,
  Text,
  FormControl,
  Select,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import api from 'utils/api';

export default function UpdateHasProblemModal({
  isOpen,
  onClose,
  refetchData,
  contestID,
  hasProblemID,
}) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [problemList, setProblemList] = useState([]);
  const [selectedProblemID, setSelectedProblemID] = useState(null);
  const [problemOrder, setProblemOrder] = useState(1);
  const [point, setPoint] = useState(100);

  const fetchProblemList = useCallback(async () => {
    try {
      const response = await api.get('/problem/all', {
        params: {
          Page: 1,
          PageSize: 1000,
          ascending: true,
          sortField: 'problemName',
        },
      });
      setProblemList(response.data?.data || []);
    } catch (error) {
      toast({
        title: 'Lỗi khi tải danh sách bài',
        description: error.message || 'Vui lòng thử lại sau.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [toast]);

  const fetchHasProblemDetails = useCallback(async () => {
    try {
      const response = await api.get(`/HasProblem/${hasProblemID}`);
      const { problemID, problemOrder, point } = response.data;
      setSelectedProblemID(problemID);
      setProblemOrder(problemOrder);
      setPoint(point);
    } catch (error) {
      toast({
        title: 'Lỗi khi tải thông tin bài',
        description: error.message || 'Vui lòng thử lại sau.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [hasProblemID, toast]);

  useEffect(() => {
    if (isOpen) {
      fetchProblemList();
      if (hasProblemID) {
        fetchHasProblemDetails();
      }
    }
  }, [isOpen, fetchProblemList, fetchHasProblemDetails, hasProblemID]);

  const handleUpdateHasProblem = async () => {
    if (!problemOrder || !point) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }
    try {
      setLoading(true);
      const payload = {
        contestID,
        problemOrder: parseInt(problemOrder),
        point: parseInt(point),
      };

      const res = await api.put(`/HasProblem/${hasProblemID}`, payload);

      if (res.status === 200 || res.status === 201) {
        toast({
          title: 'Cập nhật thành công',
          description: 'Thông tin bài đã được cập nhật.',
          status: 'success',
          duration: 4000,
          isClosable: true,
          position: 'top-right',
        });
        onClose();
        refetchData();
      } else {
        throw new Error('Có lỗi xảy ra khi gửi dữ liệu');
      }
    } catch (error) {
      const firstError = error.response?.data?.errors?.[0];
      toast({
        title: 'Lỗi',
        description: firstError || 'Không thể cập nhật bài.',
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
        <ModalHeader>Cập nhật bài vào Contest</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Chọn Bài</FormLabel>
            <Select
              placeholder="Chọn bài muốn cập nhật"
              value={selectedProblemID || ''}
              isDisabled
            >
              {problemList.map((item) => (
                <option key={item.problemID} value={item.problemID}>
                  {item.problemName}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Thứ tự bài</FormLabel>
            <NumberInput
              min={1}
              value={problemOrder}
              onChange={(valueString) => setProblemOrder(valueString)}
            >
              <NumberInputField placeholder="VD: 1" />
            </NumberInput>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Điểm số</FormLabel>
            <NumberInput
              min={0}
              value={point}
              onChange={(valueString) => setPoint(valueString)}
            >
              <NumberInputField placeholder="VD: 100" />
            </NumberInput>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="gray" onClick={onClose}>
            Hủy
          </Button>
          <Button
            colorScheme="blue"
            isLoading={loading}
            onClick={handleUpdateHasProblem}
          >
            Cập nhật
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
