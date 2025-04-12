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
  Input,
  IconButton,
  Checkbox,
  SimpleGrid,
  useToast,
  Select,
  Card,
  CardBody,
  CardHeader,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import api from 'utils/api';
import { useNavigate } from 'react-router-dom';
import { MdOutlineArrowBack, MdEdit } from 'react-icons/md';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Editor from '@monaco-editor/react';
import FullPageSpinner from 'components/spinner/FullPageSpinner';
const ProblemDetail = () => {
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [problemDetail, setProblemDetail] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editableValues, setEditableValues] = useState({});
  const navigate = useNavigate();
  const toast = useToast();
  const testTypeMapping = {
    'Output Matching': 'Output Matching',
    'Validate Output': 'Validate Output',
  };
  const [compilers, setCompilers] = useState([]);
  const [testCompilerID, setTestCompilerID] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIDs, setSelectedCategoryIDs] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemRes, compilerRes, categoryRes] = await Promise.all([
          api.get(`/Problem/${id}`),
          api.get('/Compiler/all'),
          api.get('/Category/all'),
        ]);
        setProblemDetail(problemRes.data);
        setEditableValues(problemRes.data);
        setCompilers(
          Array.isArray(compilerRes.data.data) ? compilerRes.data.data : [],
        );
        const sortedCategories = Array.isArray(categoryRes.data.data)
          ? categoryRes.data.data.sort((a, b) => a.catOrder - b.catOrder)
          : [];
        setCategories(sortedCategories);
        if (compilerRes.data.data.length > 0) {
          setTestCompilerID(compilerRes.data.data[0].compilerID);
        }
      } catch (error) {
        console.error('Đã xảy ra lỗi', error);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleEdit = (field) => {
    setEditField(field);
  };

  const handleInputChange = (field, value) => {
    setEditableValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setErrors({});
    const {
      problemCode,
      problemName,
      timeLimit,
      memoryLimit,
      problemContent,
      problemExplanation,
      testCode,
      testCompilerID,
    } = editableValues;
    const inputs = {
      problemCode,
      problemName,
      timeLimit,
      memoryLimit,
      problemContent,
      problemExplanation,
      testCode,
      testCompilerID,
      selectedCategoryIDs: selectedCategoryIDs || [],
    };

    const newErrors = {};
    const problemCodeRegex = /^[A-Za-z0-9]+$/;

    // Kiểm tra problemCode
    if (!problemCode.match(problemCodeRegex)) {
      newErrors.problemCode = 'Mã bài toán chỉ chấp nhận chữ và số.';
    }

    // Kiểm tra timeLimit và memoryLimit
    if (parseFloat(timeLimit) <= 0) {
      newErrors.timeLimit = 'Giới hạn thời gian phải lớn hơn 0.';
    }
    if (parseFloat(memoryLimit) <= 0) {
      newErrors.memoryLimit = 'Giới hạn bộ nhớ phải lớn hơn 0.';
    }

    // Kiểm tra không bỏ trống
    Object.keys(inputs).forEach((key) => {
      if (!inputs[key] && key !== 'selectedCategoryIDs') {
        newErrors[key] = 'Không được bỏ trống.';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.values(newErrors).forEach((msg) => {
        toast({
          title: 'Lỗi xác thực',
          description: msg,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      });
      return;
    }

    try {
      const updatedValues = {
        ...problemDetail,
        ...editableValues,
        selectedCategoryIDs,
      };
      await api.put(`/Problem/${id}`, updatedValues, {
        headers: { 'Content-Type': 'application/json' },
      });

      setProblemDetail((prev) => ({
        ...prev,
        ...editableValues,
        testCompilerName:
          compilers.find((c) => c.compilerID == testCompilerID)?.compilerName ||
          prev.testCompilerName,
        selectedCategoryNames: categories
          .filter((cat) => selectedCategoryIDs.includes(cat.categoryID))
          .map((cat) => cat.catName),
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

      if (error.response && error.response.data.errors) {
        const errorMessages = error.response.data.errors;
        console.log(error.response.data);
        const newErrors = {};

        if (
          errorMessages.some((errorMessage) =>
            errorMessage.includes('Mã bài tập'),
          )
        ) {
          newErrors.problemCode = errorMessages.find((errorMessage) =>
            errorMessage.includes('Mã bài tập'),
          );
        }

        setErrors(newErrors);
        Object.values(newErrors).forEach((msg) => {
          toast({
            title: 'Lỗi khi cập nhật.',
            description: msg,
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          });
        });
      } else {
        toast({
          title: 'Đã xảy ra lỗi khi cập nhật.',
          description: 'Vui lòng kiểm tra lại thông tin.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }
  };

  if (!problemDetail) {
    return <FullPageSpinner />;
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <Box pt="100px" px="25px">
      <Box maxW="1000px" mx="auto">
        <Flex justifyContent="space-between" mb={6}>
          <Button
            leftIcon={<MdOutlineArrowBack />}
            colorScheme="blue"
            onClick={() => navigate(`/admin/problem`)}
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
            <CardHeader mb={0} pb={0}>
              <Text fontSize="xl" fontWeight="bold">
                Thông tin chung
              </Text>
            </CardHeader>
            <CardBody>
              {['problemCode', 'problemName', 'timeLimit', 'memoryLimit'].map(
                (field) => (
                  <Flex
                    key={field}
                    justify="space-between"
                    align="center"
                    mb={3}
                  >
                    <Text fontWeight="bold">
                      {field === 'problemCode'
                        ? 'Mã bài tập'
                        : field === 'problemName'
                        ? 'Tên bài tập'
                        : field === 'timeLimit'
                        ? 'Thời gian giới hạn'
                        : 'Hạn mức bộ nhớ'}
                      :
                    </Text>
                    {editField === field ? (
                      <Input
                        type="text"
                        value={editableValues[field] || ''}
                        onChange={(e) =>
                          handleInputChange(field, e.target.value)
                        }
                        w="60%"
                        onKeyDown={handleKeyDown}
                      />
                    ) : (
                      <Text>{editableValues[field] || 'Chưa có'}</Text>
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
            </CardBody>
          </Card>

          {/* Cột bên phải */}
          <Card>
            <CardHeader mb={0} pb={0}>
              <Text fontSize="xl" fontWeight="bold">
                Chi tiết bài tập
              </Text>
            </CardHeader>
            <CardBody>
              <Flex justify="space-between" align="center" mb={3}>
                <Text fontWeight="bold">Hình thức kiểm tra:</Text>
                {editField === 'testType' ? (
                  <Select
                    value={editableValues.testType || ''}
                    onChange={(e) => {
                      handleInputChange('testType', e.target.value);
                      setTimeout(() => {
                        handleSave();
                      }, 0);
                    }}
                    onKeyDown={handleKeyDown}
                    w="60%"
                  >
                    {Object.entries(testTypeMapping).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Text>{editableValues.testType || 'Chưa có'}</Text>
                )}
                <IconButton
                  aria-label="Edit"
                  icon={<MdEdit />}
                  size="sm"
                  onClick={() => handleEdit('testType')}
                />
              </Flex>

              <Flex justify="space-between" align="center" mb={3}>
                <Text fontWeight="bold">Mã bài tập:</Text>
                <Text>{editableValues.problemCode || 'Chưa có'}</Text>
              </Flex>
              <Flex justify="space-between" align="center" mb={3}>
                <Text fontWeight="bold">Người tạo:</Text>
                <Text>{editableValues.coderName || 'Chưa có'}</Text>
              </Flex>
              <Flex justify="space-between" align="center" mb={3}>
                <Text fontWeight="bold">Trạng thái:</Text>
                <Text>
                  {editableValues.published === 1 ? 'Công khai' : 'Riêng tư'}
                </Text>
              </Flex>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Mô tả bài tập */}
        <Card mt={6}>
          <CardHeader mb={0} pb={0}>
            <Flex align="center">
              <Text fontSize="xl" fontWeight="bold">
                Mô tả bài tập
              </Text>
              <IconButton
                aria-label="Edit"
                icon={<MdEdit />}
                size="sm"
                ml={2}
                onClick={() => handleEdit('problemContent')}
              />
            </Flex>
          </CardHeader>
          <CardBody>
            {editField === 'problemContent' ? (
              <ReactQuill
                theme="snow"
                value={editableValues.problemContent || ''}
                onChange={(value) => handleInputChange('problemContent', value)}
                style={{
                  minHeight: '200px',
                  maxHeight: '200px',
                  overflow: 'auto',
                }}
              />
            ) : (
              <Box
                p={2}
                minH={editField === 'problemContent' ? '200px' : 'unset'}
                maxH="300px"
                overflowY="auto"
                dangerouslySetInnerHTML={{
                  __html: editableValues.problemContent || 'Chưa có',
                }}
              />
            )}
          </CardBody>
        </Card>

        <Card mt={6}>
          <CardHeader mb={0} pb={0}>
            <Flex align="center">
              <Text fontSize="xl" fontWeight="bold">
                Giải thích bài tập
              </Text>
              <IconButton
                aria-label="Edit"
                icon={<MdEdit />}
                size="sm"
                ml={2}
                onClick={() => handleEdit('problemExplanation')}
              />
            </Flex>
          </CardHeader>
          <CardBody>
            {editField === 'problemExplanation' ? (
              <ReactQuill
                theme="snow"
                value={editableValues.problemExplanation || ''}
                onChange={(value) =>
                  handleInputChange('problemExplanation', value)
                }
                style={{
                  minHeight: '200px',
                  maxHeight: '200px',
                  overflow: 'auto',
                }}
              />
            ) : (
              <Box
                p={2}
                minH={editField === 'problemExplanation' ? '200px' : 'unset'}
                dangerouslySetInnerHTML={{
                  __html: editableValues.problemExplanation || 'Chưa có',
                }}
              />
            )}
          </CardBody>
        </Card>

        {/* Mã kiểm tra (Code format) */}
        <Card mt={6}>
          <CardHeader mb={0} pb={0}>
            <Flex align="center">
              <Text fontSize="xl" fontWeight="bold">
                Mã kiểm tra
              </Text>
              <IconButton
                aria-label="Edit"
                icon={<MdEdit />}
                size="sm"
                ml={2}
                onClick={() => handleEdit('testCode')}
              />
            </Flex>
          </CardHeader>
          <CardBody>
            {editField === 'testCode' ? (
              <Editor
                height="300px"
                language="cpp"
                value={editableValues.testCode || ''}
                onChange={(value) => handleInputChange('testCode', value)}
                options={{
                  minimap: { enabled: false },
                  wordWrap: 'on',
                }}
              />
            ) : (
              <Box
                as="pre"
                p={2}
                minH={editField === 'testCode' ? '200px' : 'unset'}
                bg="gray.100"
                borderRadius="md"
                fontFamily="mono"
                dangerouslySetInnerHTML={{
                  __html: editableValues.testCode || 'Chưa có',
                }}
              />
            )}
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
};

export default ProblemDetail;
