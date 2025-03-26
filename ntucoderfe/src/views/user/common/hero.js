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
  Tbody,
  Tr,
  Td,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import HeroContestSection from '../contest/HeroContest';

export default function HeroSection() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg="#A7D8F0"
        color="gray.800"
        py={{ base: 16, md: 24 }}
        px={{ base: 6, md: 10 }}
        textAlign="center"
      >
        <Heading fontSize={{ base: '3xl', md: '5xl' }} fontWeight="bold">
          Thực hành Code Online với{' '}
          <Text as="span" color="blue.400">
            NTU-CODER
          </Text>
        </Heading>
        <Text mt={4} fontSize={{ base: 'lg', md: 'xl' }} color="gray.800">
          Học lập trình, giải bài toán, thi đấu và nâng cao kỹ năng của bạn ngay
          hôm nay!
        </Text>
        <Flex justify="center" mt={8}>
          <Link to="/problem">
            <Button
              colorScheme="blue"
              size="lg"
              _hover={{
                bg: 'blue.600',
                transform: 'scale(1.05)',
                boxShadow: 'lg',
              }}
            >
              Bắt đầu Luyện Tập
            </Button>
          </Link>
          <Link to="/contest">
            <Button
              ml={4}
              colorScheme="green"
              size="lg"
              _hover={{
                bg: 'green.600',
                transform: 'scale(1.05)',
                boxShadow: 'lg',
              }}
            >
              Tham gia Cuộc Thi
            </Button>
          </Link>
        </Flex>
      </Box>

      {/* Features Section */}
      <Container maxW="7xl" py={{ base: 12, md: 10 }} px={{ base: 4, md: 8 }}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {/* Card Luyện tập */}
          <Card
            boxShadow="2xl"
            p={6}
            borderRadius="xl"
            transition="all 0.3s ease-in-out"
            _hover={{ transform: 'scale(1.03)', boxShadow: '2xl' }}
          >
            <CardBody textAlign="center">
              <Heading size="lg" mb={4} color="blue.500">
                Bài tập mới nhất
              </Heading>
              <Table variant="simple" size="sm" mb={4}>
                <Tbody>
                  <Tr>
                    <Td>Bài tập A</Td>
                  </Tr>
                  <Tr>
                    <Td>Bài tập B</Td>
                  </Tr>
                  <Tr>
                    <Td>Bài tập C</Td>
                  </Tr>
                </Tbody>
              </Table>
              <Link to="/problem">
                <Button colorScheme="blue" size="md">
                  Xem tất cả bài tập
                </Button>
              </Link>
            </CardBody>
          </Card>

          {/* Card Thi đấu */}
          <Card
            boxShadow="2xl"
            p={6}
            borderRadius="xl"
            transition="all 0.3s ease-in-out"
            _hover={{ transform: 'scale(1.03)', boxShadow: '2xl' }}
          >
            <CardBody textAlign="center">
              <Stack mt={6} spacing={3}>
                <Heading size="lg" color="green.500">
                  Thi đấu
                </Heading>
                <Text color="gray.600">
                  Tham gia các cuộc thi lập trình, thử thách bản thân và giành
                  giải thưởng.
                </Text>
                <Link to="/contest">
                  <Button colorScheme="green" size="md">
                    Xem Cuộc Thi
                  </Button>
                </Link>
              </Stack>
            </CardBody>
          </Card>

          {/* Card Bảng xếp hạng */}
          <Card
            boxShadow="2xl"
            p={6}
            borderRadius="xl"
            transition="all 0.3s ease-in-out"
            _hover={{ transform: 'scale(1.03)', boxShadow: '2xl' }}
          >
            <CardBody textAlign="center">
              <Stack mt={6} spacing={3}>
                <Heading size="lg" color="purple.500">
                  Bảng xếp hạng
                </Heading>
                <Text color="gray.600">
                  Cạnh tranh với bạn bè và những lập trình viên khác trên toàn
                  cầu.
                </Text>
                <Link to="/ranking">
                  <Button colorScheme="purple" size="md">
                    Xem Bảng Xếp Hạng
                  </Button>
                </Link>
              </Stack>
            </CardBody>
          </Card>
        </SimpleGrid>
        <HeroContestSection />
      </Container>
    </Box>
  );
}
