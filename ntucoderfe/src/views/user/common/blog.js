import { React, useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Stack,
  Skeleton,
  Flex,
  Avatar,
  VStack,
  HStack,
  Link as ChakraLink,
  useColorModeValue,
} from '@chakra-ui/react';
import api from 'config/api';
import { motion } from 'framer-motion';
import { formatTimeFromNow } from 'utils/formatTime';

const MotionCard = motion(Card);

export function BlogSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const bgCard = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.300');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('Blog/all', {
          params: {
            published: true,
            pinHome: true,
            sortField: 'BlogDate',
            ascending: true,
            page: 1,
            pageSize: 2,
          },
        });
        setPosts(response.data.data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Container maxW="7xl" pb={14} px={{ base: 4, md: 3 }}>
      <Heading size="lg" mb={4}>
        Bài viết mới nhất
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {loading
          ? [1, 2].map((i) => (
              <Card key={i}>
                <CardBody>
                  <Skeleton height="200px" mb={4} />
                  <Skeleton height="20px" mb={2} />
                  <Skeleton height="16px" width="80%" />
                </CardBody>
              </Card>
            ))
          : posts.map((post, index) => {
              const formattedTime = formatTimeFromNow(post.blogDate);

              return (
                <MotionCard
                  key={index}
                  as="a"
                  href="/blog"
                  bg={bgCard}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                    ease: 'easeOut',
                  }}
                  borderRadius="lg"
                  overflow="hidden"
                  shadow="md"
                >
                  <CardBody p={4}>
                    <Flex align="center" mb={3} justify="flex-start">
                      <Avatar
                        size="sm"
                        mr={3}
                        src={post.coderAvatar || undefined}
                        name={post.coderName}
                      />
                      <VStack align="start" spacing={0}>
                        <ChakraLink
                          href={`/user/${post.coderID}`}
                          fontSize="sm"
                          fontWeight="bold"
                          color="gray.800"
                          _hover={{ textDecoration: 'underline' }}
                        >
                          {post.coderName || 'Anonymous'}
                        </ChakraLink>
                        <HStack spacing={1} color="gray.500">
                          <Box
                            w="4px"
                            h="4px"
                            bg="gray.500"
                            borderRadius="full"
                          />
                          <Text fontSize="xs">{formattedTime}</Text>
                        </HStack>
                      </VStack>
                    </Flex>

                    <Stack spacing={2}>
                      <Text fontSize="xl" fontWeight="bold" color="blue.500">
                        {post.title}
                      </Text>
                      <Box
                        fontSize="sm"
                        noOfLines={3}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    </Stack>
                  </CardBody>
                </MotionCard>
              );
            })}
      </SimpleGrid>
    </Container>
  );
}
