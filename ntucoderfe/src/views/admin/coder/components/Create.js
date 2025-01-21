import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function CreateCoder() {
  const [userName, setUserName] = useState('');
  const [coderName, setCoderName] = useState('');
  const [coderEmail, setCoderEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!userName || !coderName || !coderEmail || !phoneNumber) {
      toast({
        title: 'All fields are required!',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    console.log({
      userName,
      coderName,
      coderEmail,
      phoneNumber,
      status,
    });

    toast({
      title: 'Coder added successfully!',
      status: 'success',
      duration: 3000,
    });
    navigate('/admin/coder');
  };

  return (
    <Box w="50%" p="10" m="auto">
      <Text fontSize="2xl" mb="4" fontWeight="bold">
        Add New Coder
      </Text>
      <FormControl id="userName" mb="4">
        <FormLabel>User Name</FormLabel>
        <Input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </FormControl>
      <FormControl id="coderName" mb="4">
        <FormLabel>Coder Name</FormLabel>
        <Input
          type="text"
          value={coderName}
          onChange={(e) => setCoderName(e.target.value)}
        />
      </FormControl>
      <FormControl id="coderEmail" mb="4">
        <FormLabel>Coder Email</FormLabel>
        <Input
          type="email"
          value={coderEmail}
          onChange={(e) => setCoderEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="phoneNumber" mb="4">
        <FormLabel>Phone Number</FormLabel>
        <Input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Status</FormLabel>
        <Input
          type="checkbox"
          isChecked={status}
          onChange={(e) => setStatus(e.target.checked)}
        />
      </FormControl>
      <Button colorScheme="teal" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
}
