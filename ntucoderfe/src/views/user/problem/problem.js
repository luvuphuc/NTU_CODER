import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Card,
  CardBody,
  Stack,
  Button,
  Flex,
  Grid,
  Checkbox,
  Divider,
  IconButton,
  Spinner,
  Badge,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import Navigation from 'views/user/navbar/navigation';
import Header from 'views/user/header/header';
import { IoMdHeartEmpty } from "react-icons/io";
import FooterUser from '../footer/footer';
import api from '../../../utils/api';

export default function ProblemPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState({
    easy: false,
    medium: false,
    hard: false,
  });
  const [status, setStatus] = useState({
    unsolved: false,
    solved: false,
    attempted: false,
  });
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await api.get('/problem/all');
        setProblems(response.data.data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  return (
    <Box>
      <Header />
      <Navigation />

      <Container maxW="7xl" py={{ base: 12, md: 12 }} px={{ base: 4, md: 8 }}>
        <Heading textAlign="center" mb={10} color="gray.700">
          DANH SÁCH BÀI TẬP
        </Heading>
        
        <Grid templateColumns={{ base: '1fr', md: '3fr 7fr' }} gap={6} alignItems="start">
          {/* Sidebar: Bộ lọc */}
          <Box borderRadius="lg" boxShadow="md" p={4} bg="gray.100">
            <Stack spacing={3}>
              <Text fontWeight="bold" color="gray.600" fontSize="lg">Độ khó</Text>
              <Checkbox name="easy" isChecked={difficulty.easy} onChange={(e) => setDifficulty({ ...difficulty, easy: e.target.checked })}>Dễ</Checkbox>
              <Checkbox name="medium" isChecked={difficulty.medium} onChange={(e) => setDifficulty({ ...difficulty, medium: e.target.checked })}>Trung bình</Checkbox>
              <Checkbox name="hard" isChecked={difficulty.hard} onChange={(e) => setDifficulty({ ...difficulty, hard: e.target.checked })}>Khó</Checkbox>
              
              <Divider my={4} />

              <Text fontWeight="bold" color="gray.600">Trạng thái</Text>
              <Checkbox name="unsolved" isChecked={status.unsolved} onChange={(e) => setStatus({ ...status, unsolved: e.target.checked })}>Chưa giải</Checkbox>
              <Checkbox name="solved" isChecked={status.solved} onChange={(e) => setStatus({ ...status, solved: e.target.checked })}>Đã giải</Checkbox>
              <Checkbox name="attempted" isChecked={status.attempted} onChange={(e) => setStatus({ ...status, attempted: e.target.checked })}>Đã thử</Checkbox>
              
              <Checkbox colorScheme="blue" isChecked={showFavorites} onChange={(e) => setShowFavorites(e.target.checked)}>Chỉ hiển thị bài tập yêu thích</Checkbox>
            </Stack>
          </Box>

          {/* Danh sách bài tập */}
          <Box w="full" display="flex" flexDirection="column">
            {loading ? (
              <Flex justify="center" align="center" minH="200px">
                <Spinner size="xl" color="blue.500" />
              </Flex>
            ) : (
              <Stack spacing={6} w="full">
                {problems.map((problem) => (
                  <Card key={problem.problemId} borderRadius="lg" boxShadow="md" p={4} minH="150px">
                    <CardBody>
                      <Flex justify="space-between" align="center">
                        <Stack spacing={3} flex="1">
                          <Heading size="lg">{problem.problemName}</Heading>
                          <Wrap>
                            {problem.selectedCategoryNames.map((category, index) => (
                              <WrapItem key={index}>
                                <Badge colorScheme="purple" fontSize="0.8rem">{category}</Badge>
                              </WrapItem>
                            ))}
                          </Wrap>
                          <Text color="gray.600" fontSize="md">{problem.problemContent}</Text>
                        </Stack>
                        <Flex align="center" ml={4}>
                          <Button colorScheme="blue" size="md" mr={2} borderRadius="10">
                            Giải bài tập
                          </Button>
                          <IconButton
                            aria-label="Yêu thích"
                            icon={<IoMdHeartEmpty size={24} color="red" />}
                            variant="ghost"
                            bg="white"
                          />
                        </Flex>
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        </Grid>
      </Container>

      <FooterUser />
    </Box>
  );
}
