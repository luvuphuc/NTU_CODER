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
  useToast,
  Select,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import moment from "moment-timezone";
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
        formData.append(field, editableValues[field]);
      });

      const response = await api.put(`/Problem/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
      let errorMessage = error.response.data.errors;
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
                <Flex align="center">
                  <Text fontSize="lg">
                    <strong>Mã bài tập:</strong> {problemDetail.problemCode || "Chưa có thông tin"}
                  </Text>
                </Flex>

                <Flex align="center">
                  <Text fontSize="lg">
                    <strong>Tên bài tập:</strong> {problemDetail.problemName || "Chưa có thông tin"}
                  </Text>
                </Flex>

                <Flex align="center">
                  <Text fontSize="lg">
                    <strong>Thời gian giới hạn:</strong> {problemDetail.timeLimit} giây
                  </Text>
                </Flex>

                <Flex align="center">
                  <Text fontSize="lg">
                    <strong>Giới hạn bộ nhớ:</strong> {problemDetail.memoryLimit} KB
                  </Text>
                </Flex>

                <Flex align="center">
                  <Text fontSize="lg">
                    <strong>Nội dung:</strong> {problemDetail.problemContent || "Chưa có thông tin"}
                  </Text>
                </Flex>

                <Flex align="center">
                  <Text fontSize="lg">
                    <strong>Giải thích:</strong> {problemDetail.problemExplanation || "Chưa có thông tin"}
                  </Text>
                </Flex>

                <Flex align="center">
                  <Text fontSize="lg">
                    <strong>Hình thức kiểm tra:</strong> {problemDetail.testType || "Chưa có thông tin"}
                  </Text>
                </Flex>
              </VStack>
            </GridItem>

            {/* Right Column */}
            <GridItem>
              <VStack align="stretch" spacing={4}>
                <Flex align="center">
                  <Text fontSize="lg">
                    <strong>Tên người tạo:</strong> {problemDetail.coderName || "Chưa có thông tin"}
                  </Text>
                </Flex>

                <Flex align="center">
                  <Text fontSize="lg">
                    <strong>Trạng thái xuất bản:</strong> {problemDetail.published === 0 ? "Chưa xuất bản" : "Đã xuất bản"}
                  </Text>
                </Flex>

                <Flex align="center">
                  <Text fontSize="lg">
                    <strong>Trình biên dịch:</strong> {problemDetail.testCompilerName || "Chưa có thông tin"}
                  </Text>
                </Flex>

                <Flex align="center">
                <Text fontSize="lg">
                  <strong>Thể loại:</strong>{" "}
                  {problemDetail.selectedCategoryNames.length > 0
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
