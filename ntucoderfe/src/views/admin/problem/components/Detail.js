import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Link,
  Button,
  Input,
  IconButton,
  useToast,
  Select,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import ReactQuill from 'react-quill'; 
import api from "utils/api";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBack, MdEdit } from "react-icons/md";

const ProblemDetail = () => {
  const { id } = useParams();
  const [problemDetail, setProblemDetail] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editableValues, setEditableValues] = useState({});
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchProblemDetail = async () => {
      try {
        const response = await api.get(`/Problem/${id}`);
        setProblemDetail(response.data);
        setEditableValues(response.data);
      } catch (error) {
        console.error("Đã xảy ra lỗi", error);
      }
    };

    if (id) {
      fetchProblemDetail();
    }
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
    try {
      const formData = new FormData();
      formData.append("ProblemID", id);
      Object.keys(editableValues).forEach((field) => {
        if (editableValues[field] !== problemDetail[field]) {
          formData.append(field, editableValues[field]);
        }
      });
      await api.put(`/Problem/${id}`, editableValues, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setProblemDetail((prev) => ({
        ...prev,
        ...editableValues,
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
      const errorMessage = error.response?.data?.errors;
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((msg, index) => {
          toast({
            title: "Lỗi khi cập nhật.",
            description: msg,
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
            key: index,
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
              colorScheme="messenger"
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
                <FormControl>
                  <FormLabel fontWeight="bold">Nội dung bài toán</FormLabel>
                  {editField === "problemContent" ? (
                    <ReactQuill value={editableValues.problemContent} onChange={(value) => handleInputChange("problemContent", value)} style={{ height: "300px" }} />
                  ) : (
                    <Box p={2} dangerouslySetInnerHTML={{ __html: problemDetail.problemContent || "Chưa có thông tin" }} />
                  )}
                  <IconButton aria-label="Edit" icon={<MdEdit />} ml={2} size="sm" onClick={() => handleEdit("problemContent")} />
                </FormControl>

                <Flex align="center">
                  <Text fontSize="lg" fontWeight="bold">Giải thích:</Text>
                </Flex>
                <Box
                  p={2}
                  dangerouslySetInnerHTML={{ __html: problemDetail.problemExplanation || "Chưa có thông tin" }}
                />

                <Flex align="center">
                  <Text fontSize="lg">
                    <strong>Hình thức kiểm tra:</strong>{" "}
                    {problemDetail.testType || "Chưa có thông tin"}
                  </Text>
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
                    <strong>Trạng thái xuất bản:</strong>{" "}
                    {problemDetail.published === 0 ? "Chưa xuất bản" : "Đã xuất bản"}
                  </Text>
                </Flex>

                <Flex align="center">
                  <Text fontSize="lg">
                    <strong>Trình biên dịch:</strong>{" "}
                    {problemDetail.testCompilerName || "Chưa có thông tin"}
                  </Text>
                </Flex>

                <Flex align="center">
                  <Text fontSize="lg">
                    <strong>Thể loại:</strong>{" "}
                    {problemDetail.selectedCategoryNames &&
                    problemDetail.selectedCategoryNames.length > 0
                      ? problemDetail.selectedCategoryNames.join(", ")
                      : "Chưa có danh mục"}
                  </Text>
                </Flex>
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
