import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "utils/api";
import { MdOutlineArrowBack } from "react-icons/md";
export default function CreateCoder() {
  const [userName, setUserName] = useState("");
  const [coderName, setCoderName] = useState("");
  const [coderEmail, setCoderEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setErrors({});
    const inputs = { userName, coderName, coderEmail, phoneNumber, password };
    const newErrors = {};
    Object.keys(inputs).forEach((key) => {
      if (!inputs[key].trim()) newErrors[key] = "Không được bỏ trống.";
    });
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (coderEmail && !emailRegex.test(coderEmail)) {
      newErrors.coderEmail = "Email không hợp lệ.";
    }
  
    const nameRegex = /^[^\d]+$/;
    if (coderName && !nameRegex.test(coderName)) {
      newErrors.coderName = "Họ và tên không được chứa số.";
    }
    const phoneRegex = /^\d{10}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại phải có đúng 10 chữ số.";
    }
    if (password && password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      await api.post("/Coder/create", inputs);
  
      toast({
        title: "Thêm mới thành công!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
  
      navigate("/admin/coder");
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const apiErrors = error.response.data.errors;
        const errorMap = {};
  
        apiErrors.forEach((err) => {
          if (err.includes("Tên đăng nhập")) errorMap.userName = err;
          if (err.includes("Email")) errorMap.coderEmail = err;
        });
  
        setErrors(errorMap);
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
      <Box
        bg="white"
        p="6"
        borderRadius="lg"
        boxShadow="lg"
        maxW="1000px"
        mx="auto"
      >
        <Flex mb="8px" justifyContent="end" align="end" px="25px">
          <Link><Button 
            variant="solid" 
            size="lg" 
            colorScheme="messenger" 
            borderRadius="md" 
            onClick={() => navigate(`/admin/coder/`)}
          >
            Quay lại <MdOutlineArrowBack />
          </Button>
          </Link>
        </Flex>
        <Grid templateColumns="repeat(2, 1fr)" gap="6">
          {/* Left column */}
          <GridItem>
            <FormControl isInvalid={errors.coderName} mb={4}>
              <FormLabel fontWeight="bold">Họ và tên<Text as="span" color="red.500"> *</Text></FormLabel>
              <Input
                placeholder="Nhập họ và tên"
                value={coderName}
                onChange={(e) => setCoderName(e.target.value)}
              />
              <FormErrorMessage>{errors.coderName}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.userName} mb={4}>
              <FormLabel fontWeight="bold">Tên đăng nhập<Text as="span" color="red.500"> *</Text></FormLabel>
              <Input
                placeholder="Nhập tên đăng nhập"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <FormErrorMessage>{errors.userName}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.password}>
              <FormLabel fontWeight="bold">Mật khẩu<Text as="span" color="red.500"> *</Text></FormLabel>
              <Input
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
          </GridItem>

          {/* Right column */}
          <GridItem>
            <FormControl isInvalid={errors.coderEmail} mb={4}>
              <FormLabel fontWeight="bold">Email<Text as="span" color="red.500"> *</Text></FormLabel>
              <Input
                type="email"
                placeholder="Nhập email"
                value={coderEmail}
                onChange={(e) => setCoderEmail(e.target.value)}
              />
              <FormErrorMessage>{errors.coderEmail}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.phoneNumber} mb={4}>
              <FormLabel fontWeight="bold">Số điện thoại<Text as="span" color="red.500"> *</Text></FormLabel>
              <Input
                type="tel"
                placeholder="Nhập số điện thoại"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
            </FormControl>

            <GridItem display="flex" justifyContent="center">
              <Button
                colorScheme="green"
                onClick={handleSubmit}
                borderRadius="md"
                justifyContent="center"
                alignItems="center"
                width="50%"
                mt="30px"
              >
                Thêm
              </Button>
            </GridItem>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}
