import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Spinner, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Split from "react-split";
import Header from "../common/header";
import Navigation from "../common/navigation";
import FooterUser from "../common/footer";
import api from "utils/api";
import ProblemTab from "../components/problem_tab";
import RankingTab from "../components/ranking_tab";
import DiscussionTab from "../components/discussting_tab";
import EditorTab from "../components/editor_tab";

const Submission = () => {
  const { id } = useParams();
  const [problem, setProblemDetail] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const problemRes = await api.get(`/Problem/${id}`);
        setProblemDetail(problemRes.data);
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
        {/* Sử dụng Split để chia phần Tabs (40%) và Editor (60%) */}
        <Split className="split" sizes={[40, 60]} minSize={300} gutterSize={10} direction="horizontal">
          {/* Tabs: Bài tập, Xếp hạng, Thảo luận */}
          <Box width="40%">
            <Tabs variant="soft-rounded" colorScheme="purple">
              <TabList>
                <Tab>Bài tập</Tab>
                <Tab>Xếp hạng</Tab>
                <Tab>Thảo luận</Tab>
              </TabList>

              <TabPanels>
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
