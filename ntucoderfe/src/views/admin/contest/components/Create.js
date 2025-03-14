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
  Checkbox, // Thêm Checkbox từ Chakra UI
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "utils/api";
import { MdOutlineArrowBack } from "react-icons/md";
import ReactQuill from "react-quill";

export default function CreateContest() {
  const [contestName, setContestName] = useState("");
  const [contestDescription, setContestDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [ruleType, setRuleType] = useState("");
  const [failedPenalty, setFailedPenalty] = useState("");
  const [published, setPublished] = useState(0); // Mặc định chưa công khai
  const [duration, setDuration] = useState("");
  const [frozenTime, setFrozenTime] = useState("");
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const minDateTime = new Date().toISOString().slice(0, 16);
  const handleSubmit = async () => {
    setErrors({});
    const inputs = { contestName, contestDescription, startTime, endTime, ruleType, failedPenalty, published, duration, frozenTime };
    const newErrors = {};
    Object.keys(inputs).forEach((key) => {
      if (!inputs[key].toString().trim()) newErrors[key] = "Không được bỏ trống.";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await api.post("/Contest/create", inputs);
      toast({
        title: "Tạo contest thành công!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      navigate("/admin/contest");
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
            <Button variant="solid" size="lg" colorScheme="blue" borderRadius="md" onClick={() => navigate(`/admin/contest/`)}>
              Quay lại <MdOutlineArrowBack />
            </Button>
          </Link>
        </Flex>
        <Grid templateColumns="repeat(2, 1fr)" gap="6">
          <GridItem>
            <FormControl isInvalid={errors.contestName} mb={4}>
              <FormLabel fontWeight="bold">Tên cuộc thi<Text as="span" color="red.500"> *</Text></FormLabel>
              <Input placeholder="Nhập tên cuộc thi" value={contestName} onChange={(e) => setContestName(e.target.value)} />
              <FormErrorMessage>{errors.contestName}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.contestDescription} mb="60px">
              <FormLabel fontWeight="bold">Nội dung cuộc thi<Text as="span" color="red.500"> *</Text></FormLabel>
              <ReactQuill 
                value={contestDescription} 
                onChange={setContestDescription} 
                placeholder="Nhập nội dung cuộc thi" 
                style={{ height: '300px' }}
              />
              <FormErrorMessage mt="50px">{errors.contestDescription}</FormErrorMessage>
            </FormControl>
            
          </GridItem>

          <GridItem>
            <FormControl isInvalid={errors.startTime} mb={4}>
              <FormLabel fontWeight="bold">Thời gian bắt đầu<Text as="span" color="red.500"> *</Text></FormLabel>
              <Input type="datetime-local" min={minDateTime} value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              <FormErrorMessage>{errors.startTime}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.endTime} mb={4}>
              <FormLabel fontWeight="bold">Thời gian kết thúc<Text as="span" color="red.500"> *</Text></FormLabel>
              <Input type="datetime-local" min={startTime || minDateTime} value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              <FormErrorMessage>{errors.endTime}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.ruleType}>
              <FormLabel fontWeight="bold">Loại luật<Text as="span" color="red.500"> *</Text></FormLabel>
              <Input placeholder="Nhập loại luật" value={ruleType} onChange={(e) => setRuleType(e.target.value)} />
              <FormErrorMessage>{errors.ruleType}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.failedPenalty}>
              <FormLabel fontWeight="bold">Hình phạt sai<Text as="span" color="red.500"> *</Text></FormLabel>
              <Input placeholder="Nhập hình phạt" value={failedPenalty} onChange={(e) => setFailedPenalty(e.target.value)} />
              <FormErrorMessage>{errors.failedPenalty}</FormErrorMessage>
            </FormControl>
            <Flex gap={4}>
              <FormControl isInvalid={errors.duration} flex={1}>
                <FormLabel fontWeight="bold">
                  Thời lượng<Text as="span" color="red.500"> *</Text>
                </FormLabel>
                <Input
                  type="number"
                  placeholder="Nhập thời lượng"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
                <FormErrorMessage>{errors.duration}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.frozenTime} flex={1}>
                <FormLabel fontWeight="bold">
                  Thời gian đóng băng (m)<Text as="span" color="red.500"> *</Text>
                </FormLabel>
                <Input
                  type="number"
                  placeholder="Nhập thời gian đóng băng"
                  value={frozenTime}
                  onChange={(e) => setFrozenTime(e.target.value)}
                />
                <FormErrorMessage>{errors.frozenTime}</FormErrorMessage>
              </FormControl>
            </Flex>

            <FormControl mb={4} mt={6}>
              <Checkbox 
                isChecked={published === 1} 
                onChange={(e) => setPublished(e.target.checked ? 1 : 0)}
                colorScheme="blue"
              >
                Công khai
              </Checkbox>
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
