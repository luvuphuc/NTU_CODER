import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import api from "utils/api";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBack, MdEdit } from "react-icons/md";
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';
import Editor from "@monaco-editor/react";
const ProblemDetail = () => {
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [problemDetail, setProblemDetail] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editableValues, setEditableValues] = useState({});
  const navigate = useNavigate();
  const toast = useToast();
  const testTypeMapping = {
    "Output Matching" : "Output Matching",
    "Validate Output" : "Validate Output"
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
          api.get("/Compiler/all"),
          api.get("/Category/all"),
        ]);
        setProblemDetail(problemRes.data);
        setEditableValues(problemRes.data);
        setCompilers(Array.isArray(compilerRes.data.data) ? compilerRes.data.data : []);
        const sortedCategories = Array.isArray(categoryRes.data.data)
          ? categoryRes.data.data.sort((a, b) => a.catOrder - b.catOrder)
          : [];
        setCategories(sortedCategories);
        if (compilerRes.data.data.length > 0) {
          setTestCompilerID(compilerRes.data.data[0].compilerID); 
        }
      } catch (error) {
        console.error("Đã xảy ra lỗi", error);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleEdit = (field) => {
    setEditField(field);
  };

  const handleInputChange = (field, value) => {
    setEditableValues((prev) => {
      const updatedValues = { ...prev, [field]: value };
      setProblemDetail((prevProblemDetail) => ({
        ...prevProblemDetail,
        [field]: value,
      }));
      return updatedValues;
    });
  };

  const handleSave = async () => {
    setErrors({});
    const { problemCode, problemName, timeLimit, memoryLimit, problemContent, problemExplanation, testCode, testCompilerID } = editableValues;
    const inputs = { problemCode, problemName, timeLimit, memoryLimit, problemContent, problemExplanation, testCode, testCompilerID, selectedCategoryIDs };
    
    const newErrors = {};
    const problemCodeRegex = /^[A-Za-z0-9]+$/;
  
    // Kiểm tra problemCode
    if (!problemCode.match(problemCodeRegex)) {
      newErrors.problemCode = "Mã bài toán chỉ chấp nhận chữ và số.";
    }
  
    // Kiểm tra timeLimit và memoryLimit
    if (parseFloat(timeLimit) <= 0) {
      newErrors.timeLimit = "Giới hạn thời gian phải lớn hơn 0.";
    }
    if (parseFloat(memoryLimit) <= 0) {
      newErrors.memoryLimit = "Giới hạn bộ nhớ phải lớn hơn 0.";
    }
  
    // Kiểm tra không bỏ trống
    Object.keys(inputs).forEach((key) => {
      if (!inputs[key] || (Array.isArray(inputs[key]) && inputs[key].length === 0)) {
        newErrors[key] = "Không được bỏ trống.";
      }
    });
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.values(newErrors).forEach((msg) => {
        toast({
          title: "Lỗi xác thực",
          description: msg,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
      return;
    }
  
    try {
      const updatedValues = { ...editableValues, selectedCategoryIDs };
      await api.put(`/Problem/${id}`, updatedValues, {
        headers: { "Content-Type": "application/json" },
      });
  
      setProblemDetail((prev) => ({
        ...prev,
        ...editableValues,
        testCompilerName: compilers.find((c) => c.compilerID == testCompilerID)?.compilerName || prev.testCompilerName,
        selectedCategoryNames: categories
          .filter((cat) => selectedCategoryIDs.includes(cat.categoryID))
          .map((cat) => cat.catName),
      }));
  
      setEditField(null);
      toast({
        title: "Cập nhật thành công!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      
      if (error.response && error.response.data.errors) {
        const errorMessages = error.response.data.errors;
        const newErrors = {};
        
        if (errorMessages.some((errorMessage) => errorMessage.includes('Mã bài tập'))) {
          newErrors.problemCode = errorMessages.find((errorMessage) => errorMessage.includes('Mã bài tập'));
        }
  
        setErrors(newErrors);
        Object.values(newErrors).forEach((msg) => {
          toast({
            title: "Lỗi khi cập nhật.",
            description: msg,
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        });
      } else {
        toast({
          title: "Đã xảy ra lỗi khi cập nhật.",
          description: "Vui lòng kiểm tra lại thông tin.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    }
  };
  
  
  if (!problemDetail) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px="25px">
      <Box
        bg="white"
        p="6"
        borderRadius="lg"
        boxShadow="lg"
        maxW="1000px"
        mx="auto"
        border="1px solid #e2e8f0"
      >
        <Flex mb="8px" justifyContent="end" align="end" px="25px">
          <Link>
            <Button
              variant="solid"
              size="lg"
              colorScheme="blue"
              borderRadius="md"
              onClick={() => navigate(`/admin/problem`)}
            >
              Quay lại <MdOutlineArrowBack />
            </Button>
          </Link>
        </Flex>

        <VStack spacing={6} align="stretch">
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {/* Left Column */}
            <GridItem>
              <VStack align="stretch" spacing={4}>
                {["problemCode", "problemName", "timeLimit","memoryLimit"].map((field) => (
                  <Flex key={field} align="center">
                    {editField === field ? (
                      <Input
                        value={editableValues[field] || ""}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        placeholder={`Chỉnh sửa ${field}`}
                      />
                    ) : (
                      <Text fontSize="lg">
                        <strong>{field === "problemCode"
                          ? "Mã bài tập"
                          : field === "problemName"
                          ? "Tên bài tập"
                          : field === "timeLimit"
                          ? "Thời gian giới hạn"
                          : "Bộ nhớ giới hạn"}:</strong>{" "}
                        {problemDetail[field] || "Chưa có thông tin"}
                      </Text>
                    )}
                    <IconButton
                      aria-label="Edit"
                      icon={<MdEdit />}
                      ml={2}
                      size="sm"
                      onClick={() => handleEdit(field)}
                      cursor="pointer"
                    />
                  </Flex>
                ))}
                <Flex align="center">
                  <Text fontSize="lg" fontWeight="bold">Nội dung:</Text>
                  <IconButton
                    aria-label="Edit"
                    icon={<MdEdit />}
                    ml={2}
                    size="sm"
                    onClick={() => handleEdit("problemContent")}
                    cursor="pointer"
                  />
                </Flex>
                {editField === "problemContent" ? (
                  <ReactQuill
                    theme="snow"
                    value={editableValues.problemContent || ""}
                    onChange={(value) => handleInputChange("problemContent", value)}
                  />
                ) : (
                  <Box p={2} dangerouslySetInnerHTML={{ __html: problemDetail.problemContent || "Chưa có thông tin" }} />
                )}

                <Flex align="center">
                  <Text fontSize="lg" fontWeight="bold">Giải thích:</Text>
                  <IconButton
                    aria-label="Edit"
                    icon={<MdEdit />}
                    ml={2}
                    size="sm"
                    onClick={() => handleEdit("problemExplanation")}
                    cursor="pointer"
                  />
                </Flex>
                {editField === "problemExplanation" ? (
                  <ReactQuill
                    theme="snow"
                    value={editableValues.problemExplanation || ""}
                    onChange={(value) => handleInputChange("problemExplanation", value)}
                  />
                ) : (
                  <Box p={2} dangerouslySetInnerHTML={{ __html: problemDetail.problemExplanation || "Chưa có thông tin" }} />
                )}
                <Flex align="center">
                  {editField === "testType" ? (
                    <Select
                      value={editableValues.testType || problemDetail.testType || ""}
                      onChange={(e) => handleInputChange("testType", e.target.value)}
                      placeholder="Chọn hình thức kiểm tra"
                      width="50%"
                    >
                      <option value="Output Matching">Output Matching</option>
                      <option value="Validate Output">Validate Output</option>
                    </Select>
                  ) : (
                    <Text fontSize="lg">
                      <strong>Hình thức kiểm tra:</strong>{" "}
                      {testTypeMapping[problemDetail.testType] || "Không xác định"}
                    </Text>
                  )}
                  <IconButton
                    aria-label="Edit"
                    icon={<MdEdit />}
                    ml={2}
                    size="sm"
                    onClick={() => handleEdit("testType")}
                    cursor="pointer"
                  />
                </Flex>

              </VStack>
            </GridItem>

            {/* Right Column */}
            <GridItem>
              <VStack align="stretch" spacing={4}>
                <Flex align="center">
                  <Text fontSize="lg">
                    <strong>Tên người tạo:</strong>{" "}
                    {problemDetail.coderName || "Chưa có thông tin"}
                  </Text>
                </Flex>

                <Flex align="center">
                  <Text fontSize="lg">
                    <strong>Trạng thái:</strong>{" "}
                    {problemDetail.published === 1 ? "Công khai" : "Riêng tư"}
                  </Text>
                </Flex>

                <Flex align="center">
                  {editField === "testCompiler" ? (
                    <Select value={testCompilerID} onChange={(e) => {
                      const newCompilerID = e.target.value;
                      setTestCompilerID(newCompilerID);
                      setEditableValues((prev) => ({ ...prev, testCompilerID: newCompilerID }));
                    }}>
                      {compilers.map((compiler) => (
                        <option key={compiler.compilerID} value={compiler.compilerID}>
                          {compiler.compilerName}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Text fontSize="lg"><strong>Trình biên dịch:</strong> {problemDetail.testCompilerName || "Chưa có thông tin"}</Text>
                  )}
                  <IconButton aria-label="Edit" icon={<MdEdit />} ml={2} size="sm" onClick={() => handleEdit("testCompiler")} />
                </Flex>

                <Flex align="center">
                  {editField === "selectedCategory" ? (
                    <SimpleGrid columns={2} spacing={2} w="full">
                      {categories.map((category) => (
                        <Checkbox
                          key={category.categoryID}
                          isChecked={selectedCategoryIDs.includes(category.categoryID)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategoryIDs([...new Set([...selectedCategoryIDs, category.categoryID])]);
                            } else {
                              setSelectedCategoryIDs(selectedCategoryIDs.filter((id) => id !== category.categoryID));
                            }
                          }}
                        >
                          {category.catName}
                        </Checkbox>
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Text fontSize="lg">
                      <strong>Thể loại:</strong>{" "}
                      {problemDetail.selectedCategoryNames?.length > 0
                        ? problemDetail.selectedCategoryNames.join(", ")
                        : "Chưa có danh mục"}
                    </Text>
                  )}
                  <IconButton
                    aria-label="Edit"
                    icon={<MdEdit />}
                    ml={2}
                    size="sm"
                    onClick={() => handleEdit("selectedCategory")}
                  />
                </Flex>
                <Flex align="center">
                  <Text fontSize="lg" fontWeight="bold">Code test:</Text>
                  <IconButton
                    aria-label="Edit"
                    icon={<MdEdit />}
                    ml={2}
                    size="sm"
                    onClick={() => handleEdit("testCode")}
                  />
                </Flex>

                {editField === "testCode" ? (
                  <Editor
                  height="400px"
                  language="cpp"
                  value={editableValues.testCode || ""}
                  onChange={(value) => handleInputChange("testCode", value)}
                  theme="vs"
                  options={{
                    selectOnLineNumbers: true,
                    minimap: { enabled: false },
                    lineNumbers: "on",
                    wordWrap: "on",
                    automaticLayout: true,
                  }}
                  />
                ) : (
                  <Box p={2} bg="gray.100" borderRadius="md" overflowX="auto">
                    <pre>
                      <code>{problemDetail.testCode || "Chưa có"}</code>
                    </pre>
                  </Box>
                )}
              </VStack>
            </GridItem>
          </Grid>

          <Flex justifyContent="flex-end" mt={6}>
            <Button
              variant="solid"
              size="lg"
              colorScheme="teal"
              borderRadius="md"
              onClick={handleSave}
              disabled={editField === null}
            >
              Lưu
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
};

export default ProblemDetail;
