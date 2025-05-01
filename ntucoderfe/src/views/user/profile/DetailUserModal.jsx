import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Text,
  Input,
  Textarea,
  VStack,
  HStack,
  Divider,
  Avatar,
  Flex,
  Select,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import api from 'utils/api';
import moment from 'moment';
const initialFields = [
  { key: 'username', label: 'Tên đăng nhập' },
  { key: 'password', label: 'Mật khẩu' },
  { key: 'coderName', label: 'Họ và tên' },
  { key: 'email', label: 'Email' },
  { key: 'gender', label: 'Giới tính' },
  { key: 'birthday', label: 'Ngày sinh' },
  { key: 'phonenumber', label: 'Số điện thoại' },
  { key: 'description', label: 'Giới thiệu' },
];

export default function DetailUserModal({ isOpen, onClose, coderProfile }) {
  const genderMap = {
    0: 'Nam',
    1: 'Nữ',
    2: 'Khác',
  };

  const [formValues, setFormValues] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [passwordFields, setPasswordFields] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [birthday, setBirthday] = useState({
    day: '',
    month: '',
    year: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!isOpen) return;
      try {
        const res = await api.get(`/Coder/${coderProfile.coderID}`);
        const data = res.data;
        setFormValues({
          username: data.userName || '',
          password: '',
          coderName: data.coderName || '',
          email: data.coderEmail || '',
          avatar: data.avatar,
          gender: genderMap[data.gender] || '',
          birthday:
            data.dateOfBirth && data.dateOfBirth !== '0001-01-01T00:00:00'
              ? moment(data.dateOfBirth).format('DD/MM/YYYY')
              : '',
          phonenumber: data.phoneNumber || '',
          description: data.description || '',
        });

        if (data.dateOfBirth) {
          const dateParts = moment(data.dateOfBirth)
            .format('DD/MM/YYYY')
            .split('/');
          setBirthday({
            day: dateParts[0],
            month: dateParts[1],
            year: dateParts[2],
          });
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin coder:', error);
      }
    };

    fetchUser();
  }, [coderProfile?.coderID, isOpen]);

  const handleChange = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setEditingField(null);
  };

  const handlePasswordChange = (field, value) => {
    setPasswordFields((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordSave = () => {
    setEditingField(null);
  };

  const handleBirthdayChange = (key, value) => {
    setBirthday((prev) => ({ ...prev, [key]: value }));
  };
  const SaveCancelButtons = ({ onSave, onCancel }) => {
    return (
      <HStack spacing={2}>
        <Button size="sm" colorScheme="blue" onClick={onSave} borderRadius="md">
          Lưu
        </Button>
        <Button size="sm" bg="gray.200" onClick={onCancel} borderRadius="md">
          Hủy
        </Button>
      </HStack>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent maxW="7xl" minH="550px" px={6} py={4}>
        <ModalHeader fontSize="2xl">Thông tin cá nhân</ModalHeader>
        <ModalCloseButton />
        <ModalBody py={0} height="100%">
          <HStack align="stretch" spacing={6} height="100%">
            <Flex
              w="30%"
              flexDir="column"
              align="center"
              justify="center"
              minH="100%"
            >
              <Avatar size="3xl" src={formValues.avatar} />
            </Flex>
            <Divider
              orientation="vertical"
              height="100%"
              borderColor="gray.300"
            />
            <Box w="100%">
              <VStack align="stretch" gap={0}>
                {initialFields.map((field) => {
                  const fieldValue = formValues[field.key] || 'Chưa có';

                  if (field.key === 'username') {
                    return (
                      <Box
                        key={field.key}
                        borderBottom="1px solid"
                        borderColor="gray.200"
                        py={3}
                        px={3}
                      >
                        <Flex align="center">
                          <Text w="150px" fontWeight="medium" color="gray.700">
                            {field.label}
                          </Text>
                          <Text flex="1" color="gray.600">
                            {fieldValue}
                          </Text>
                        </Flex>
                      </Box>
                    );
                  }

                  if (field.key === 'password') {
                    return (
                      <Box
                        key={field.key}
                        bg={
                          editingField === field.key
                            ? 'gray.100'
                            : 'transparent'
                        }
                        borderBottom="1px solid"
                        borderColor="gray.200"
                        py={3}
                        px={3}
                      >
                        {editingField === field.key ? (
                          <Flex align="flex-start">
                            <Text
                              w="150px"
                              fontWeight="medium"
                              color="gray.700"
                              pt={2}
                            >
                              {field.label}
                            </Text>
                            <Box flex="1">
                              <VStack align="stretch" spacing={2} width="50%">
                                <Input
                                  placeholder="Mật khẩu hiện tại"
                                  type="password"
                                  value={passwordFields.current}
                                  onChange={(e) =>
                                    handlePasswordChange(
                                      'current',
                                      e.target.value,
                                    )
                                  }
                                  size="sm"
                                  bg="white"
                                  borderRadius="md"
                                />
                                <Input
                                  placeholder="Mật khẩu mới"
                                  type="password"
                                  value={passwordFields.new}
                                  onChange={(e) =>
                                    handlePasswordChange('new', e.target.value)
                                  }
                                  size="sm"
                                  bg="white"
                                  borderRadius="md"
                                />
                                <Input
                                  placeholder="Xác nhận mật khẩu mới"
                                  type="password"
                                  value={passwordFields.confirm}
                                  onChange={(e) =>
                                    handlePasswordChange(
                                      'confirm',
                                      e.target.value,
                                    )
                                  }
                                  size="sm"
                                  bg="white"
                                  borderRadius="md"
                                />
                                <SaveCancelButtons
                                  onSave={handleSave}
                                  onCancel={() => setEditingField(null)}
                                />
                              </VStack>
                            </Box>
                          </Flex>
                        ) : (
                          <Flex align="center">
                            <Text
                              w="150px"
                              fontWeight="medium"
                              color="gray.700"
                            >
                              {field.label}
                            </Text>
                            <Text flex="1" color="gray.600">
                              ********
                            </Text>
                            <Button
                              size="sm"
                              variant="link"
                              colorScheme="blue"
                              onClick={() => setEditingField(field.key)}
                            >
                              Thay đổi mật khẩu
                            </Button>
                          </Flex>
                        )}
                      </Box>
                    );
                  }

                  if (field.key === 'gender') {
                    return (
                      <Box
                        key={field.key}
                        bg={
                          editingField === field.key
                            ? 'gray.100'
                            : 'transparent'
                        }
                        borderBottom="1px solid"
                        borderColor="gray.200"
                        py={3}
                        px={3}
                      >
                        {editingField === field.key ? (
                          <Flex align="flex-start">
                            <Text
                              w="150px"
                              fontWeight="medium"
                              color="gray.700"
                              pt={2}
                            >
                              {field.label}
                            </Text>
                            <Box flex="1">
                              <Select
                                value={genderMap[formValues.gender]}
                                onChange={(e) =>
                                  handleChange('gender', e.target.value)
                                }
                                size="sm"
                                bg="white"
                                borderRadius="md"
                                mb={2}
                              >
                                {Object.entries(genderMap).map(
                                  ([key, value]) => (
                                    <option key={key} value={key}>
                                      {value}
                                    </option>
                                  ),
                                )}
                              </Select>
                              <SaveCancelButtons
                                onSave={handleSave}
                                onCancel={() => setEditingField(null)}
                              />
                            </Box>
                          </Flex>
                        ) : (
                          <Flex align="center">
                            <Text
                              w="150px"
                              fontWeight="medium"
                              color="gray.700"
                            >
                              {field.label}
                            </Text>
                            <Text flex="1" color="gray.600">
                              {formValues.gender}
                            </Text>
                            <Button
                              size="sm"
                              variant="link"
                              colorScheme="blue"
                              onClick={() => setEditingField(field.key)}
                              leftIcon={<EditIcon />}
                            >
                              Edit
                            </Button>
                          </Flex>
                        )}
                      </Box>
                    );
                  }

                  if (field.key === 'birthday') {
                    return (
                      <Box
                        key={field.key}
                        bg={
                          editingField === field.key
                            ? 'gray.100'
                            : 'transparent'
                        }
                        borderBottom="1px solid"
                        borderColor="gray.200"
                        py={3}
                        px={3}
                      >
                        {editingField === field.key ? (
                          <Flex align="flex-start">
                            <Text
                              w="150px"
                              fontWeight="medium"
                              color="gray.700"
                              pt={2}
                            >
                              {field.label}
                            </Text>
                            <Box flex="1">
                              <HStack spacing={4} mb={2}>
                                <Select
                                  value={birthday.day}
                                  onChange={(e) =>
                                    handleBirthdayChange('day', e.target.value)
                                  }
                                  size="sm"
                                  bg="white"
                                  borderRadius="md"
                                  width="110px"
                                >
                                  {[...Array(31).keys()].map((i) => (
                                    <option
                                      key={i}
                                      value={String(i + 1).padStart(2, '0')}
                                    >
                                      {String(i + 1).padStart(2, '0')}
                                    </option>
                                  ))}
                                </Select>
                                <Select
                                  value={birthday.month}
                                  onChange={(e) =>
                                    handleBirthdayChange(
                                      'month',
                                      e.target.value,
                                    )
                                  }
                                  size="sm"
                                  bg="white"
                                  borderRadius="md"
                                  width="110px"
                                >
                                  {[...Array(12).keys()].map((i) => (
                                    <option
                                      key={i}
                                      value={String(i + 1).padStart(2, '0')}
                                    >
                                      Tháng {String(i + 1).padStart(1)}
                                    </option>
                                  ))}
                                </Select>
                                <Select
                                  value={birthday.year}
                                  onChange={(e) =>
                                    handleBirthdayChange('year', e.target.value)
                                  }
                                  size="sm"
                                  bg="white"
                                  borderRadius="md"
                                  width="110px"
                                >
                                  {[...Array(100).keys()].map((i) => (
                                    <option key={i} value={2025 - i}>
                                      {2025 - i}
                                    </option>
                                  ))}
                                </Select>
                              </HStack>
                              <SaveCancelButtons
                                onSave={handleSave}
                                onCancel={() => setEditingField(null)}
                              />
                            </Box>
                          </Flex>
                        ) : (
                          <Flex align="center">
                            <Text
                              w="150px"
                              fontWeight="medium"
                              color="gray.700"
                            >
                              {field.label}
                            </Text>
                            <Text flex="1" color="gray.600">
                              {formValues.birthday}
                            </Text>
                            <Button
                              size="sm"
                              variant="link"
                              colorScheme="blue"
                              onClick={() => setEditingField(field.key)}
                              leftIcon={<EditIcon />}
                            >
                              Edit
                            </Button>
                          </Flex>
                        )}
                      </Box>
                    );
                  }

                  if (field.key === 'description') {
                    return (
                      <Box
                        key={field.key}
                        bg={
                          editingField === field.key
                            ? 'gray.100'
                            : 'transparent'
                        }
                        borderBottom="1px solid"
                        borderColor="gray.200"
                        py={3}
                        px={3}
                      >
                        {editingField === field.key ? (
                          <Flex align="flex-start">
                            <Text
                              w="150px"
                              fontWeight="medium"
                              color="gray.700"
                              pt={2}
                            >
                              {field.label}
                            </Text>
                            <Box flex="1">
                              <Textarea
                                value={formValues[field.key]}
                                onChange={(e) =>
                                  handleChange(field.key, e.target.value)
                                }
                                size="sm"
                                bg="white"
                                width="100%"
                                borderRadius="md"
                                mb={2}
                              />
                              <SaveCancelButtons
                                onSave={handleSave}
                                onCancel={() => setEditingField(null)}
                              />
                            </Box>
                          </Flex>
                        ) : (
                          <Flex align="center">
                            <Text
                              w="150px"
                              fontWeight="medium"
                              color="gray.700"
                            >
                              {field.label}
                            </Text>
                            <Text flex="1" color="gray.600">
                              {fieldValue}
                            </Text>
                            <Button
                              size="sm"
                              variant="link"
                              colorScheme="blue"
                              onClick={() => setEditingField(field.key)}
                              leftIcon={<EditIcon />}
                            >
                              Edit
                            </Button>
                          </Flex>
                        )}
                      </Box>
                    );
                  }

                  return (
                    <Box
                      key={field.key}
                      bg={
                        editingField === field.key ? 'gray.100' : 'transparent'
                      }
                      borderBottom="1px solid"
                      borderColor="gray.200"
                      py={3}
                      px={3}
                    >
                      {editingField === field.key ? (
                        <Flex align="flex-start">
                          <Text
                            w="150px"
                            fontWeight="medium"
                            color="gray.700"
                            pt={2}
                          >
                            {field.label}
                          </Text>
                          <Box flex="1">
                            <VStack align="stretch" spacing={2}>
                              <Input
                                value={formValues[field.key]}
                                onChange={(e) =>
                                  handleChange(field.key, e.target.value)
                                }
                                size="sm"
                                bg="white"
                                width="35%"
                                borderRadius="md"
                              />
                              <SaveCancelButtons
                                onSave={handleSave}
                                onCancel={() => setEditingField(null)}
                              />
                            </VStack>
                          </Box>
                        </Flex>
                      ) : (
                        <Flex align="center">
                          <Text w="150px" fontWeight="medium" color="gray.700">
                            {field.label}
                          </Text>
                          <Text flex="1" color="gray.600">
                            {fieldValue}
                          </Text>
                          <Button
                            size="sm"
                            variant="link"
                            colorScheme="blue"
                            onClick={() => setEditingField(field.key)}
                            leftIcon={<EditIcon />}
                          >
                            Edit
                          </Button>
                        </Flex>
                      )}
                    </Box>
                  );
                })}
              </VStack>
            </Box>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
