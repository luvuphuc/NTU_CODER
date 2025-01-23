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
  Image,
  Input,
  IconButton,
  useToast,
  Select, // Import Select for dropdown
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import moment from 'moment-timezone';
import api from "utils/api";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBack, MdEdit } from "react-icons/md";

const genderMapping = {
  0: "Nam", // Male
  1: "Nữ", // Female
  2: "Khác", // Other
};

const CoderDetail = () => {
  const { id } = useParams();
  const [coderDetail, setCoderDetail] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editableValues, setEditableValues] = useState({});
  const [avatarFile, setAvatarFile] = useState(null); // State for the avatar file
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchCoderDetail = async () => {
      try {
        const response = await api.get(`/Coder/${id}`);
        setCoderDetail(response.data);
        setEditableValues(response.data); // Initialize editable values
      } catch (error) {
        console.error("Đã xảy ra lỗi", error);
      }
    };

    if (id) {
      fetchCoderDetail();
    }
  }, [id]);

  const handleEdit = (field) => {
    setEditField(field);
  };

  const handleInputChange = (field, value) => {
    setEditableValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setEditableValues((prev) => ({ ...prev, avatar: reader.result })); // Update the avatar preview
        
        const formData = new FormData();
        formData.append("CoderID", id);
        formData.append("AvatarFile", file);
  
        try {
          await api.put(`/Coder/${id}/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
  
          toast({
            title: "Cập nhật avatar thành công!",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right"
          });
        } catch (error) {
          console.error("Đã xảy ra lỗi khi cập nhật avatar", error);
          toast({
            title: "Đã xảy ra lỗi khi cập nhật avatar.",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right"
          });
        }
      };
      reader.readAsDataURL(file); // Convert the file to a data URL
      setAvatarFile(file); // Save the file to state for later use
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("CoderID", id);

      // Append all editable fields to FormData
      Object.keys(editableValues).forEach((field) => {
        formData.append(field, editableValues[field]);
      });

      // If a new avatar file has been selected, append it to FormData
      if (avatarFile) {
        formData.append("AvatarFile", avatarFile);
      }

      const response = await api.put(`/Coder/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setCoderDetail((prev) => ({
        ...prev,
        ...editableValues,
      }));

      setEditField(null);
      toast({
        title: "Cập nhật thành công!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
    } catch (error) {
      console.error("Đã xảy ra lỗi khi cập nhật", error);
      toast({
        title: "Đã xảy ra lỗi khi cập nhật.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
    }
  };

  if (!coderDetail) {
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
              onClick={() => navigate(`/admin/coder`)}
            >
              Quay lại <MdOutlineArrowBack />
            </Button>
          </Link>
        </Flex>
        <VStack spacing={6} align="stretch">
          {/* Avatar Section */}
          <Flex direction="column" align="center">
            <Image
              src={editableValues.avatar || coderDetail.avatar || "default-avatar.jpg"}
              alt="Coder Avatar"
              borderRadius="full"
              boxSize="200px"
              objectFit="cover"
              mb={4}
              onClick={() => document.getElementById("avatarInput").click()} // Trigger the file input on avatar click
              cursor="pointer"
            />
            <Input
              id="avatarInput"
              type="file"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
          </Flex>
          <Divider />
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {/* Left Column */}
            <GridItem>
              <VStack align="stretch" spacing={4}>
                <Flex align="center">
                  <Text fontSize="lg">
                    <strong>Tên đăng nhập:</strong> {coderDetail.userName || "Chưa có thông tin"}
                  </Text>
                </Flex>

                {["coderName", "coderEmail", "phoneNumber", "description"].map((field) => (
                  <Flex key={field} align="center">
                    {editField === field ? (
                      <Input
                        value={editableValues[field] || ""}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        placeholder={`Chỉnh sửa ${field}`}
                      />
                    ) : (
                      <Text fontSize="lg">
                        <strong>{field === "coderName"
                          ? "Họ và tên"
                          : field === "coderEmail"
                          ? "Email"
                          : field === "phoneNumber"
                          ? "Số điện thoại"
                          : "Mô tả"}:</strong>{" "}
                        {coderDetail[field] || "Chưa có thông tin"}
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
                  {editField === "gender" ? (
                    <Select
                      value={editableValues.gender || ""}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                      placeholder="Chọn giới tính"
                    >
                      <option value="0">Nam</option>
                      <option value="1">Nữ</option>
                      <option value="2">Khác</option>
                    </Select>
                  ) : (
                    <Text fontSize="lg">
                      <strong>Giới tính:</strong> {genderMapping[coderDetail.gender] || "Khác"}
                    </Text>
                  )}
                  <IconButton
                    aria-label="Edit"
                    icon={<MdEdit />}
                    ml={2}
                    size="sm"
                    onClick={() => handleEdit("gender")}
                    cursor="pointer"
                  />
                </Flex>
              </VStack>
            </GridItem>

            {/* Right Column */}
            <GridItem>
              <VStack align="stretch" spacing={4}>
                <Text fontSize="lg">
                <strong>Ngày tạo:</strong> {moment.utc(coderDetail.updatedAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss')}
                </Text>
                <Text fontSize="lg">
                  <strong>Người tạo:</strong> {coderDetail.createdBy}
                </Text>
                {coderDetail.updatedAt && (
                  <>
                    <Text fontSize="lg">
                    <strong>Ngày cập nhật:</strong> {moment.utc(coderDetail.updatedAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss')}
                    </Text>
                    <Text fontSize="lg">
                      <strong>Người cập nhật:</strong> {coderDetail.updatedBy}
                    </Text>
                  </>
                )}
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
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
      </Box>
    </Box>
  );
};

export default CoderDetail;
