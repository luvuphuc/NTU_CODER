import React, { useState } from 'react';
import {
  Flex,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { BiSolidDetail } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import SwitchField from 'components/fields/SwitchField';
import api from 'utils/api';

export const columnsData = [
  {
    Header: 'STT',
    accessor: 'stt',
    Cell: ({ rowIndex }) => rowIndex + 1,
    minWidth: '20px',
  },
  {
    Header: 'Tài khoản',
    accessor: 'userName',
  },
  {
    Header: 'Tên ND',
    accessor: 'coderName',
  },
  {
    Header: 'Email',
    accessor: 'coderEmail',
  },
  {
    Header: 'SĐT',
    accessor: 'phoneNumber',
  },
  {
    Header: 'Trạng thái',
    accessor: 'status',
    Cell: ({ value }) => (
      <SwitchField
        isChecked={value || false}
        reversed={true}
        fontSize="sm"
      />
    ),
  },
  {
    Header: '',
    accessor: 'action',
    Cell: ({ row }) => {
      const navigate = useNavigate();
      const { coderID } = row;
      const { isOpen, onOpen, onClose } = useDisclosure();
      const toast = useToast();
      const [loading, setLoading] = useState(false);

      const handleDetailClick = () => {
        navigate(`/admin/coder/detail/${coderID}`);
      };

      const handleDeleteClick = async () => {
        try {
          setLoading(true);
          await new Promise(resolve => setTimeout(resolve, 1000));
      
          const response = await api.delete(`/Coder/${coderID}`);
          if (response.status === 200) {
            toast({
              title: "Xóa thành công!",
              description: "Người dùng đã bị xóa.",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "top-right",
            });
            onClose();
            window.location.reload();
          } else {
            throw new Error("Có lỗi xảy ra khi xóa");
          }
        } catch (error) {
          toast({
            title: "Lỗi",
            description: error.message || "Có lỗi xảy ra khi xóa.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
        } finally {
          setLoading(false);
        }
      };

      return (
        <Flex gap={4} justify="center" align="center">
          <Button
            variant="solid"
            size="sm"
            colorScheme="facebook"
            borderRadius="md"
            minW="auto"
            onClick={handleDetailClick}
          >
            <BiSolidDetail size="18" />
          </Button>

          {/* Nút xóa */}
          <Button
            variant="solid"
            size="sm"
            colorScheme="red"
            borderRadius="md"
            minW="auto"
            onClick={onOpen} 
          >
            <MdDelete size="18" />
          </Button>

          {/* Modal xác nhận xóa */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Xác nhận xóa</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>Bạn có chắc chắn muốn xóa hay không?</Text>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="gray" mr={3} onClick={onClose}>
                  Hủy
                </Button>
                <Button
                  colorScheme="red"
                  isLoading={loading}
                  loadingText="Đang xóa..."
                  onClick={handleDeleteClick}
                >
                  Xóa
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      );
    },
  },
];
