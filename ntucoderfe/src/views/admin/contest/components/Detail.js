import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  VStack,
  Flex,
  SimpleGrid,
  Link,
  Button,
  Input,
  IconButton,
  useToast,
  Select,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdOutlineArrowBack, MdEdit } from 'react-icons/md';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from 'utils/api';
import moment from 'moment-timezone';
import FullPageSpinner from 'components/spinner/FullPageSpinner';

const ContestDetail = () => {
  const { id } = useParams();
  const [contestDetail, setContestDetail] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editableValues, setEditableValues] = useState({});
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchContestDetail = async () => {
      try {
        const response = await api.get(`/Contest/${id}`);
        setContestDetail(response.data);
        setEditableValues(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết cuộc thi:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thông tin cuộc thi.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchContestDetail();
  }, [id]);

  const utcToLocalDatetime = (utcTime) => {
    if (!utcTime) return '';
    return moment.utc(utcTime).local().format('YYYY-MM-DDTHH:mm');
  };

  const localDatetimeToUtc = (localTime) => {
    if (!localTime) return null;
    return moment(localTime).utc().format();
  };

  const handleEdit = (field) => {
    if (editField && editField !== field) {
      setContestDetail((prev) => ({
        ...prev,
        [editField]: editableValues[editField],
      }));
    }
    setEditField(field);
  };

  const handleInputChange = (field, value) => {
    if (['startTime', 'endTime', 'frozenTime'].includes(field)) {
      const utcValue = localDatetimeToUtc(value);
      setEditableValues((prev) => ({ ...prev, [field]: utcValue }));
      setContestDetail((prev) => ({ ...prev, [field]: utcValue }));
    } else {
      setEditableValues((prev) => ({ ...prev, [field]: value }));
      setContestDetail((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    try {
      await api.put(`/Contest/${id}`, editableValues, {
        headers: { 'Content-Type': 'application/json' },
      });

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
      let errorMessage =
        'Đã xảy ra lỗi khi cập nhật. Vui lòng kiểm tra lại thông tin.';

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

  if (!contestDetail) {
    return <FullPageSpinner />;
  }

  // Hàm định dạng hiển thị thời gian
  const formatDisplayTime = (time) => {
    if (!time) return 'Chưa có';
    return moment.utc(time).local().format('DD/MM/YYYY HH:mm');
  };

  return (
    <Box pt="100px" px="25px">
      <Box maxW="1000px" mx="auto">
        <Flex justifyContent="space-between" mb={6}>
          <Button
            leftIcon={<MdOutlineArrowBack />}
            colorScheme="blue"
            onClick={() => navigate(`/admin/contest`)}
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

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {/* Cột bên trái */}
          <Card>
            <CardHeader>
              <Text fontSize="xl" fontWeight="bold">
                Thông tin chung
              </Text>
            </CardHeader>
            <CardBody>
              {['contestName', 'startTime', 'endTime', 'frozenTime'].map(
                (field) => (
                  <Flex
                    key={field}
                    justify="space-between"
                    align="center"
                    mb={3}
                  >
                    <Text fontWeight="bold">
                      {field === 'contestName'
                        ? 'Tên cuộc thi'
                        : field === 'startTime'
                        ? 'Thời gian bắt đầu'
                        : field === 'endTime'
                        ? 'Thời gian kết thúc'
                        : 'Thời gian đóng băng'}
                      :
                    </Text>
                    {editField === field ? (
                      <Input
                        type={
                          field.includes('Time') ? 'datetime-local' : 'text'
                        }
                        value={
                          field === 'contestName'
                            ? editableValues[field] || ''
                            : field.includes('Time')
                            ? utcToLocalDatetime(editableValues[field])
                            : editableValues[field] || ''
                        }
                        onChange={(e) =>
                          handleInputChange(field, e.target.value)
                        }
                        w="60%"
                      />
                    ) : (
                      <Text>
                        {field.includes('Time')
                          ? formatDisplayTime(contestDetail[field])
                          : contestDetail[field] || 'Chưa có'}
                      </Text>
                    )}
                    <IconButton
                      aria-label="Edit"
                      icon={<MdEdit />}
                      size="sm"
                      onClick={() => handleEdit(field)}
                    />
                  </Flex>
                ),
              )}

              <Flex justify="space-between" align="center" mb={3}>
                <Text fontWeight="bold">Quá trình xếp hạng:</Text>

                {editField === 'rankingFinished' ? (
                  <Select
                    value={editableValues.rankingFinished ?? ''}
                    onChange={(e) =>
                      handleInputChange('rankingFinished', e.target.value)
                    }
                    w="60%"
                  >
                    <option value="0">Chưa hoàn thành</option>
                    <option value="1">Hoàn thành</option>
                  </Select>
                ) : (
                  <Text>
                    {contestDetail.rankingFinished == '1'
                      ? 'Hoàn thành'
                      : 'Chưa hoàn thành'}
                  </Text>
                )}

                <IconButton
                  aria-label="Edit"
                  icon={<MdEdit />}
                  size="sm"
                  onClick={() => handleEdit('rankingFinished')}
                />
              </Flex>
            </CardBody>
          </Card>

          {/* Cột bên phải */}
          <Card>
            <CardHeader>
              <Text fontSize="xl" fontWeight="bold">
                Chi tiết cuộc thi
              </Text>
            </CardHeader>
            <CardBody>
              <Flex justify="space-between" align="center" mb={3}>
                <Text fontWeight="bold">Hình thức kiểm tra:</Text>
                {editField === 'ruleType' ? (
                  <Select
                    value={editableValues.ruleType ?? ''}
                    onChange={(e) =>
                      handleInputChange('ruleType', e.target.value)
                    }
                    w="60%"
                  >
                    <option value="ACM Rule">ACM Rule</option>
                    <option value="Codeforces Rule">Codeforces Rule</option>
                  </Select>
                ) : (
                  <Text>{contestDetail.ruleType || 'Chưa có'}</Text>
                )}
                <IconButton
                  aria-label="Edit"
                  icon={<MdEdit />}
                  size="sm"
                  onClick={() => handleEdit('ruleType')}
                />
              </Flex>
              <Flex justify="space-between" align="center" mb={3}>
                <Text fontWeight="bold">Thời lượng:</Text>
                {editField === 'duration' ? (
                  <Input
                    type="number"
                    value={editableValues.duration || ''}
                    onChange={(e) =>
                      handleInputChange('duration', e.target.value)
                    }
                    w="60%"
                  />
                ) : (
                  <Text>{contestDetail.duration || 'Chưa có'}</Text>
                )}
                <IconButton
                  aria-label="Edit"
                  icon={<MdEdit />}
                  size="sm"
                  onClick={() => handleEdit('duration')}
                />
              </Flex>

              <Flex justify="space-between" align="center" mb={3}>
                <Text fontWeight="bold">Hình phạt:</Text>
                {editField === 'failedPenalty' ? (
                  <Input
                    type="number"
                    value={editableValues.failedPenalty || ''}
                    onChange={(e) =>
                      handleInputChange('failedPenalty', e.target.value)
                    }
                    w="60%"
                  />
                ) : (
                  <Text>{contestDetail.failedPenalty || 'Chưa có'}</Text>
                )}
                <IconButton
                  aria-label="Edit"
                  icon={<MdEdit />}
                  size="sm"
                  onClick={() => handleEdit('failedPenalty')}
                />
              </Flex>

              <Flex justify="space-between" align="center" mb={3}>
                <Text fontWeight="bold">Người tạo:</Text>
                <Text>{contestDetail.coderName || 'Chưa có'}</Text>
              </Flex>

              <Flex justify="space-between" align="center" mb={3}>
                <Text fontWeight="bold">Trạng thái:</Text>
                <Text>
                  {contestDetail.published === 1 ? 'Công khai' : 'Riêng tư'}
                </Text>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text fontWeight="bold">Tình trạng:</Text>
                <Text
                  fontWeight="bold"
                  color={
                    contestDetail.status === 0
                      ? 'red.500'
                      : contestDetail.status === 1
                      ? 'green.500'
                      : contestDetail.status === 2
                      ? 'blue.500'
                      : 'gray.500'
                  }
                >
                  {contestDetail.status === 0
                    ? 'Đã kết thúc'
                    : contestDetail.status === 1
                    ? 'Đang diễn ra'
                    : contestDetail.status === 2
                    ? 'Sắp diễn ra'
                    : 'Không xác định'}
                </Text>
              </Flex>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Mô tả cuộc thi */}
        <Card mt={6}>
          <CardHeader>
            <Flex align="center">
              <Text fontSize="xl" fontWeight="bold">
                Mô tả cuộc thi
              </Text>
              <IconButton
                aria-label="Edit"
                icon={<MdEdit />}
                size="sm"
                ml={2}
                onClick={() => handleEdit('contestDescription')}
              />
            </Flex>
          </CardHeader>
          <CardBody>
            {editField === 'contestDescription' ? (
              <ReactQuill
                theme="snow"
                value={editableValues.contestDescription || ''}
                onChange={(value) =>
                  handleInputChange('contestDescription', value)
                }
                style={{
                  minHeight: '300px',
                  maxHeight: '300px',
                  overflow: 'auto',
                }}
              />
            ) : (
              <Box
                p={2}
                minH={editField === 'contestDescription' ? '300px' : 'unset'}
                dangerouslySetInnerHTML={{
                  __html: contestDetail.contestDescription || 'Chưa có',
                }}
              />
            )}
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
};

export default ContestDetail;
