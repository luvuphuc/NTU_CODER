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
import { useNavigate } from "react-router-dom";
import api from "utils/api";
import { MdOutlineArrowBack } from "react-icons/md";

export default function ProblemCreate() {
  const [problemCode, setProblemCode] = useState("");
  const [problemName, setProblemName] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [memoryLimit, setMemoryLimit] = useState("");
  const [testType, setTestType] = useState("OutputMatching");
  const [testCompilerID, setTestCompilerID] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [compilers, setCompilers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [code, setCode] = useState("");

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const compilerRes = await api.get("/Compiler");
        const categoryRes = await api.get("/Category/all");
  
        console.log("Categories API response:", categoryRes.data);
  
        setCompilers(compilerRes.data);
        const sortedCategories = Array.isArray(categoryRes.data.data) 
          ? categoryRes.data.data.sort((a, b) => a.catOrder - b.catOrder) 
          : [];
        setCategories(sortedCategories);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
    fetchData();
  }, []);
  
    

  const handleSubmit = async () => {
    try {
      await api.post("/Problem/create", {
        problemCode,
        problemName,
        timeLimit,
        memoryLimit,
        testType,
        testCompilerID,
        selectedCategories,
      });

      toast({
        title: "Thêm mới thành công!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      navigate("/admin/problem");
    } catch (error) {
      toast({
        title: "Đã xảy ra lỗi.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
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
            <FormControl isInvalid={errors.code} mb={4}>
              <FormLabel fontWeight="bold">Code<Text as="span" color="red.500"> *</Text></FormLabel>
              <Textarea 
                
                value={code}
                onChange={(e) => setCode(e.target.value)}
                size="md"
                minHeight="120px"
              />
              <FormErrorMessage>{errors.code}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            

            <FormControl mb={4}>
              <FormLabel fontWeight="bold">Loại kiểm thử</FormLabel>
              <Select value={testType} onChange={(e) => setTestType(e.target.value)}>
                <option value="OutputMatching">OutputMatching</option>
                <option value="VerifyOutput">VerifyOutput</option>
              </Select>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel fontWeight="bold">Trình biên dịch</FormLabel>
              <Select value={testCompilerID} onChange={(e) => setTestCompilerID(e.target.value)}>
                {compilers.map((compiler) => (
                  <option key={compiler.id} value={compiler.id}>{compiler.name}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel fontWeight="bold">Danh mục</FormLabel>
              <SimpleGrid columns={2} spacing={2} w="full">
                {Array.isArray(categories) &&
                  categories.map((category) => (
                    <Checkbox
                      key={category.categoryID}
                      isChecked={selectedCategories.includes(category.categoryID)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...new Set([...selectedCategories, category.categoryID])]);
                        } else {
                          setSelectedCategories(selectedCategories.filter((id) => id !== category.categoryID));
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
        <GridItem display="flex" justifyContent="center">
          <Button colorScheme="green" onClick={handleSubmit} borderRadius="md" width="50%" mt="30px">
            Thêm
          </Button>
        </GridItem>
      </Box>
    </Box>
  );
}
