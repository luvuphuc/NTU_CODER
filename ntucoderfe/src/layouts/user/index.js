import React from 'react'
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
  useBreakpointValue,
  Flex,
} from '@chakra-ui/react'
import Navigation from 'views/user/common/navigation';
import Header from 'views/user/common/header';
import FooterUser from 'views/user/common/footer';
export default function HomePage() {
  return (
    <Box>
      {/* Navigation Bar */}
      <Header />
      <Navigation/>
      {/* Hero Section */}
      <Box
        bg="gray.100"
        py={{ base: 12, md: 24 }}
        px={{ base: 4, md: 10 }}
        textAlign="center"
        borderBottom="1px solid"
        borderColor="gray.200">
        <Heading fontSize={{ base: '3xl', md: '5xl' }} fontWeight="bold">
          Chào mừng đến với <Text color="blue">NTU-CODER</Text>
        </Heading>
        <Text mt={4} fontSize={{ base: 'lg', md: 'xl' }} color="gray.600">
            Giải mã những thách thức, tạo ra giải pháp.
        </Text>
        <Button
          mt={8}
          colorScheme="pink"
          size="lg"
          _hover={{ bg: 'pink.300' }}
        >
          Bắt đầu
        </Button>
      </Box>

      {/* Featured Sections */}
      <Container maxW="7xl" py={{ base: 12, md: 24 }} px={{ base: 4, md: 8 }}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {/* Example Card 1 */}
          <Card>
            <CardBody>
              <Image
                src="https://via.placeholder.com/500"
                alt="Design Inspiration"
                borderRadius="md"
              />
              <Stack mt={6} spacing={3} textAlign="center">
                <Heading size="lg">Inspiration</Heading>
                <Text color="gray.600">Explore trending design works to inspire your next project.</Text>
                <Button colorScheme="pink" variant="outline" size="sm">
                  Learn More
                </Button>
              </Stack>
            </CardBody>
          </Card>

          {/* Example Card 2 */}
          <Card>
            <CardBody>
              <Image
                src="https://via.placeholder.com/500"
                alt="Job Board"
                borderRadius="md"
              />
              <Stack mt={6} spacing={3} textAlign="center">
                <Heading size="lg">Find Work</Heading>
                <Text color="gray.600">Browse job listings or freelance projects in your field.</Text>
                <Button colorScheme="pink" variant="outline" size="sm">
                  Explore Jobs
                </Button>
              </Stack>
            </CardBody>
          </Card>

          {/* Example Card 3 */}
          <Card>
            <CardBody>
              <Image
                src="https://via.placeholder.com/500"
                alt="Design Learning"
                borderRadius="md"
              />
              <Stack mt={6} spacing={3} textAlign="center">
                <Heading size="lg">Learn Design</Heading>
                <Text color="gray.600">Start learning the principles of design to grow your skills.</Text>
                <Button colorScheme="pink" variant="outline" size="sm">
                  Start Learning
                </Button>
              </Stack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Container>

      {/* Footer Section */}
      <FooterUser/>
    </Box>
  )
}
