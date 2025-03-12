import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Spinner, Tabs, TabList, TabPanels, Tab, TabPanel,Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Split from "react-split";
import Header from "../common/header";
import Navigation from "../common/navigation";
import FooterUser from "../common/footer";
import api from "utils/api";
import ProblemTab from "../components/problem_tab";
import RankingTab from "../components/ranking_tab";
import HistorySubTab from "../components/historysub_tab";
import EditorTab from "../components/editor_tab";


const MotionTab = motion(Tab);

const Submission = () => {
  const { id } = useParams();
  const [problem, setProblemDetail] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const problemRes = await api.get(`/Problem/${id}`);
        const problemData = problemRes.data;
        var sampleTest = null;
        try {
          const testCaseRes = await api.get(`/TestCase/sampleTest?problemId=${id}`);
          if (testCaseRes.data && testCaseRes.data.input && testCaseRes.data.output) {
            sampleTest = {
              sampleInput: testCaseRes.data.input,
              sampleOutput: testCaseRes.data.output,
            };
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.warn("Không tìm thấy test case mẫu, ẩn phần test case.");
          } else {
            console.error("Lỗi khi tải test case mẫu:", error);
          }
        }
        setProblemDetail({
          ...problemData,
          ...(sampleTest ? sampleTest : {}), 
        });
      } catch (error) {
        console.error("Đã xảy ra lỗi", error);
      }
    };
  
    if (id) fetchData();
  }, [id]);
  

  if (!problem) {
    return <Spinner size="xl" />;
  }
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#f4f4f4">
      <Header />
      <Navigation />

      <Container maxW="full" py={3} flex="1" mx="3" bg="white" borderRadius="lg" boxShadow="lg" my={6}>
        <Split className="split" sizes={[40, 60]} minSize={300} gutterSize={10} direction="horizontal">
          {/* Tabs: Bài tập, Xếp hạng, Thảo luận */}
          <Box width="40%" position="relative">
            <Tabs variant="unstyled">
              <TabList
                position="absolute"
                top="-3"
                left="-4"
                width="102.7%"
                borderBottom="1px solid #C0C0C0"
                bg="#E3E3E3"
                display="flex"
                gap={2}
                padding="8px 10px"
                zIndex={1}
                borderTopRadius="lg"
              >
                <MotionTab
                  _selected={{
                    bg: "white",
                    borderBottom: "2px solid #E3E3E3",
                    fontWeight: "bold",
                  }}
                  _hover={{ background: "#DADADA" }}
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
                    bg: "white",
                    borderBottom: "2px solid #E3E3E3",
                    fontWeight: "bold",
                  }}
                  _hover={{ background: "#DADADA" }}
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
                    bg: "white",
                    borderBottom: "2px solid #E3E3E3",
                    fontWeight: "bold",
                  }}
                  _hover={{ background: "#DADADA" }}
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

              <Box pt="50px">
                <TabPanels
                  as={motion.div}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabPanel>
                    <ProblemTab problem={problem} />
                  </TabPanel>
                  <TabPanel  ml={0} pl={0}>
                    <RankingTab />
                  </TabPanel>
                  <TabPanel ml={0} pl={0}>
                    <HistorySubTab/>
                  </TabPanel>
                </TabPanels>
              </Box>
            </Tabs>
          </Box>

          {/* Editor */}
          <Box width="60%">
            <EditorTab />
          </Box>
        </Split>
      </Container>

      <FooterUser />
    </Box>
  );
};

export default Submission;
