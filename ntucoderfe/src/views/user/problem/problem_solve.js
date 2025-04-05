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
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Split from 'react-split';
import api from 'utils/api';
import ProblemTab from '../components/problem_tab';
import RankingTab from '../components/ranking_tab';
import HistorySubTab from '../components/historysub_tab';
import EditorTab from '../components/editor_tab';
import Cookies from 'js-cookie';
import Layout from 'layouts/user';
const MotionTab = motion(Tab);

const ProblemSolver = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblemDetail] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const token = Cookies.get('token');
  useEffect(() => {
    // Nếu chưa đăng nhập, hiển thị modal yêu cầu đăng nhập
    if (!token) {
      onOpen();
      return;
    }

    const fetchData = async () => {
      try {
        const problemRes = await api.get(`/Problem/${id}`);
        const problemData = problemRes.data;
        let sampleTest = null;
        try {
          const testCaseRes = await api.get(
            `/TestCase/sampleTest?problemId=${id}`,
          );
          if (
            testCaseRes.data &&
            testCaseRes.data.input &&
            testCaseRes.data.output
          ) {
            sampleTest = {
              sampleInput: testCaseRes.data.input,
              sampleOutput: testCaseRes.data.output,
            };
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.warn('Không tìm thấy test case mẫu, ẩn phần test case.');
          } else {
            console.error('Lỗi khi tải test case mẫu:', error);
          }
        }
        setProblemDetail({
          ...problemData,
          ...(sampleTest ? sampleTest : {}),
        });
      } catch (error) {
        console.error('Đã xảy ra lỗi', error);
      }
    };

    if (id) fetchData();
  }, [id, token, onOpen]);

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
    return <Spinner size="xl" />;
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
          minSize={300}
          gutterSize={5}
          direction="horizontal"
        >
          {/* Tabs: Bài tập, Xếp hạng, Thảo luận */}
          <Box width="40%" overflowY="auto">
            <Tabs variant="unstyled">
              <TabList
                width="100%"
                borderBottom="1px solid #C0C0C0"
                bg="#E3E3E3"
                display="flex"
                gap={2}
                padding="8px 10px"
                zIndex={1}
                borderTopRadius="lg"
                boxSizing="border-box"
              >
                <MotionTab
                  _selected={{
                    bg: 'white',
                    borderBottom: '2px solid #E3E3E3',
                    fontWeight: 'bold',
                  }}
                  _hover={{ background: '#DADADA' }}
                  borderTopRadius="lg"
                  px={4}
                  py={2}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Bài tập
                </MotionTab>
                <MotionTab
                  _selected={{
                    bg: 'white',
                    borderBottom: '2px solid #E3E3E3',
                    fontWeight: 'bold',
                  }}
                  _hover={{ background: '#DADADA' }}
                  borderTopRadius="lg"
                  px={4}
                  py={2}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Xếp hạng
                </MotionTab>
                <MotionTab
                  _selected={{
                    bg: 'white',
                    borderBottom: '2px solid #E3E3E3',
                    fontWeight: 'bold',
                  }}
                  _hover={{ background: '#DADADA' }}
                  borderTopRadius="lg"
                  px={4}
                  py={2}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Lịch sử làm bài
                </MotionTab>
              </TabList>

              <Box maxHeight="550px">
                <TabPanels
                  as={motion.div}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  pl={2}
                >
                  <TabPanel>
                    <ProblemTab problem={problem} />
                  </TabPanel>
                  <TabPanel>
                    <RankingTab />
                  </TabPanel>
                  <TabPanel>
                    <HistorySubTab />
                  </TabPanel>
                </TabPanels>
              </Box>
            </Tabs>
          </Box>

          {/* Editor */}
          <Box width="60%" height="100%" bgColor="gray.200">
            <EditorTab />
          </Box>
        </Split>
      </Container>
    </Box>
  );
};

export default ProblemSolver;
