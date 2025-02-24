import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  Image
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@chakra-ui/react";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { ArrowBackIcon } from "@chakra-ui/icons";
import logo from "../../assets/img/ntu-coders.png";
import { useState } from "react";
import api from "utils/api";
function SignIn() {
  const [credentials, setCredentials] = useState({ userName: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = React.useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const handleClick = () => setShow(!show);
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await api.post("/Auth/login", credentials, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        const { token, roleID } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("roleID", roleID);

        toast({
          title: "Đăng nhập thành công!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        if(roleID == 1 ){
          navigate("/admin")
        }
        else{
          navigate("/");
        }
        
      }
    } catch (error) {
      toast({
        title: "Sai tên đăng nhập hoặc mật khẩu.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Flex w="100vw" h="100vh" align="center" justify="center" position="relative">
      {/* Back Button */}
      <Button
        position="absolute"
        top="20px"
        left="20px"
        colorScheme="blue"
        variant="ghost"
        color="gray.600"
        onClick={() => navigate("/")}
        leftIcon={<ArrowBackIcon size="md"/>}
      >
        Quay lại
      </Button>
      
      <Flex w="100vw" h="100vh">
        {/* Sign-in Form */}
        <Flex w={{ base: "100%", md: "50%" }} h="100vh" align="center" justify="center">
          <Box maxW="400px" p="32px">
            <Box textAlign="center" mb="10">
              <Heading color={textColor} fontSize="36px" mb="10px">
                Đăng nhập
              </Heading>
              <Text mb="36px" color={textColorSecondary} fontSize="md">
                Hãy nhập email/tên đăng nhập và mật khẩu!
              </Text>
            </Box>
            <FormControl>
              <FormLabel fontSize="md" fontWeight="500" color={textColor} mb="8px">
                Tên đăng nhập/Email<Text as="span" color="red.500"> *</Text>
              </FormLabel>
              <Input isRequired fontSize="sm" type="email" placeholder="abc123@gmail.com" mb="24px" size="lg" 
              onChange={(e) => setCredentials({ ...credentials, userName: e.target.value })}/>
              <FormLabel fontSize="md" fontWeight="500" color={textColor}>
                Mật khẩu<Text as="span" color="red.500"> *</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input isRequired fontSize="sm" placeholder="Mật khẩu" mb="24px" size="lg" type={show ? "text" : "password"} 
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}/>
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon color={textColorSecondary} _hover={{ cursor: "pointer" }} as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye} onClick={handleClick} />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Flex justifyContent="space-between" alignItems="center" mb="20px">
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              <NavLink to="/forgot-password">
                <Text color="blue.500">Quên mật khẩu?</Text>
              </NavLink>
            </Flex>
            <Button w="100%" colorScheme="blue" mb="20px" onClick={handleLogin} isLoading={loading}>Đăng nhập</Button>
            <Flex align="center" justify="center" mb="20px">
              <Text fontSize="sm">hoặc</Text>
            </Flex>
            <Flex justify="center" gap="10px">
              <Button variant="outline" leftIcon={<Icon as={FcGoogle} boxSize={6} />} size="lg" px={6} py={4} />
              <Button variant="outline" leftIcon={<Icon as={FaTwitter} color="blue.400" boxSize={6} />} size="lg" px={6} py={4} />
              <Button variant="outline" leftIcon={<Icon as={FaGithub} boxSize={6} />} size="lg" px={6} py={4} />
            </Flex>
          </Box>
        </Flex>
        {/* Left Sidebar */}
        <Box
          w="70%"
          h="100vh"
          bgGradient="linear(to-l, rgba(0, 0, 255, 0.7), rgba(0, 255, 255, 0.7))"
          color="white"
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          alignItems="center"
          justifyContent="flex-start"
          p={8}
          pt="100px"
          gap="20px"
        >
          <Image
            src={logo}
            alt="Logo"
            width="400px" 
            maxWidth="80%" 
          />

          <Heading fontSize="3xl" animation="pulse 2s infinite" textShadow="2px 2px 4px rgba(0,0,0,0.2)" mb={4}>Chào mừng bạn!</Heading>
          <Text fontSize="lg" textAlign="center" maxW="80%">
            Hãy đăng nhập để tiếp tục truy cập vào hệ thống của chúng tôi.
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
