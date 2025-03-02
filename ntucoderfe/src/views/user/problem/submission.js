import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Spinner, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Split from "react-split";
import Header from "../common/header";
import Navigation from "../common/navigation";
import FooterUser from "../common/footer";
import api from "utils/api";
import ProblemTab from "../components/problem_tab";
import RankingTab from "../components/ranking_tab";
import DiscussionTab from "../components/discussion_tab";
import EditorTab from "../components/editor_tab";

const MotionTab = motion(Tab);

const Submission = () => {
  const { id } = useParams();
  const [problem, setProblemDetail] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API lấy thông tin bài toán
        const problemRes = await api.get(`/Problem/${id}`);
        const problemData = problemRes.data;
  
        // Gọi API lấy test case mẫu
        const testCaseRes = await api.get(`/TestCase/sampleTest?problemId=${id}`);
        const testCaseData = testCaseRes.data;
  
        // Hợp nhất dữ liệu từ cả hai API
        setProblemDetail({
          ...problemData, 
          sampleInput: testCaseData.input || "Không có dữ liệu",  // Gán thêm dữ liệu test case
          sampleOutput: testCaseData.output || "Không có dữ liệu",
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

      <Container maxW="container.xl" py={3} flex="1" bg="white" borderRadius="lg" boxShadow="lg" my={6}>
        {/* Chia phần Tabs (40%) và Editor (60%) */}
        <Split className="split" sizes={[40, 60]} minSize={300} gutterSize={10} direction="horizontal">
          {/* Tabs: Bài tập, Xếp hạng, Thảo luận */}
          <Box width="40%" position="relative">
            <Tabs variant="unstyled">
              <TabList
                position="absolute"
                top="-3"
                left="-4"
                width="103%"
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
                  Thảo luận
                </MotionTab>
              </TabList>

              {/* Tạo khoảng trống phía trên nội dung để tránh bị che mất bởi TabList */}
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
                  <TabPanel>
                    <RankingTab />
                  </TabPanel>
                  <TabPanel>
                    <DiscussionTab />
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
