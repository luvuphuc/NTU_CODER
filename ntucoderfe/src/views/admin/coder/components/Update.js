import React, { useEffect, useState } from "react";
import { 
  Box, 
  Text, 
  VStack, 
  Divider, 
  Flex, 
  Grid, 
  GridItem, 
  Input, 
  Select, 
  Button, 
  FormControl, 
  FormLabel 
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import api from "utils/api";

const CoderUpdate = () => {
  const { id } = useParams();
  const [coderDetail, setCoderDetail] = useState(null);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    avatar: "",
    description: "",
    gender: "",
  });

  useEffect(() => {
    const fetchCoderDetail = async () => {
      try {
        const response = await api.get(`/Coder/${id}`);
        setCoderDetail(response.data);
        setFormData({
          phoneNumber: response.data.phoneNumber || "",
          avatar: response.data.avatar || "",
          description: response.data.description || "",
          gender: response.data.gender || "",
        });
      } catch (error) {
        console.error("Đã xảy ra lỗi", error);
      }
    };

    if (id) {
      fetchCoderDetail();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/Coder/${id}`, formData);
      alert("Update successful!");
      console.log(response.data);
    } catch (error) {
      console.error("Update failed", error);
      alert("Update failed!");
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
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            <Flex direction="column" align="center">
              <Text fontSize="2xl" fontWeight="bold">{coderDetail.coderName}</Text>
              <Text fontSize="lg">{coderDetail.userName}</Text>
            </Flex>
            <Divider />
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              {/* Cột trái */}
              <GridItem>
                <VStack align="stretch" spacing={4}>
                  <FormControl isReadOnly>
                    <FormLabel>Họ và tên</FormLabel>
                    <Input value={coderDetail.coderName} readOnly />
                  </FormControl>
                  <FormControl isReadOnly>
                    <FormLabel>Tên đăng nhập</FormLabel>
                    <Input value={coderDetail.userName} readOnly />
                  </FormControl>
                  <FormControl isReadOnly>
                    <FormLabel>Email</FormLabel>
                    <Input value={coderDetail.coderEmail} readOnly />
                  </FormControl>
                </VStack>
              </GridItem>

              {/* Cột phải */}
              <GridItem>
                <VStack align="stretch" spacing={4}>
                  <FormControl>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Avatar</FormLabel>
                    <Input
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Input
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Not specified</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Select>
                  </FormControl>
                </VStack>
              </GridItem>
            </Grid>
            <Button type="submit" colorScheme="blue" mt={4}>
              Update
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default CoderUpdate;
