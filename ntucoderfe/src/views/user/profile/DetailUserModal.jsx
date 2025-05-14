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
  Spinner,
  Textarea,
  VStack,
  HStack,
  Divider,
  Icon,
  Avatar,
  Flex,
  Select,
  useToast,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import api from 'utils/api';
import moment from 'moment';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { useAuth } from '../../../contexts/AuthContext';
import CustomToast from 'components/toast/CustomToast';
const initialFields = [
  { key: 'username', label: 'Tên đăng nhập' },
  { key: 'password', label: 'Mật khẩu' },
  { key: 'coderName', label: 'Họ và tên' },
  { key: 'email', label: 'Email' },
  { key: 'gender', label: 'Giới tính' },
  { key: 'dateOfBirth', label: 'Ngày sinh' },
  { key: 'phonenumber', label: 'Số điện thoại' },
  { key: 'description', label: 'Giới thiệu' },
];

export default function DetailUserModal({ isOpen, onClose, coderProfile }) {
  const { setCoder } = useAuth();
  const genderMap = {
    0: 'Nam',
    1: 'Nữ',
    2: 'Khác',
  };
  const [formValues, setFormValues] = useState({});
  const toast = useToast();
  const [editingField, setEditingField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [dateOfBirth, setBirthday] = useState({
    day: '',
    month: '',
    year: '',
  });

  useEffect(() => {
    if (!isOpen) return;
    const fetchUser = async () => {
      try {
        const res = await api.get(`/Coder/${coderProfile.coderID}`);
        const data = res.data;
        const formattedBirthday = data.dateOfBirth
          ? moment(data.dateOfBirth).format('DD/MM/YYYY')
          : '';
        setFormValues({
          username: data.userName || '',
          coderName: data.coderName || '',
          email: data.coderEmail || '',
          avatar: data.avatar,
          gender: data.gender?.toString() ?? '',
          dateOfBirth: formattedBirthday,
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

  const handleBirthdayChange = (key, value) => {
    setBirthday((prev) => ({ ...prev, [key]: value }));
  };
  const handleEdit = (field) => {
    setEditingField(field);
    setFormErrors({});
  };
  const handleSave = async () => {
    if (!editingField) return;
    const updatedData = {};
    let errors = {};
    if (editingField === 'password') {
      const { currentPassword, newPassword, confirmPassword } = formValues;

      if (!currentPassword) {
        errors.currentPassword = 'Mật khẩu hiện tại là bắt buộc.';
      }
      if (!newPassword) {
        errors.newPassword = 'Mật khẩu mới là bắt buộc.';
      }
      if (newPassword !== confirmPassword) {
        errors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      updatedData.oldPassword = currentPassword;
      updatedData.Password = newPassword;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = formValues.email;
    if (email && !emailRegex.test(email)) {
      errors.email = 'Email không hợp lệ.';
    }

    const nameRegex = /^[^\d]+$/;
    const coderName = formValues.coderName;
    if (coderName && !nameRegex.test(coderName)) {
      errors.coderName = 'Họ và tên không được chứa số.';
    }

    switch (editingField) {
      case 'dateOfBirth': {
        const { day, month, year } = dateOfBirth;
        if (!day || !month || !year) {
          return;
        }
        updatedData.dateOfBirth = `${year}-${month}-${day}T00:00:00`;
        break;
      }

      case 'gender':
        updatedData.gender = formValues.gender;
        break;

      case 'description':
        updatedData.description = formValues.description;
        break;

      default:
        updatedData[editingField] = formValues[editingField];
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      const res = await api.put(`/Coder/${coderProfile.coderID}`, updatedData);
      if (res.status === 200) {
        const coderRes = await api.get('/Auth/me');
        setCoder(coderRes.data);
        const newFormValues = { ...updatedData };
        if (updatedData.dateOfBirth) {
          newFormValues.dateOfBirth = moment(updatedData.dateOfBirth).format(
            'DD/MM/YYYY',
          );
        }

        setFormValues((prevValues) => ({
          ...prevValues,
          ...newFormValues,
        }));
        setEditingField(null);
      } else {
        console.error('Đã xảy ra lỗi khi cập nhật thông tin.');
      }
    } catch (err) {
      let errorMessage = 'Đã xảy ra lỗi không xác định.';
      if (err.response && err.response.data.errors) {
        errorMessage = err.response.data.errors.join(' ');
      }

      toast({
        render: () => <CustomToast success={false} messages={errorMessage} />,
        position: 'top',
        duration: 5000,
      });

      console.error('Lỗi khi lưu dữ liệu:', err);
    }
  };
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarError('');
    setIsLoading(true);
    const formData = new FormData();
    formData.append('AvatarFile', file);

    try {
      const response = await api.put(
        `/Coder/avatar/${coderProfile.coderID}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const newAvatarUrl = response.data?.avatarUrl;
      if (!newAvatarUrl) {
        throw new Error('Không nhận được đường dẫn avatar mới từ server.');
      }
      setFormValues((prev) => ({ ...prev, avatar: newAvatarUrl }));
      setEditingField((prev) => ({ ...prev, avatar: newAvatarUrl }));
      setIsLoading(false);

      const coderRes = await api.get('/Auth/me');
      setCoder(coderRes.data);
    } catch (error) {
      console.error('Đã xảy ra lỗi khi cập nhật avatar', error);
      const message = error?.response?.data?.error || 'Lỗi không xác định.';
      setAvatarError(message);
    } finally {
      setIsLoading(false);
    }
  };
  const SaveCancelButtons = ({ onSave, onCancel }) => (
    <HStack spacing={2} mt={2}>
      <Button size="sm" colorScheme="blue" onClick={onSave} borderRadius="md">
        Lưu
      </Button>
      <Button size="sm" bg="gray.200" onClick={onCancel} borderRadius="md">
        Hủy
      </Button>
    </HStack>
  );

  const renderEditableField = (field) => {
    const fieldValue = formValues[field.key] || 'Chưa có';
    const isEditing = editingField === field.key;
    const errorMessage = formErrors[field.key];

    if (field.key === 'username') {
      return (
        <Box
          key={field.key}
          bg="transparent"
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

    switch (field.key) {
      case 'gender':
        return (
          <Box
            key={field.key}
            bg={isEditing ? 'gray.100' : 'transparent'}
            borderBottom="1px solid"
            borderColor="gray.200"
            py={3}
            px={3}
          >
            {isEditing ? (
              <Flex align="flex-start">
                <Text w="150px" fontWeight="medium" color="gray.700" pt={2}>
                  {field.label}
                </Text>
                <Box flex="1">
                  <Select
                    value={formValues.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    size="sm"
                    bg="white"
                    borderRadius="md"
                    mb={2}
                  >
                    {Object.entries(genderMap).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </Select>
                  {errorMessage && (
                    <Text color="red.500" fontSize="sm">
                      {errorMessage}
                    </Text>
                  )}
                  <SaveCancelButtons
                    onSave={handleSave}
                    onCancel={() => setEditingField(null)}
                  />
                </Box>
              </Flex>
            ) : (
              <Flex align="center">
                <Text w="150px" fontWeight="medium" color="gray.700">
                  {field.label}
                </Text>
                <Text flex="1" color="gray.600">
                  {genderMap[formValues.gender] || 'Chưa có'}
                </Text>
                <Button
                  size="sm"
                  variant="link"
                  colorScheme="blue"
                  onClick={() => handleEdit(field.key)}
                  leftIcon={<EditIcon />}
                >
                  Sửa
                </Button>
              </Flex>
            )}
          </Box>
        );

      case 'dateOfBirth':
        return (
          <Box
            key={field.key}
            bg={isEditing ? 'gray.100' : 'transparent'}
            borderBottom="1px solid"
            borderColor="gray.200"
            py={3}
            px={3}
          >
            {isEditing ? (
              <Flex align="flex-start">
                <Text w="150px" fontWeight="medium" color="gray.700" pt={2}>
                  {field.label}
                </Text>
                <Box flex="1">
                  <HStack spacing={4} mb={2}>
                    {['day', 'month', 'year'].map((part) => (
                      <Select
                        key={part}
                        value={dateOfBirth[part]}
                        onChange={(e) =>
                          handleBirthdayChange(part, e.target.value)
                        }
                        size="sm"
                        bg="white"
                        borderRadius="md"
                        width="110px"
                      >
                        {part === 'day'
                          ? [...Array(31).keys()].map((i) => (
                              <option
                                key={i}
                                value={String(i + 1).padStart(2, '0')}
                              >
                                {String(i + 1).padStart(2, '0')}
                              </option>
                            ))
                          : part === 'month'
                          ? [...Array(12).keys()].map((i) => (
                              <option
                                key={i}
                                value={String(i + 1).padStart(2, '0')}
                              >
                                Tháng {String(i + 1).padStart(1)}
                              </option>
                            ))
                          : [...Array(101).keys()].map((i) => {
                              const year = new Date().getFullYear() - i;
                              return (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              );
                            })}
                      </Select>
                    ))}
                  </HStack>
                  <SaveCancelButtons
                    onSave={handleSave}
                    onCancel={() => setEditingField(null)}
                  />
                </Box>
              </Flex>
            ) : (
              <Flex align="center">
                <Text w="150px" fontWeight="medium" color="gray.700">
                  {field.label}
                </Text>
                <Text flex="1" color="gray.600">
                  {formValues.dateOfBirth}
                </Text>

                <Button
                  size="sm"
                  variant="link"
                  colorScheme="blue"
                  onClick={() => handleEdit(field.key)}
                  leftIcon={<EditIcon />}
                >
                  Sửa
                </Button>
              </Flex>
            )}
            {errorMessage && (
              <Text color="red.500" fontSize="sm">
                {errorMessage}
              </Text>
            )}
          </Box>
        );

      case 'description':
        return (
          <Box
            key={field.key}
            bg={isEditing ? 'gray.100' : 'transparent'}
            borderBottom="1px solid"
            borderColor="gray.200"
            py={3}
            px={3}
          >
            {isEditing ? (
              <Flex align="flex-start">
                <Text w="150px" fontWeight="medium" color="gray.700" pt={2}>
                  {field.label}
                </Text>
                <Box flex="1">
                  <Textarea
                    value={formValues[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    size="sm"
                    bg="white"
                    width="100%"
                    borderRadius="md"
                  />
                  {errorMessage && (
                    <Text color="red.500" fontSize="sm">
                      {errorMessage}
                    </Text>
                  )}
                  <SaveCancelButtons
                    onSave={handleSave}
                    onCancel={() => setEditingField(null)}
                  />
                </Box>
              </Flex>
            ) : (
              <Flex align="center">
                <Text w="150px" fontWeight="medium" color="gray.700">
                  {field.label}
                </Text>
                <Text flex="1" color="gray.600">
                  {formValues.description}
                </Text>
                <Button
                  size="sm"
                  variant="link"
                  colorScheme="blue"
                  onClick={() => handleEdit(field.key)}
                  leftIcon={<EditIcon />}
                >
                  Sửa
                </Button>
              </Flex>
            )}
          </Box>
        );
      case 'password':
        return (
          <Box
            key={field.key}
            bg={isEditing ? 'gray.100' : 'transparent'}
            borderBottom="1px solid"
            borderColor="gray.200"
            py={3}
            px={3}
          >
            {isEditing ? (
              <Flex align="flex-start">
                <Text w="150px" fontWeight="medium" color="gray.700" pt={2}>
                  {field.label}
                </Text>
                <Box flex="1">
                  {field.key === 'password' ? (
                    <VStack align="stretch" spacing={2}>
                      <Input
                        placeholder="Mật khẩu hiện tại"
                        type="password"
                        value={formValues.currentPassword || ''}
                        onChange={(e) =>
                          handleChange('currentPassword', e.target.value)
                        }
                        size="sm"
                        bg="white"
                        width="50%"
                      />
                      {formErrors.currentPassword && (
                        <Text color="red.500" fontSize="sm">
                          {formErrors.currentPassword}
                        </Text>
                      )}

                      <Input
                        placeholder="Mật khẩu mới"
                        type="password"
                        value={formValues.newPassword || ''}
                        onChange={(e) =>
                          handleChange('newPassword', e.target.value)
                        }
                        size="sm"
                        bg="white"
                        width="50%"
                      />
                      {formErrors.newPassword && (
                        <Text color="red.500" fontSize="sm">
                          {formErrors.newPassword}
                        </Text>
                      )}

                      <Input
                        placeholder="Xác nhận mật khẩu"
                        type="password"
                        value={formValues.confirmPassword || ''}
                        onChange={(e) =>
                          handleChange('confirmPassword', e.target.value)
                        }
                        size="sm"
                        bg="white"
                        width="50%"
                      />
                      {formErrors.confirmPassword && (
                        <Text color="red.500" fontSize="sm">
                          {formErrors.confirmPassword}
                        </Text>
                      )}
                    </VStack>
                  ) : (
                    <Input
                      value={formValues[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      size="sm"
                      bg="white"
                      width="35%"
                      borderRadius="md"
                    />
                  )}

                  <SaveCancelButtons
                    onSave={handleSave}
                    onCancel={() => setEditingField(null)}
                  />
                </Box>
              </Flex>
            ) : (
              <Flex align="center">
                <Text w="150px" fontWeight="medium" color="gray.700">
                  {field.label}
                </Text>
                <Text flex="1" color="gray.600">
                  {field.key === 'password' ? '••••••••' : fieldValue}
                </Text>
                <Button
                  size="sm"
                  variant="link"
                  colorScheme="blue"
                  onClick={() => handleEdit(field.key)}
                  leftIcon={<EditIcon />}
                >
                  Sửa
                </Button>
              </Flex>
            )}
          </Box>
        );

      default:
        return (
          <Box
            key={field.key}
            bg={isEditing ? 'gray.100' : 'transparent'}
            borderBottom="1px solid"
            borderColor="gray.200"
            py={3}
            px={3}
          >
            {isEditing ? (
              <Flex align="flex-start">
                <Text w="150px" fontWeight="medium" color="gray.700" pt={2}>
                  {field.label}
                </Text>
                <Box flex="1">
                  <Input
                    value={formValues[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    size="sm"
                    bg="white"
                    width="35%"
                    borderRadius="md"
                  />
                  {errorMessage && (
                    <Text color="red.500" fontSize="sm">
                      {errorMessage}
                    </Text>
                  )}
                  <SaveCancelButtons
                    onSave={handleSave}
                    onCancel={() => setEditingField(null)}
                  />
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
                  onClick={() => handleEdit(field.key)}
                  leftIcon={<EditIcon />}
                >
                  Sửa
                </Button>
              </Flex>
            )}
          </Box>
        );
    }
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
              <Box
                position="relative"
                role="group"
                cursor={isLoading ? 'not-allowed' : 'pointer'}
                opacity={isLoading ? 0.6 : 1}
                onClick={() =>
                  !isLoading && document.getElementById('avatarInput')?.click()
                }
              >
                <Avatar size="3xl" src={formValues.avatar} />

                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  w="full"
                  h="full"
                  bg="blackAlpha.600"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="full"
                  transition="opacity 0.3s ease"
                  opacity={isLoading ? 1 : 0}
                  pointerEvents="none"
                >
                  {isLoading ? (
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="white"
                      size="xl"
                    />
                  ) : (
                    <Icon
                      as={MdAddPhotoAlternate}
                      w={10}
                      h={10}
                      color="white"
                    />
                  )}
                </Box>

                <Input
                  id="avatarInput"
                  type="file"
                  onChange={handleAvatarChange}
                  display="none"
                />
              </Box>

              {avatarError && (
                <Flex
                  mt={4}
                  p={3}
                  bg="red.50"
                  border="1px solid"
                  borderColor="red.300"
                  borderRadius="md"
                  color="red.700"
                  fontSize="sm"
                  align="center"
                  justify="center"
                  boxShadow="sm"
                  gap={2}
                >
                  <Text textAlign="center">{avatarError}</Text>
                </Flex>
              )}
            </Flex>

            <Divider
              orientation="vertical"
              height="100%"
              borderColor="gray.300"
            />
            <Box w="100%">
              <VStack align="stretch" gap={0}>
                {initialFields.map(renderEditableField)}
              </VStack>
            </Box>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
