import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Link,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
  FormErrorMessage,
  Grid,
  GridItem,
  Select,
  Switch,
} from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import api from 'config/api';
import { MdOutlineArrowBack } from 'react-icons/md';
import Editor from '@monaco-editor/react';
import Multiselect from 'multiselect-react-dropdown';

export default function ProblemCreate() {
  const [problemCode, setProblemCode] = useState('');
  const [problemName, setProblemName] = useState('');
  const [timeLimit, setTimeLimit] = useState('1.00');
  const [testType, setTestType] = useState('Output Matching');
  const [testCompilerID, setTestCompilerID] = useState('');
  const [note, setNote] = useState('');
  const [selectedCategoryIDs, setselectedCategoryIDs] = useState([]);
  const [errors, setErrors] = useState({});
  const [compilers, setCompilers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testCode, settestCode] = useState('');
  const [problemContent, setProblemContent] = useState('');
  const [problemExplanation, setProblemExplanation] = useState('');
  const [published, setPublished] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      try {
        const compilerRes = await api.get('/Compiler/all');
        const categoryRes = await api.get('/Category/all');
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
        console.error('Error:', error);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async () => {
    setErrors({});
    const inputs = {
      problemName,
      problemCode,
      timeLimit,
      problemContent,
      problemExplanation,
      testCode,
      testCompilerID,
      selectedCategoryIDs,
    };

    const newErrors = {};
    const problemCodeRegex = /^[A-Za-z0-9]+$/;
    if (!problemCode.match(problemCodeRegex)) {
      newErrors.problemCode = 'Mã bài toán chỉ chấp nhận chữ và số.';
    }
    if (parseFloat(timeLimit) <= 0) {
      newErrors.timeLimit = 'Giới hạn thời gian phải lớn hơn 0.';
    }
    Object.keys(inputs).forEach((key) => {
      if (
        !inputs[key] ||
        (Array.isArray(inputs[key]) && inputs[key].length === 0)
      ) {
        newErrors[key] = 'Không được bỏ trống.';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const response = await api.post('/Problem/create', {
        problemName,
        problemCode,
        timeLimit,
        problemContent,
        problemExplanation,
        testType,
        testCode,
        testCompilerID,
        selectedCategoryIDs,
        note,
        published,
      });

      toast({
        title: 'Thêm mới thành công!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });

      navigate('/admin/problem');
    } catch (error) {
      console.error('Error:', error);

      if (error.response && error.response.data.errors) {
        const errorMessages = error.response.data.errors;
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
      } else {
        toast({
          title: 'Đã xảy ra lỗi.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }} px="25px">
      <Box
        bg="white"
        p="6"
        borderRadius="lg"
        boxShadow="lg"
        maxW="1000px"
        mx="auto"
      >
        <Flex mb="8px" justifyContent="end" align="end" px="25px">
          <Link>
            <Button
              variant="solid"
              size="lg"
              colorScheme="blue"
              borderRadius="md"
              onClick={() => navigate(`/admin/problem/`)}
            >
              Quay lại <MdOutlineArrowBack />
            </Button>
          </Link>
        </Flex>
        <Grid templateColumns="repeat(2, 1fr)" gap="6">
          <GridItem>
            <FormControl isInvalid={errors.problemCode} mb={4}>
              <FormLabel fontWeight="bold">
                Mã bài toán
                <Text as="span" color="red.500">
                  {' '}
                  *
                </Text>
              </FormLabel>
              <Input
                placeholder="Nhập mã bài toán"
                value={problemCode}
                onChange={(e) => setProblemCode(e.target.value)}
              />
              <FormErrorMessage>{errors.problemCode}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.problemName} mb={4}>
              <FormLabel fontWeight="bold">
                Tên bài toán
                <Text as="span" color="red.500">
                  {' '}
                  *
                </Text>
              </FormLabel>
              <Input
                placeholder="Nhập tên bài toán"
                value={problemName}
                onChange={(e) => setProblemName(e.target.value)}
              />
              <FormErrorMessage>{errors.problemName}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.timeLimit} mb={4}>
              <FormLabel fontWeight="bold">
                Giới hạn thời gian (ms)
                <Text as="span" color="red.500">
                  {' '}
                  *
                </Text>
              </FormLabel>
              <Input
                placeholder="Nhập giới hạn thời gian"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
              />
              <FormErrorMessage>{errors.timeLimit}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.problemContent} mb="60px">
              <FormLabel fontWeight="bold">
                Nội dung bài toán
                <Text as="span" color="red.500">
                  {' '}
                  *
                </Text>
              </FormLabel>
              <ReactQuill
                value={problemContent}
                onChange={setProblemContent}
                placeholder="Nhập nội dung bài toán"
                style={{ height: '300px' }}
              />
              <FormErrorMessage mt="50px">
                {errors.problemContent}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.problemExplanation} mb={4}>
              <FormLabel fontWeight="bold">
                Giải thích bài toán
                <Text as="span" color="red.500">
                  {' '}
                  *
                </Text>
              </FormLabel>
              <ReactQuill
                value={problemExplanation}
                onChange={setProblemExplanation}
                placeholder="Nhập giải thích bài toán"
                style={{ height: '300px' }}
              />
              <FormErrorMessage mt="50px">
                {errors.problemExplanation}
              </FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl mb={4}>
              <FormLabel fontWeight="bold">
                Loại kiểm thử{' '}
                <Text as="span" color="red.500">
                  {' '}
                  *
                </Text>
              </FormLabel>
              <Select
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
              >
                <option value="Output Matching">Output Matching</option>
                <option value="Validate Output">Validate Output</option>
              </Select>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel fontWeight="bold">
                Trình biên dịch{' '}
                <Text as="span" color="red.500">
                  {' '}
                  *
                </Text>
              </FormLabel>
              <Select
                value={testCompilerID}
                onChange={(e) => setTestCompilerID(e.target.value)}
              >
                {compilers.map((compiler) => (
                  <option key={compiler.compilerID} value={compiler.compilerID}>
                    {compiler.compilerName}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isInvalid={errors.testCode} mb={4}>
              <FormLabel fontWeight="bold">
                Code
                <Text as="span" color="red.500">
                  {' '}
                  *
                </Text>
              </FormLabel>
              <div
                style={{
                  border: '2px solid #ccc',
                  borderRadius: '8px',
                  padding: '4px',
                }}
              >
                <Editor
                  height="400px"
                  language="cpp"
                  value={testCode}
                  onChange={(value) => settestCode(value)}
                  theme="vs"
                  options={{
                    selectOnLineNumbers: true,
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    automaticLayout: true,
                  }}
                />
              </div>

              <FormErrorMessage>{errors.testCode}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.note} mb={4}>
              <FormLabel fontWeight="bold">Ghi chú</FormLabel>
              <Input
                placeholder="Nhập ghi chú"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <FormErrorMessage>{errors.note}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.selectedCategoryIDs} mb={4}>
              <FormLabel fontWeight="bold">
                Danh mục
                <Text as="span" color="red.500">
                  {' '}
                  *
                </Text>
              </FormLabel>
              <Box
                position="relative"
                border="1px solid"
                borderColor={
                  errors.selectedCategoryIDs ? 'red.500' : 'gray.300'
                }
                borderRadius="md"
                px={3}
                py={2}
              >
                <Multiselect
                  showCheckbox={true}
                  options={categories}
                  displayValue="catName"
                  selectedValues={categories.filter((cat) =>
                    selectedCategoryIDs.includes(cat.categoryID),
                  )}
                  onSelect={(selectedList) => {
                    setselectedCategoryIDs(
                      selectedList.map((item) => item.categoryID),
                    );
                  }}
                  onRemove={(selectedList) => {
                    setselectedCategoryIDs(
                      selectedList.map((item) => item.categoryID),
                    );
                  }}
                  placeholder="Chọn danh mục"
                  style={{
                    multiselectContainer: {
                      color: 'black',
                    },
                    searchBox: {
                      border: 'none',
                      fontSize: '14px',
                      padding: '6px',
                      borderRadius: '6px',
                      outline: 'none',
                    },
                    inputField: {
                      margin: '5px',
                    },
                    chips: {
                      background: '#3182ce',
                      borderRadius: '12px',
                      padding: '5px 10px',
                      color: 'white',
                      fontSize: '13px',
                    },
                    optionContainer: {
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      zIndex: 10,
                      marginTop: '5px',
                      backgroundColor: 'white',
                      width: '100%',
                      border: '1px solid #cbd5e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      maxHeight: '250px',
                      overflowY: 'auto',
                    },
                    option: {
                      backgroundColor: 'white',
                      color: 'black',
                      padding: '8px',
                      borderBottom: '1px solid #e2e8f0',
                      cursor: 'pointer',
                    },
                    highlightOption: {
                      background: '#ebf8ff',
                    },
                  }}
                />
              </Box>
              <FormErrorMessage>{errors.selectedCategoryIDs}</FormErrorMessage>
            </FormControl>
            <FormControl display="flex" alignItems="center" mt={10}>
              <FormLabel htmlFor="status-switch" mb="0" fontWeight="bold">
                Công khai
              </FormLabel>
              <Switch
                id="status-switch"
                isChecked={published === 1}
                onChange={(e) => setPublished(e.target.checked ? 1 : 0)}
                colorScheme="blue"
              />
            </FormControl>
          </GridItem>
        </Grid>
        <GridItem display="flex" marginTop="30px" justifyContent="center">
          <Button
            colorScheme="green"
            onClick={handleSubmit}
            borderRadius="md"
            width="50%"
            mt="30px"
          >
            Thêm
          </Button>
        </GridItem>
      </Box>
    </Box>
  );
}
