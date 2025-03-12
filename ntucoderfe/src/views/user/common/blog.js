import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Image,
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

// Danh sách bài viết mẫu
const blogPosts = [
  {
    title: 'Làm thế nào để học thuật toán?',
    description: 'Hướng dẫn chi tiết cách học thuật toán từ cơ bản đến nâng cao.',
    image: 'https://via.placeholder.com/500',
    link: '/blog/learn-algorithms',
  },
  {
    title: 'Top 10 mẹo viết code sạch',
    description: 'Những mẹo giúp bạn cải thiện kỹ năng viết code và tư duy lập trình.',
    image: 'https://via.placeholder.com/500',
    link: '/blog/clean-code-tips',
  },
];

export function BlogSection() {
  return (
    <Container maxW="7xl" py={{ base: 12, md: 10 }} px={{ base: 4, md: 3 }}>
      <Heading size="xl" textAlign="center" mb={8}>
        Bài Viết Mới Nhất
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        {blogPosts.map((post, index) => (
          <Card key={index} as={Link} to={post.link} _hover={{ textDecoration: 'none', transform: 'scale(1.02)' }} transition="0.2s">
            <CardBody>
              <Image src={post.image} alt={post.title} borderRadius="md" />
              <Stack mt={4} spacing={3}>
                <Heading size="md">{post.title}</Heading>
                <Text color="gray.600">{post.description}</Text>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}