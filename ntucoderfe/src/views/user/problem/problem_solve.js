import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Text,
  IconButton,
  HStack,
  Tooltip,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import Split from 'react-split';
import api from 'config/api';
import ProblemTab from '../components/problem_tab';
import RankingTab from '../components/ranking_tab';
import HistorySubTab from '../components/historysub_tab';
import EditorTab from '../components/editor_tab';
import Cookies from 'js-cookie';
import { HamburgerIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { LuShuffle } from 'react-icons/lu';
import { IoChevronForwardSharp, IoChevronBackSharp } from 'react-icons/io5';
import ContestEndCheckModal from './components/EndTimeDialog';
import FullPageSpinner from 'components/spinner/FullPageSpinner';
const MotionTab = motion(Tab);

const ProblemSolver = () => {
  const { contestId, id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblemDetail] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const token = Cookies.get('token');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [participationId, setParticipationId] = useState(null);
  const [contestProblems, setContestProblems] = useState([]);
  const [contest, setContest] = useState(null);
  const isPrevDisabled = currentIndex <= 0;
  const isNextDisabled = currentIndex >= contestProblems.length - 1;
  const [submissionCode, setSubmissionCode] = useState('');
  const [takepart, setTakepart] = useState(null);
  const sidebarVariants = {
    hidden: { x: '-100%' },
    visible: { x: '0%' },
    exit: { x: '-100%' },
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const problemRes = await api.get(`/Problem/${id}`);
        const problemData = problemRes.data;
        if (!contestId && problemData.published !== 1) {
          navigate('/');
          setLoading(false);
          return;
        }
        let sampleTest = null;
        setProblemDetail({
          ...problemData,
          ...(sampleTest ? sampleTest : {}),
        });
      } catch (error) {
        if (error.response && error.response.status === 500) {
          navigate('/');
          return;
        }
        console.error('Đã xảy ra lỗi', error);
      }
      if (contestId) {
        try {
          const [regRes, contestDataRes] = await Promise.all([
            api.get(`/Participation/check?contestID=${contestId}`),
            api.get(`/Contest/${contestId}`),
          ]);
          setContest(contestDataRes.data);
          if (contestDataRes.data.status !== 1 || !regRes.data.onGoing) {
            navigate('/');
            setLoading(false);
            return;
          }
          if (!token) {
            onOpen();
            setLoading(false);
            return;
          }
          setLoading(false);
          const participationId = regRes.data.participationId;
          setParticipationId(participationId);

          const takepartRes = await api.post(`/TakePart/create`, {
            problemID: id,
            participationID: participationId,
          });

          setTakepart(takepartRes.data.takePartID);

          const probRes = await api.get('/HasProblem/all', {
            params: { contestId: contestId, ascending: true },
          });

          if (probRes.status === 200) {
            const hasProblems = probRes.data.data;
            const orderedProblems = hasProblems
              .sort((a, b) => a.problemOrder - b.problemOrder)
              .map((p) => ({
                problemID: p.problemID,
                problemName: p.problemName,
              }));
            setContestProblems(orderedProblems);
            const currentIndex = orderedProblems.findIndex(
              (p) => p.problemID === Number(id),
            );
            setCurrentIndex(currentIndex !== -1 ? currentIndex : 0);
          }
        } catch (error) {
          console.error('Lỗi khi lấy thông tin contest:', error);
          setLoading(false);
        }
      } else {
        if (!token) {
          onOpen();
          setLoading(false);
          return;
        }
        const problemListRes = await api.get('/Problem/all', {
          params: {
            published: true,
          },
        });
        if (problemListRes.status === 200) {
          const allProblems = problemListRes.data.data;
          const orderedProblems = allProblems
            .sort((a, b) => a.problemOrder - b.problemOrder)
            .map((p) => ({
              problemID: p.problemID,
              problemName: p.problemName,
            }));
          setContestProblems(orderedProblems);
          const currentIndex = orderedProblems.findIndex(
            (p) => p.problemID === Number(id),
          );
          setCurrentIndex(currentIndex !== -1 ? currentIndex : 0);
        }
      }
    };

    if (id) fetchData();
  }, [id, token, onOpen, navigate, takepart]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      const problemID = contestProblems[newIndex].problemID;
      handleNavigate(problemID);
    }
  };

  const handleNext = () => {
    if (currentIndex < contestProblems.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      const problemID = contestProblems[newIndex].problemID;
      handleNavigate(problemID);
    }
  };
  const handleNavigate = (problemID) => {
    if (contestId) {
      navigate(`/contest/${contestId}/problem/${problemID}`);
    } else {
      navigate(`/problem/${problemID}`);
    }
  };
  const handleShuffle = () => {
    const shuffled = [...contestProblems];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setContestProblems(shuffled);
    setCurrentIndex(0);
    handleNavigate(shuffled[0].problemID);
  };
  const handleSubmissionSelect = (code) => {
    setSubmissionCode(code);
  };
  if (loading) {
    return <FullPageSpinner />;
  }
  if (!token) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Yêu cầu đăng nhập</ModalHeader>
          <ModalBody>
            <Text>Bạn cần đăng nhập để thực hiện bài tập.</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              borderRadius="md"
              onClick={() => navigate('/login')}
            >
              Đăng nhập
            </Button>
            <Button borderRadius="md" onClick={() => navigate(-1)}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  if (!problem) {
    return <FullPageSpinner />;
  }

  return (
    <Box height="100vh" display="flex" flexDirection="column" bg="white">
      <Container
        maxW="full"
        flex="1"
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        pl={0}
      >
        <Split
          className="split"
          sizes={[40, 60]}
          minSize={450}
          gutterSize={5}
          direction="horizontal"
        >
          {/* Tabs: Bài tập, Xếp hạng, Thảo luận */}
          <Box width="40%" overflowY="auto" sx={customScrollbarStyle}>
            <Box
              px={3}
              py={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              borderTopRadius="lg"
              borderBottom="1px solid #C0C0C0"
            >
              <HStack spacing={2}>
                <IconButton
                  aria-label="Menu"
                  icon={<HamburgerIcon />}
                  size="sm"
                  fontSize="20px"
                  variant="ghost"
                  onClick={() => setSidebarOpen(true)}
                />
                <Text
                  fontWeight="semibold"
                  fontSize="xl"
                  isTruncated
                  maxW="200px"
                >
                  {contest ? contest.contestName : 'Danh sách bài tập'}
                </Text>
              </HStack>

              <HStack spacing={1}>
                <IconButton
                  aria-label="Back"
                  icon={<IoChevronBackSharp />}
                  fontSize="20px"
                  size="sm"
                  variant="ghost"
                  borderRadius="md"
                  _hover={{
                    bg: 'gray.200',
                    border: '1px solid #ccc',
                  }}
                  onClick={handlePrev}
                  isDisabled={isPrevDisabled}
                />
                <IconButton
                  aria-label="Forward"
                  icon={<IoChevronForwardSharp />}
                  fontSize="20px"
                  size="sm"
                  variant="ghost"
                  borderRadius="md"
                  _hover={{
                    bg: 'gray.200',
                    border: '1px solid #ccc',
                  }}
                  onClick={handleNext}
                  isDisabled={isNextDisabled}
                />
                <Tooltip label="Shuffle">
                  <IconButton
                    aria-label="Shuffle"
                    icon={<LuShuffle />}
                    fontSize="20px"
                    size="sm"
                    variant="ghost"
                    borderRadius="md"
                    _hover={{
                      bg: 'gray.200',
                      border: '1px solid #ccc',
                    }}
                    onClick={handleShuffle}
                  />
                </Tooltip>
              </HStack>
            </Box>
            <Tabs variant="unstyled" position="relative">
              {/* Tab List */}
              <TabList
                px={4}
                pt={2}
                bg="#f4f4f4"
                gap={2}
                borderBottom="1px solid #ccc"
                justifyContent="flex-start"
                position="relative"
                zIndex={10}
                overflowX="auto"
                sx={{
                  ...customScrollbarStyle,
                  '&::-webkit-scrollbar': {
                    height: '6px',
                  },
                }}
              >
                {['Bài tập', 'Xếp hạng', 'Lịch sử làm bài'].map(
                  (label, idx) => (
                    <MotionTab
                      key={idx}
                      _selected={{
                        bg: 'white',
                        fontWeight: 'bold',
                        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                        border: '1px solid #ccc',
                        borderBottom: 'none',
                      }}
                      _hover={{
                        background: '#e2e2e2',
                      }}
                      transition="all 0.2s ease-in-out"
                      px={6}
                      py={2}
                      bg="transparent"
                      borderRadius="8px 8px 0 0"
                    >
                      {label}
                    </MotionTab>
                  ),
                )}
                {/* Underline */}
                <motion.div
                  layoutId="underline"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    height: '2px',
                    background: '#3182ce',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              </TabList>

              {/* Tab Panels */}
              <TabPanels
                as={motion.div}
                maxH="100vh"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                pl={2}
              >
                <TabPanel>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProblemTab problem={problem} />
                  </motion.div>
                </TabPanel>
                <TabPanel>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <RankingTab />
                  </motion.div>
                </TabPanel>
                <TabPanel>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <HistorySubTab
                      takepartId={takepart}
                      onSubmissionSelect={handleSubmissionSelect}
                    />
                  </motion.div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>

          {/* Editor */}
          <Box width="60%" height="100%" bgColor="gray.200">
            <EditorTab
              takepart={takepart}
              submissionCode={submissionCode}
              currentIndex={currentIndex}
            />
          </Box>
        </Split>
      </Container>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100vh',
              width: '40%',
              backgroundColor: 'white',
              boxShadow: 'lg',
              zIndex: 2000,
              overflowY: 'auto',
              ...customScrollbarStyle,
            }}
          >
            <Box
              p={4}
              borderBottom="1px solid #ccc"
              fontWeight="bold"
              fontSize="lg"
            >
              {contest ? contest.contestName : 'Danh sách bài tập'}
              <IconButton
                aria-label="Back"
                icon={<ArrowBackIcon />}
                size="sm"
                fontSize="20px"
                borderRadius="md"
                variant="ghost"
                float="right"
                onClick={() => setSidebarOpen(false)}
              />
            </Box>

            <Box px={0}>
              {contestProblems.map((item, index) => (
                <Box
                  key={index}
                  py={2}
                  borderBottom="1px solid #eee"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  bg={index % 2 === 0 ? 'gray.50' : 'white'}
                  _hover={
                    currentIndex === index
                      ? {}
                      : { bg: 'gray.100', cursor: 'pointer' }
                  }
                  onClick={() => {
                    if (currentIndex !== index) {
                      setCurrentIndex(index);
                      handleNavigate(item.problemID);
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <Tooltip label={item.problemName} placement="top" hasArrow>
                    <Text
                      fontWeight={currentIndex === index ? 'bold' : 'medium'}
                      mx={3}
                      maxW="70%"
                      isTruncated
                      color={currentIndex === index ? 'gray.500' : 'inherit'}
                      _hover={
                        currentIndex === index ? {} : { color: 'blue.500' }
                      }
                    >
                      {index + 1}. {item.problemName}
                    </Text>
                  </Tooltip>
                </Box>
              ))}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
      {contest && <ContestEndCheckModal contest={contest} />}
    </Box>
  );
};
const customScrollbarStyle = {
  '&::-webkit-scrollbar': {
    width: '10px',
    backgroundColor: '#f0f0f0',
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '5px',
    backgroundColor: '#888',
    border: '2px solid #f0f0f0',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#555',
  },
};
export default ProblemSolver;
