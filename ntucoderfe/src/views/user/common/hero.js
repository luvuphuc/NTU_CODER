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
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import HeroContestSection from '../contest/HeroContest';
import { TypingText } from '../components/TypingText';
import AnimatedSplitText from '../components/SplitText';
import { FaLaptopCode, FaTrophy, FaChartLine, FaCode } from 'react-icons/fa';
import { motion, useInView, useAnimation } from 'framer-motion';
import { BlogSection } from './blog';
import LeaderboardProblemModal from '../problem/components/LeaderboardProblemModal';
import api from 'config/api';

const MotionCard = motion(Card);
const MotionBox = motion(Box);
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, type: 'spring', stiffness: 50, damping: 15 },
  }),
};

const AnimatedEditorSection = () => {
  const editorRef = useRef(null);
  const inView = useInView(editorRef, { once: true, amount: 0.3 });
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <MotionBox
      ref={editorRef}
      initial={{ opacity: 0, y: 100 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      borderRadius="xl"
      boxShadow="2xl"
      overflow="hidden"
      bg={bg}
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      height="450px"
      transition={{
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96],
        delay: 0.2,
      }}
    >
      <Box
        p={4}
        bgGradient="linear(to-r, blue.500, cyan.500)"
        color="white"
        fontWeight="bold"
        fontSize="lg"
      >
        <HStack spacing={2} alignItems="center" justifyContent="center">
          <FaCode size={24} />
          <Text>Thử viết code ngay bên dưới</Text>
        </HStack>
      </Box>

      <Box flex="1" mt={0}>
        {' '}
        <Editor
          height="100%"
          defaultLanguage="cpp"
          defaultValue={`#include <iostream>

int main() {
  std::cout << "Hello NTU-CODER!" << std::endl;
  return 0;
}`}
          theme="vs-dark"
          options={{
            fontSize: 16,
            minimap: { enabled: false },
            padding: { top: 10 },
            automaticLayout: true,
          }}
        />
      </Box>
    </MotionBox>
  );
};

function AnimatedCard({ card, i }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <MotionCard
      ref={ref}
      custom={i}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.1 },
        },
      }}
      boxShadow="xl"
      p={6}
      borderRadius="xl"
      bgGradient="linear(to-br, gray.50, white)"
      cursor="pointer"
      whileHover={{
        scale: 1.05,
        boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
        transition: { duration: 0.3 },
      }}
      height="auto"
      minH="320px"
      display="flex"
      flexDirection="column"
    >
      <CardBody
        textAlign="center"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        flex="1"
        height="100%"
      >
        <Box mb={4} mx="auto" p={4} borderRadius="full">
          <Icon as={card.icon} w={12} h={12} color={card.color} />
        </Box>
        <Stack spacing={4} mt={3} flex="1">
          <Heading
            size="lg"
            color={card.color}
            fontWeight="semibold"
            letterSpacing="wide"
            textTransform="uppercase"
          >
            {card.title}
          </Heading>
          <Box
            flex="1"
            overflowY="auto"
            maxH="140px"
            px={2}
            fontSize="md"
            lineHeight="tall"
            color="gray.700"
            textAlign="center"
            userSelect="text"
          >
            {card.content}
          </Box>
          {card.link ? (
            <RouterLink to={card.link}>
              <Button
                colorScheme={card.color.split('.')[0]}
                size="md"
                borderRadius="md"
                w="full"
                _hover={{ bg: `${card.color}.600` }}
                transition="background-color 0.3s"
              >
                {card.buttonText}
              </Button>
            </RouterLink>
          ) : (
            <Button
              colorScheme={card.color.split('.')[0]}
              size="md"
              borderRadius="md"
              w="fit-content"
              mx="auto"
              onClick={card.onClick}
              _hover={{ bg: `${card.color}.600` }}
              transition="background-color 0.3s"
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
      <Flex
        bg="#A7D8F0"
        color="gray.800"
        py={{ base: 16, md: 24 }}
        px={{ base: 6, md: 10 }}
        direction={{ base: 'column', md: 'row' }}
      >
        {/* Left side - content */}
        <Box
          flex={1}
          textAlign="center"
          mb={{ base: 10, md: 0 }}
          pr={{ md: 8 }}
        >
          <Heading
            fontSize={{ base: '3xl', md: '5xl' }}
            fontWeight="bold"
            mb={4}
          >
            <TypingText
              text={`Thực hành Code Online\n với NTU-CODER`}
              highlight="NTU-CODER"
              speed={80}
              cursor={true}
            />
          </Heading>

          <AnimatedSplitText
            as="p"
            className="chakra-text"
            style={{ fontSize: '20px', marginTop: 0 }}
          >
            <>
              Học lập trình, giải bài toán, thi đấu và <br />
              nâng cao kỹ năng của bạn ngay hôm nay!
            </>
          </AnimatedSplitText>

          <Flex justify="center" mt={10} gap={4}>
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

        {/* Right side - editor */}
        <Box flex={1}>
          <AnimatedEditorSection />
        </Box>
      </Flex>

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
