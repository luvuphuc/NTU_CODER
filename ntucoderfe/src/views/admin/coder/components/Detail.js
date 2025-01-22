import React, { useEffect, useState } from "react";
import { Box, Text, VStack, Divider, Flex, Grid, GridItem,Link,Button } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import api from "utils/api";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBack } from "react-icons/md";
const CoderDetail = () => {
  const { id } = useParams();
  const [coderDetail, setCoderDetail] = useState(null);
const navigate = useNavigate();
  useEffect(() => {
    const fetchCoderDetail = async () => {
      try {
        const response = await api.get(`/Coder/${id}`);
        setCoderDetail(response.data);
      } catch (error) {
        console.error("Đã xảy ra lỗi", error);
      }
    };

    if (id) {
      fetchCoderDetail();
    }
  }, [id]);

  if (!coderDetail) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px="25px">
      <Box
        bg="white"
        p="6"
        borderRadius="lg"
        boxShadow="lg"
        maxW="1000px"
        mx="auto"
        border="1px solid #e2e8f0"
      >
        <Flex mb="8px" justifyContent="end" align="end" px="25px">
          <Link><Button 
            variant="solid" 
            size="lg" 
            colorScheme="messenger" 
            borderRadius="md" 
            onClick={() => navigate(`/admin/coder`)}
          >
            Quay lại <MdOutlineArrowBack />
          </Button>
          </Link>
        </Flex>
        <VStack spacing={6} align="stretch">
          <Flex direction="column" align="center">
            <Text fontSize="2xl" fontWeight="bold">{coderDetail.coderName}</Text>
            <Text fontSize="lg">{coderDetail.userName}</Text>
          </Flex>
          <Divider />
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {/* Cột trái */}
            <GridItem>
              <VStack align="stretch" spacing={4}>
                <Text fontSize="lg"><strong>Họ và tên:</strong> {coderDetail.coderName}</Text>
                <Text fontSize="lg"><strong>Tên đăng nhập:</strong> {coderDetail.userName}</Text>
                <Text fontSize="lg"><strong>Email:</strong> {coderDetail.coderEmail}</Text>
                <Text fontSize="lg"><strong>Phone Number:</strong> {coderDetail.phoneNumber}</Text>
                <Text fontSize="lg"><strong>Gender:</strong> {coderDetail.gender ? coderDetail.gender : "Not specified"}</Text>
                <Text fontSize="lg"><strong>Description:</strong> {coderDetail.description || "No description provided"}</Text>
              </VStack>
            </GridItem>

            {/* Cột phải */}
            <GridItem>
              <VStack align="stretch" spacing={4}>
                <Text fontSize="lg"><strong>Created At:</strong> {new Date(coderDetail.createdAt).toLocaleString()}</Text>
                <Text fontSize="lg"><strong>Created By:</strong> {coderDetail.createdBy}</Text>
                {coderDetail.updatedAt && (
                  <>
                    <Text fontSize="lg"><strong>Updated At:</strong> {new Date(coderDetail.updatedAt).toLocaleString()}</Text>
                    <Text fontSize="lg"><strong>Updated By:</strong> {coderDetail.updatedBy}</Text>
                  </>
                )}
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Box>
    </Box>
  );
};

export default CoderDetail;
