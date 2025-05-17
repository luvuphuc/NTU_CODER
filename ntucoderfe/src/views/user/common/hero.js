import React, { useState, useEffect, useRef } from 'react';
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
  Spinner,
  Link as ChakraLink,
  Icon,
  useDisclosure,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import HeroContestSection from '../contest/HeroContest';
import { TypingText } from '../components/TypingText';
import AnimatedSplitText from '../components/SplitText';
import { FaLaptopCode, FaTrophy, FaChartLine } from 'react-icons/fa';
import { motion, useInView } from 'framer-motion';
import { BlogSection } from './blog';
import LeaderboardProblemModal from '../problem/components/LeaderboardProblemModal';
import api from 'config/api';

const MotionCard = motion(Card);

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
  }),
};

function AnimatedCard({ card, i }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <MotionCard
      ref={ref}
      custom={i}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={cardVariants}
      boxShadow="2xl"
      p={6}
      borderRadius="xl"
      transition="all 0.3s ease-in-out"
      _hover={{ transform: 'scale(1.03)', boxShadow: 'dark-lg' }}
      height="100%"
      minH="320px"
    >
      <CardBody
        textAlign="center"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        flex="1"
        height="100%"
      >
        <Box mb={3} mx="auto">
          <Icon as={card.icon} w={10} h={10} color={card.textColor} />
        </Box>
        <Stack spacing={3} mt={3} flex="1">
          <Heading size="lg" color={card.color}>
            {card.title}
          </Heading>
          <Box flex="1" overflow="auto" textAlign="center">
            {card.content}
          </Box>
          {card.link ? (
            <RouterLink to={card.link}>
              <Button
                colorScheme={card.color.split('.')[0]}
                size="md"
                borderRadius="md"
              >
                {card.buttonText}
              </Button>
            </RouterLink>
          ) : (
            <Button
              colorScheme={card.color.split('.')[0]}
              size="md"
              borderRadius="md"
              width="fit-content"
              mx="auto"
              onClick={card.onClick}
            >
              {card.buttonText}
            </Button>
          )}
        </Stack>
      </CardBody>
    </MotionCard>
  );
}

export default function HeroSection() {
  const [latestProblems, setLatestProblems] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemRes, rankingRes] = await Promise.all([
          api.get('/Problem/all', {
            params: {
              Page: 1,
              PageSize: 3,
              sortField: 'ProblemID',
              ascending: false,
              published: true,
            },
            paramsSerializer: { indexes: null },
          }),
          api.get('/Coder/ranking-coder'),
        ]);
        setLatestProblems(problemRes.data.data || []);
        setRanking(rankingRes.data || []);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const problemListContent = loading ? (
    <Spinner />
  ) : (
    <Box>
      {latestProblems.length === 0 && <Text>Không có bài tập mới</Text>}
      {latestProblems.map((problem, index) => (
        <Text
          key={problem.problemID}
          mb={2}
          fontWeight="medium"
          textAlign="start"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          maxWidth="100%"
          _hover={{ color: 'blue.600' }}
        >
          <ChakraLink as={RouterLink} to={`/problem/${problem.problemID}`}>
            Bài tập {index + 1}: {problem.problemName}
          </ChakraLink>
        </Text>
      ))}
    </Box>
  );

  const cards = [
    {
      icon: FaLaptopCode,
      color: 'blue.500',
      title: 'Bài tập mới nhất',
      textColor: 'blue.400',
      buttonText: 'Xem tất cả bài tập',
      content: problemListContent,
      onClick: null,
      link: '/problem',
    },
    {
      icon: FaTrophy,
      color: 'green.500',
      title: 'Thi đấu',
      textColor: 'green.400',
      buttonText: 'Xem cuộc Thi',
      content: (
        <Text color="gray.600">
          Tham gia các cuộc thi lập trình, thử thách bản thân và giành giải
          thưởng.
        </Text>
      ),
      onClick: null,
      link: '/contest',
    },
    {
      icon: FaChartLine,
      color: 'purple.500',
      title: 'Bảng xếp hạng',
      textColor: 'purple.400',
      buttonText: 'Xem bảng xếp hạng',
      content: (
        <Text color="gray.600">
          Cạnh tranh với bạn bè và các lập trình viên khác trên toàn cầu.
        </Text>
      ),
      onClick: onOpen,
      link: null,
    },
  ];

  return (
    <Box>
      <Box
        bg="#A7D8F0"
        color="gray.800"
        py={{ base: 16, md: 24 }}
        px={{ base: 6, md: 10 }}
        textAlign="center"
      >
        <Heading fontSize={{ base: '3xl', md: '5xl' }} fontWeight="bold">
          <TypingText
            text="Thực hành Code Online với NTU-CODER"
            highlight="NTU-CODER"
            speed={80}
            cursor={true}
          />
        </Heading>
        <AnimatedSplitText
          as="p"
          className="chakra-text"
          style={{ fontSize: '20px', marginTop: '15px' }}
        >
          Học lập trình, giải bài toán, thi đấu và nâng cao kỹ năng của bạn ngay
          hôm nay!
        </AnimatedSplitText>
        <Flex justify="center" mt={8}>
          <ChakraLink as={RouterLink} to="/problem">
            <Button
              colorScheme="blue"
              size="lg"
              borderRadius="md"
              _hover={{
                bg: 'blue.600',
                transform: 'scale(1.05)',
                boxShadow: 'lg',
              }}
            >
              Bắt đầu Luyện Tập
            </Button>
          </ChakraLink>
          <ChakraLink as={RouterLink} to="/contest">
            <Button
              ml={4}
              colorScheme="green"
              size="lg"
              borderRadius="md"
              _hover={{
                bg: 'green.600',
                transform: 'scale(1.05)',
                boxShadow: 'lg',
              }}
            >
              Tham gia Cuộc Thi
            </Button>
          </ChakraLink>
        </Flex>
      </Box>
      <Container maxW="7xl" py={{ base: 8, md: 10 }} px={{ base: 4, md: 8 }}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {cards.map((card, i) => (
            <AnimatedCard key={i} card={card} i={i} />
          ))}
        </SimpleGrid>
        <HeroContestSection />
        <BlogSection />
      </Container>
      <LeaderboardProblemModal
        isOpen={isOpen}
        onClose={onClose}
        ranking={ranking}
      />
    </Box>
  );
}
