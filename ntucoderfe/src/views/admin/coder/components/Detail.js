import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  VStack,
  Divider,
  Flex,
  Grid,
  GridItem,
  Link,
  Button,
  Image,
  Input,
  IconButton,
  useToast,
  Select,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import moment from 'moment-timezone';
import api from 'utils/api';
import { useNavigate } from 'react-router-dom';
import { MdOutlineArrowBack, MdEdit } from 'react-icons/md';
import FullPageSpinner from 'components/spinner/FullPageSpinner';

const genderMapping = {
  0: 'Nam', // Male
  1: 'Nữ', // Female
  2: 'Khác', // Other
};
const roleMapping = {
  1: 'Admin',
  2: 'Người dùng',
  3: 'Quản lý',
};

const CoderDetail = () => {
  const { id } = useParams();
  const [coderDetail, setCoderDetail] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editableValues, setEditableValues] = useState({});
  const navigate = useNavigate();
  const toast = useToast();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCoderDetail = async () => {
      try {
        const response = await api.get(`/Coder/${id}`);
        setCoderDetail(response.data);
        setEditableValues(response.data);
      } catch (error) {
        console.error('Đã xảy ra lỗi', error);
      }
    };

    if (id) {
      fetchCoderDetail();
    }
  }, [id]);

  const handleEdit = (field) => {
    if (editField && editField !== field) {
      setCoderDetail((prev) => ({
        ...prev,
        [editField]: editableValues[editField],
      }));
    }
    setEditField(field);
  };

  const handleInputChange = (field, value) => {
    setEditableValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('AvatarFile', file);

    try {
      const response = await api.put(`/Coder/avatar/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newAvatarUrl = response.data?.avatarUrl;
      if (!newAvatarUrl) {
        throw new Error('Không nhận được đường dẫn avatar mới từ server.');
      }
      setEditableValues((prev) => ({ ...prev, avatar: newAvatarUrl }));
      setCoderDetail((prev) => ({ ...prev, Avatar: newAvatarUrl }));

      toast({
        title: 'Cập nhật avatar thành công!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      console.error('Đã xảy ra lỗi khi cập nhật avatar', error);
      toast({
        title: 'Đã xảy ra lỗi khi cập nhật avatar.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };
  const handleSave = async () => {
    try {
      await api.put(`/Coder/${id}`, editableValues, {
        headers: { 'Content-Type': 'application/json' },
      });
      setCoderDetail((prev) => ({
        ...prev,
        ...editableValues,
      }));

      setEditField(null);
      toast({
        title: 'Cập nhật thành công!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      let errorMessage = 'Đã xảy ra lỗi khi cập nhật.';

      if (error.response && error.response.data && error.response.data.errors) {
        errorMessage = error.response.data.errors.join('\n');
      }

      toast({
        title: 'Lỗi cập nhật',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };
  if (!coderDetail) {
    return <FullPageSpinner />;
  }
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }} px="25px">
      <Box
        bg="white"
        p="8"
        borderRadius="xl"
        boxShadow="2xl"
        maxW="1000px"
        mx="auto"
        border="1px solid #e2e8f0"
      >
        <Flex mb="6" justify="space-between" align="center">
          <Button
            variant="ghost"
            leftIcon={<MdOutlineArrowBack />}
            onClick={() => navigate(`/admin/coder`)}
          >
            Quay lại
          </Button>
          <Button
            colorScheme="teal"
            onClick={handleSave}
            disabled={editField === null}
          >
            Lưu thay đổi
          </Button>
        </Flex>

        <Flex direction={{ base: 'column', md: 'row' }} gap={10}>
          {/* Avatar */}
          <VStack spacing={4} align="center">
            <Box position="relative">
              <Image
                src={
                  editableValues.avatar ||
                  coderDetail.Avatar ||
                  'https://firebasestorage.googleapis.com/v0/b/luvuphuc-firebase-790e8.appspot.com/o/ntucoder%2Favatars%2Fdefault.jpg?alt=media'
                }
                alt="Avatar"
                borderRadius="full"
                boxSize="150px"
                objectFit="cover"
                border="4px solid"
                borderColor="gray.200"
                cursor="pointer"
                onClick={() => document.getElementById('avatarInput').click()}
              />
              <Input
                id="avatarInput"
                type="file"
                onChange={handleAvatarChange}
                display="none"
              />
            </Box>
            <Text fontSize="md" color="gray.500">
              Nhấn để thay đổi ảnh đại diện
            </Text>
          </VStack>

          <VStack align="stretch" spacing={5} flex="1">
            <Flex align="center" gap={2}>
              <Text fontSize="md" w="150px">
                <strong>Tên đăng nhập:</strong>
              </Text>
              <Text flex="1">{coderDetail.userName}</Text>
            </Flex>

            {['coderName', 'coderEmail', 'phoneNumber'].map((field) => (
              <FormControl key={field} isInvalid={errors[field]}>
                <Flex align="center" gap={2}>
                  <Text fontSize="md" w="150px">
                    <strong>
                      {field === 'coderName'
                        ? 'Họ và tên'
                        : field === 'coderEmail'
                        ? 'Email'
                        : 'Số điện thoại'}
                      :
                    </strong>
                  </Text>
                  {editField === field ? (
                    <Input
                      value={editableValues[field] || ''}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      placeholder={`Nhập ${field}`}
                    />
                  ) : (
                    <Text flex="1">
                      {editableValues[field] || 'Chưa có thông tin'}
                    </Text>
                  )}
                  <IconButton
                    aria-label="Chỉnh sửa"
                    icon={<MdEdit />}
                    size="sm"
                    onClick={() => handleEdit(field)}
                  />
                </Flex>
                <FormErrorMessage>{errors[field]}</FormErrorMessage>
              </FormControl>
            ))}

            {/* Gender */}
            <Flex align="center" gap={2}>
              <Text fontSize="md" w="150px">
                <strong>Giới tính:</strong>
              </Text>
              {editField === 'gender' ? (
                <Select
                  value={editableValues.gender ?? ''}
                  onChange={(e) => {
                    handleInputChange('gender', parseInt(e.target.value));
                  }}
                  maxW="200px"
                >
                  <option value="0">Nam</option>
                  <option value="1">Nữ</option>
                  <option value="2">Khác</option>
                </Select>
              ) : (
                <Text flex="1">
                  {genderMapping[coderDetail.gender] || 'Khác'}
                </Text>
              )}
              <IconButton
                aria-label="Chỉnh sửa"
                icon={<MdEdit />}
                size="sm"
                onClick={() => handleEdit('gender')}
              />
            </Flex>
            <Flex align="center" gap={2}>
              <Text fontSize="md" w="150px">
                <strong>Quyền:</strong>
              </Text>
              {editField === 'roleID' ? (
                <Select
                  value={editableValues.roleID || ''}
                  onChange={(e) => {
                    handleInputChange('roleID', parseInt(e.target.value));
                  }}
                  maxW="200px"
                >
                  <option value="1">Admin</option>
                  <option value="2">Người dùng</option>
                  <option value="3">Quản lý</option>
                </Select>
              ) : (
                <Text flex="1">
                  {roleMapping[coderDetail.roleID] || 'Không xác định'}
                </Text>
              )}
              <IconButton
                aria-label="Chỉnh sửa quyền"
                icon={<MdEdit />}
                size="sm"
                onClick={() => handleEdit('roleID')}
              />
            </Flex>

            {/* Description */}
            <Flex align="center" gap={2}>
              <Text fontSize="md" w="150px">
                <strong>Mô tả:</strong>
              </Text>
              {editField === 'description' ? (
                <Input
                  value={editableValues.description || ''}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder="Nhập mô tả"
                />
              ) : (
                <Text flex="1">
                  {coderDetail.description || 'Chưa có thông tin'}
                </Text>
              )}
              <IconButton
                aria-label="Chỉnh sửa"
                icon={<MdEdit />}
                size="sm"
                onClick={() => handleEdit('description')}
              />
            </Flex>
          </VStack>
        </Flex>

        {/* Metadata */}
        <Divider my="8" />
        <Box
          p={4}
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          bg="gray.50"
        >
          <VStack spacing={3} align="stretch">
            <Text>
              <strong>Ngày tạo:</strong>{' '}
              {moment
                .utc(coderDetail.createdAt)
                .tz('Asia/Ho_Chi_Minh')
                .format('DD/MM/YYYY HH:mm:ss')}
            </Text>
            <Text>
              <strong>Người tạo:</strong> {coderDetail.createdBy}
            </Text>
            {coderDetail.updatedAt && (
              <>
                <Text>
                  <strong>Ngày cập nhật:</strong>{' '}
                  {moment
                    .utc(coderDetail.updatedAt)
                    .tz('Asia/Ho_Chi_Minh')
                    .format('DD/MM/YYYY HH:mm:ss')}
                </Text>
                <Text>
                  <strong>Người cập nhật:</strong> {coderDetail.updatedBy}
                </Text>
              </>
            )}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default CoderDetail;
