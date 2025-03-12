import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Stack,
  Button,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg="gray.900"
        color="white"
        py={{ base: 12, md: 24 }}
        px={{ base: 4, md: 10 }}
        textAlign="center"
      >
        <Heading fontSize={{ base: '3xl', md: '5xl' }} fontWeight="bold">
          Thực hành Code Online với <Text as="span" color="blue.400">NTU-CODER</Text>
        </Heading>
        <Text mt={4} fontSize={{ base: 'lg', md: 'xl' }} color="gray.300">
          Học lập trình, giải bài toán, thi đấu và nâng cao kỹ năng của bạn ngay hôm nay!
        </Text>
        <Flex justify="center" mt={8}>
          <Link to="/practice">
            <Button colorScheme="blue" size="lg" _hover={{ bg: 'blue.500' }}>
              Bắt đầu Luyện Tập
            </Button>
          </Link>
          <Link to="/contest">
            <Button ml={4} colorScheme="green" size="lg" _hover={{ bg: 'green.500' }}>
              Tham gia Cuộc Thi
            </Button>
          </Link>
        </Flex>
      </Box>
      
      {/* Features Section */}
      <Container maxW="7xl" py={{ base: 12, md: 24 }} px={{ base: 4, md: 8 }}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          
          {/* Card Luyện tập */}
          <Card boxShadow="lg" p={4} borderRadius="md">
            <CardBody textAlign="center">
              <Heading size="lg" mb={4}>Bài tập mới nhất</Heading>
              <Table variant="simple" size="sm" mb={4}>
                <Tbody>
                  <Tr><Td>Bài tập A</Td></Tr>
                  <Tr><Td>Bài tập B</Td></Tr>
                  <Tr><Td>Bài tập C</Td></Tr>
                </Tbody>
              </Table>
              <Link to="/problem">
                <Button colorScheme="blue" size="md">Xem tất cả bài tập</Button>
              </Link>
            </CardBody>
          </Card>

          {/* Card Thi đấu */}
          <Card boxShadow="lg" p={4} borderRadius="md">
            <CardBody textAlign="center">
              <Stack mt={6} spacing={3}>
                <Heading size="lg">Thi đấu</Heading>
                <Text color="gray.600">
                  Tham gia các cuộc thi lập trình, thử thách bản thân và giành giải thưởng.
                </Text>
                <Button colorScheme="green" size="sm">
                  Xem Cuộc Thi
                </Button>
              </Stack>
            </CardBody>
          </Card>

          {/* Card Bảng xếp hạng */}
          <Card boxShadow="lg" p={4} borderRadius="md">
            <CardBody textAlign="center">
              <Stack mt={6} spacing={3}>
                <Heading size="lg">Bảng xếp hạng</Heading>
                <Text color="gray.600">
                  Cạnh tranh với bạn bè và những lập trình viên khác trên toàn cầu.
                </Text>
              </Stack>
            </CardBody>
          </Card>
          
        </SimpleGrid>
      </Container>
    </Box>
  );
}