import React, { useState, useEffect } from "react";
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
  VStack,
  FormErrorMessage,
  Grid,
  GridItem,
  Select,
  Checkbox,
  SimpleGrid,
  Textarea
} from "@chakra-ui/react";
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";
import api from "utils/api";
import { MdOutlineArrowBack } from "react-icons/md";
import Editor from "@monaco-editor/react";

export default function ProblemCreate() {
  const [problemCode, setProblemCode] = useState("");
  const [problemName, setProblemName] = useState("");
  const [timeLimit, setTimeLimit] = useState("1.00");
  const [memoryLimit, setMemoryLimit] = useState("128");
  const [testType, setTestType] = useState("OutputMatching");
  const [testCompilerID, setTestCompilerID] = useState("");
  const [note, setNote] = useState("");
  const [selectedCategoryIDs, setselectedCategoryIDs] = useState([]);
  const [errors, setErrors] = useState({});
  const [compilers, setCompilers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testCode, settestCode] = useState("");
  const [problemContent, setProblemContent] = useState("");
  const [problemExplanation, setProblemExplanation] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      try {
        const compilerRes = await api.get("/Compiler/all");
        const categoryRes = await api.get("/Category/all");
        setCompilers(Array.isArray(compilerRes.data.data) ? compilerRes.data.data : []);
        const sortedCategories = Array.isArray(categoryRes.data.data)
          ? categoryRes.data.data.sort((a, b) => a.catOrder - b.catOrder)
          : [];
        setCategories(sortedCategories);
        if (compilerRes.data.data.length > 0) {
          setTestCompilerID(compilerRes.data.data[0].compilerID); 
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await api.post("/Problem/create", {
        problemName,
        problemCode,
        timeLimit,
        memoryLimit,
        problemContent,
        problemExplanation,
        testType,
        testCode,
        testCompilerID,
        selectedCategoryIDs,
        note
      });
  
      console.log('Response:', response.data);
      toast({
        title: "Thêm mới thành công!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
  
      navigate("/admin/problem");
    } catch (error) {
      console.error("Error:", error);
  
      if (error.response && error.response.data.errors) {
        const errorMessages = error.response.data.errors;
        const newErrors = {};
        errorMessages.forEach((errorMessage) => {
          if (errorMessage.includes('Tên bài tập')) newErrors.problemName = errorMessage;
          if (errorMessage.includes('Mã bài tập')) newErrors.problemCode = errorMessage;
          if (errorMessage.includes('Giới hạn thời gian')) newErrors.timeLimit = errorMessage;
          if (errorMessage.includes('Giới hạn bộ nhớ')) newErrors.memoryLimit = errorMessage;
          if (errorMessage.includes('Nội dung')) newErrors.problemContent = errorMessage;
          if (errorMessage.includes('Giải thích bài tập')) newErrors.problemExplanation = errorMessage;
          if (errorMessage.includes('Mã kiểm tra')) newErrors.testCode = errorMessage;
          if (errorMessage.includes('Ghi chú')) newErrors.note = errorMessage;
        });
  
        setErrors(newErrors);
      } else {
        toast({
          title: "Đã xảy ra lỗi.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    }
  };
  
  
  

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px="25px">
      <Box bg="white" p="6" borderRadius="lg" boxShadow="lg" maxW="1000px" mx="auto">
        <Flex mb="8px" justifyContent="end" align="end" px="25px">
          <Link>
            <Button variant="solid" size="lg" colorScheme="messenger" borderRadius="md" onClick={() => navigate(`/admin/problem/`)}>
              Quay lại <MdOutlineArrowBack />
            </Button>
          </Link>
        </Flex>
        <Grid templateColumns="repeat(2, 1fr)" gap="6">
          <GridItem>
            <FormControl isInvalid={errors.problemCode} mb={4}>
              <FormLabel fontWeight="bold">Mã bài toán<Text as="span" color="red.500"> *</Text></FormLabel>
              <Input placeholder="Nhập mã bài toán" value={problemCode} onChange={(e) => setProblemCode(e.target.value)} />
              <FormErrorMessage>{errors.problemCode}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.problemName} mb={4}>
              <FormLabel fontWeight="bold">Tên bài toán<Text as="span" color="red.500"> *</Text></FormLabel>
              <Input placeholder="Nhập tên bài toán" value={problemName} onChange={(e) => setProblemName(e.target.value)} />
              <FormErrorMessage>{errors.problemName}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.timeLimit} mb={4}>
              <FormLabel fontWeight="bold">Giới hạn thời gian (ms)<Text as="span" color="red.500"> *</Text></FormLabel>
              <Input placeholder="Nhập giới hạn thời gian" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} />
              <FormErrorMessage>{errors.timeLimit}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.memoryLimit} mb={4}>
              <FormLabel fontWeight="bold">Giới hạn bộ nhớ (MB)<Text as="span" color="red.500"> *</Text></FormLabel>
              <Input placeholder="Nhập giới hạn bộ nhớ" value={memoryLimit} onChange={(e) => setMemoryLimit(e.target.value)} />
              <FormErrorMessage>{errors.memoryLimit}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.problemContent} mb="60px">
              <FormLabel fontWeight="bold">Nội dung bài toán<Text as="span" color="red.500"> *</Text></FormLabel>
              <ReactQuill 
                value={problemContent} 
                onChange={setProblemContent} 
                placeholder="Nhập nội dung bài toán" 
                style={{ height: '300px' }}
              />
              <FormErrorMessage mt="50px">{errors.problemContent}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.problemExplanation} mb={4}>
              <FormLabel fontWeight="bold">Giải thích bài toán<Text as="span" color="red.500"> *</Text></FormLabel>
              <ReactQuill 
                value={problemExplanation} 
                onChange={setProblemExplanation} 
                placeholder="Nhập giải thích bài toán" 
                style={{ height: '300px' }}
              />
              <FormErrorMessage mt="50px">{errors.problemExplanation}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            
            <FormControl mb={4}>
              <FormLabel fontWeight="bold">Loại kiểm thử <Text as="span" color="red.500"> *</Text></FormLabel>
              <Select value={testType} onChange={(e) => setTestType(e.target.value)}>
                <option value="OutputMatching">OutputMatching</option>
                <option value="VerifyOutput">VerifyOutput</option>
              </Select>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel fontWeight="bold">Trình biên dịch <Text as="span" color="red.500"> *</Text></FormLabel>
              <Select value={testCompilerID} onChange={(e) => setTestCompilerID(e.target.value)}>
                
                {compilers.map((compiler) => (
                  <option key={compiler.compilerID} value={compiler.compilerID}>
                    {compiler.compilerName}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isInvalid={errors.testCode} mb={4}>
              <FormLabel fontWeight="bold">Code<Text as="span" color="red.500"> *</Text></FormLabel>
              <div style={{ border: "2px solid #ccc", borderRadius: "8px", padding: "4px" }}>
              <Editor
                height="400px"
                language="cpp"
                value={testCode}
                onChange={(value) => settestCode(value)}
                theme="vs"
                options={{
                  selectOnLineNumbers: true,
                  minimap: { enabled: false },
                  lineNumbers: "on",
                  wordWrap: "on",
                  automaticLayout: true,
                }}
              />
              </div>
              

              <FormErrorMessage>{errors.testCode}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.note} mb={4}>
              <FormLabel fontWeight="bold">Ghi chú</FormLabel>
              <Input placeholder="Nhập ghi chú" value={note} onChange={(e) => setNote(e.target.value)} />
              <FormErrorMessage>{errors.note}</FormErrorMessage>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontWeight="bold">Danh mục</FormLabel>
              <SimpleGrid columns={2} spacing={2} w="full">
                {categories.map((category) => (
                  <Checkbox
                    key={category.categoryID}
                    isChecked={selectedCategoryIDs.includes(category.categoryID)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setselectedCategoryIDs([...new Set([...selectedCategoryIDs, category.categoryID])]);
                      } else {
                        setselectedCategoryIDs(selectedCategoryIDs.filter((id) => id !== category.categoryID));
                      }
                    }}
                  >
                    {category.catName}
                  </Checkbox>
                ))}
              </SimpleGrid>
            </FormControl>
          </GridItem>
        </Grid>
        <GridItem display="flex" marginTop="30px" justifyContent="center">
          <Button colorScheme="green" onClick={handleSubmit} borderRadius="md" width="50%" mt="30px">
            Thêm
          </Button>
        </GridItem>
      </Box>
    </Box>
  );
}
