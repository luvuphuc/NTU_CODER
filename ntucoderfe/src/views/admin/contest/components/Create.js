import React, { useState } from 'react';
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
  Checkbox,
  HStack,
  Select,
  NumberInput,
  NumberDecrementStepper,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import api from 'config/api';
import { MdOutlineArrowBack } from 'react-icons/md';
import ReactQuill from 'react-quill';

export default function CreateContest() {
  const [contestName, setContestName] = useState('');
  const [contestDescription, setContestDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [ruleType, setRuleType] = useState('ACM Rule');
  const [failedPenalty, setFailedPenalty] = useState('');
  const [published, setPublished] = useState(0); // Mặc định chưa công khai
  const [duration, setDuration] = useState('');
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const minDateTime = new Date().toISOString().slice(0, 16);
  const handleSubmit = async () => {
    setErrors({});
    const inputs = {
      contestName,
      contestDescription,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      ruleType,
      failedPenalty,
      published,
      duration,
    };
    const newErrors = {};
    Object.keys(inputs).forEach((key) => {
      if (!inputs[key].toString().trim())
        newErrors[key] = 'Không được bỏ trống.';
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await api.post('/Contest/create', inputs);
      toast({
        title: 'Tạo contest thành công!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      navigate('/admin/contest');
    } catch (error) {
      toast({
        title: 'Đã xảy ra lỗi.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }} px="25px">
      <Box
        bg="white"
        p="6"
        borderRadius="lg"
        boxShadow="lg"
        maxW="1000px"
        mx="auto"
      >
        <Flex mb="8px" justifyContent="end" align="end" px="25px">
          <Link>
            <Button
              variant="solid"
              size="lg"
              colorScheme="blue"
              borderRadius="md"
              onClick={() => navigate(`/admin/contest/`)}
            >
              Quay lại <MdOutlineArrowBack />
            </Button>
          </Link>
        </Flex>
        <Grid templateColumns="repeat(2, 1fr)" gap="6">
          <GridItem>
            <FormControl isInvalid={errors.contestName} mb={4}>
              <FormLabel fontWeight="bold">
                Tên cuộc thi
                <Text as="span" color="red.500">
                  {' '}
                  *
                </Text>
              </FormLabel>
              <Input
                placeholder="Nhập tên cuộc thi"
                value={contestName}
                onChange={(e) => setContestName(e.target.value)}
              />
              <FormErrorMessage>{errors.contestName}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.contestDescription} mb="60px">
              <FormLabel fontWeight="bold">
                Nội dung cuộc thi
                <Text as="span" color="red.500">
                  {' '}
                  *
                </Text>
              </FormLabel>
              <Box width="md" mx="auto">
                <ReactQuill
                  value={contestDescription}
                  onChange={setContestDescription}
                  placeholder="Nhập nội dung cuộc thi"
                  style={{ height: '300px', wordWrap: 'break-word' }}
                />
              </Box>
              <FormErrorMessage mt="50px">
                {errors.contestDescription}
              </FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isInvalid={errors.startTime} flex="1">
              <FormLabel fontWeight="bold">
                Thời gian bắt đầu
                <Text as="span" color="red.500">
                  {' '}
                  *
                </Text>
              </FormLabel>
              <Input
                type="datetime-local"
                min={minDateTime}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <FormErrorMessage>{errors.startTime}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.endTime} flex="1">
              <FormLabel fontWeight="bold">
                Thời gian kết thúc
                <Text as="span" color="red.500">
                  {' '}
                  *
                </Text>
              </FormLabel>
              <Input
                type="datetime-local"
                min={startTime || minDateTime}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
              <FormErrorMessage>{errors.endTime}</FormErrorMessage>
            </FormControl>
            <HStack spacing={4} align="start" mt={4}>
              <FormControl isInvalid={errors.duration} flex="1">
                <FormLabel fontWeight="bold">
                  Thời lượng (phút)
                  <Text as="span" color="red.500">
                    {' '}
                    *
                  </Text>
                </FormLabel>
                <NumberInput
                  min={1}
                  value={duration}
                  onChange={(valueString) => setDuration(valueString)}
                  maxW="full"
                >
                  <NumberInputField placeholder="Nhập thời lượng" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.duration}</FormErrorMessage>
              </FormControl>
            </HStack>
            <HStack spacing={4} align="start" mt={4}>
              <FormControl isInvalid={errors.ruleType} flex="1">
                <FormLabel fontWeight="bold">
                  Loại luật
                  <Text as="span" color="red.500">
                    {' '}
                    *
                  </Text>
                </FormLabel>
                <Select
                  value={ruleType}
                  onChange={(e) => setRuleType(e.target.value)}
                >
                  <option value="ACM Rule">ACM Rule</option>
                  <option value="Codeforces Rule">Codeforces Rule</option>
                </Select>
                <FormErrorMessage>{errors.ruleType}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.failedPenalty} flex="1">
                <FormLabel fontWeight="bold">
                  Hình phạt sai
                  <Text as="span" color="red.500">
                    {' '}
                    *
                  </Text>
                </FormLabel>
                <NumberInput
                  value={failedPenalty}
                  onChange={(valueString) => setFailedPenalty(valueString)}
                  maxW="full"
                >
                  <NumberInputField placeholder="Nhập hình phạt" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.failedPenalty}</FormErrorMessage>
              </FormControl>
            </HStack>

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
          <Button
            colorScheme="green"
            onClick={handleSubmit}
            borderRadius="md"
            width="50%"
            mt="30px"
          >
            Thêm
          </Button>
        </GridItem>
      </Box>
    </Box>
  );
}
