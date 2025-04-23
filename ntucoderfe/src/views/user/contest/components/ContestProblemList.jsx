import React from 'react';
import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { CiViewList } from 'react-icons/ci';
import { Link as RouterLink } from 'react-router-dom';
const ContestProblemList = ({ problems, handleGoToProblem }) => (
  <Box p={4} rounded="xl" bg="gray.50" shadow="md">
    <Flex align="center" justify="space-between" mb={4}>
      <HStack spacing={2}>
        <CiViewList style={{ fontSize: '1.5rem' }} />
        <Heading size="md" color="gray.800">
          Danh sách bài
        </Heading>
      </HStack>
      <Box
        color="orange.600"
        px={2}
        py={1}
        mr={3}
        rounded="full"
        fontSize="md"
        fontWeight="semibold"
      >
        {problems.reduce((sum, p) => sum + (p.point || 0), 0)} điểm
      </Box>
    </Flex>
    <Divider borderColor="gray.400" mb={4} />
    <VStack spacing={3} align="stretch">
      {problems.length > 0 ? (
        problems.map((p, idx) => (
          <Flex
            key={p.hasProblemID}
            justify="space-between"
            align="center"
            px={4}
            py={2}
            rounded="md"
            bg="white"
            shadow="sm"
            _hover={{ bg: 'gray.100' }}
          >
            <HStack spacing={3}>
              <Text fontWeight="bold">{p.problemOrder}.</Text>
              <Link
                as={RouterLink}
                to={`/problem/${p.problemID}`}
                fontWeight="medium"
                color="blue.600"
                _hover={{ color: 'blue.800' }}
                onClick={(e) => {
                  e.preventDefault();
                  handleGoToProblem(p.contestId, p.problemID);
                }}
              >
                {p.problemName.length > 18
                  ? `${p.problemName.slice(0, 18)}...`
                  : p.problemName}
              </Link>
            </HStack>
            <Box
              bg="orange.100"
              color="orange.600"
              px={2}
              py={1}
              rounded="full"
              fontSize="sm"
              fontWeight="semibold"
            >
              {p.point} điểm
            </Box>
          </Flex>
        ))
      ) : (
        <Text fontStyle="italic" color="gray.500">
          Chưa có bài nào
        </Text>
      )}
    </VStack>
  </Box>
);

export default ContestProblemList;
