import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
  Spinner,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tfoot,
  Link as ChakraLink,
} from '@chakra-ui/react';
import api from 'config/api';
import { Link as RouterLink } from 'react-router-dom';
const Leaderboard = ({ contest }) => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchRanking = async () => {
      if (contest.status === 2) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(
          `/Contest/ranking-contest?contestID=${contest.contestID}`,
        );
        setRanking(res.data);
      } catch (err) {
        console.error('Failed to load ranking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [contest]);

  const maxQuestionCount = ranking.length
    ? Math.max(...ranking.map((user) => user.takeParts?.length || 0))
    : 0;

  return (
    <Box
      p={4}
      rounded="xl"
      bgGradient="linear(to-br, orange.50, white)"
      shadow="md"
      mb={6}
    >
      <Flex align="center" justify="space-between" mb={4}>
        <Heading size="md" color="orange.500">
          Bảng xếp hạng
        </Heading>
        {contest.status !== 2 && ranking.length > 0 && (
          <Button variant="link" color="blue.500" onClick={onOpen}>
            Chi tiết
          </Button>
        )}
      </Flex>

      {contest.status === 2 ? (
        <Flex
          align="center"
          justify="center"
          direction="column"
          color="gray.500"
          rounded="md"
          borderColor="gray.200"
        >
          <Text fontSize="md" fontStyle="italic">
            Bảng xếp hạng sẽ được hiển thị sau khi kỳ thi kết thúc.
          </Text>
        </Flex>
      ) : loading ? (
        <Spinner />
      ) : ranking.length === 0 ? (
        <Text textAlign="center" color="gray.500" fontStyle="italic">
          Chưa được xếp hạng
        </Text>
      ) : (
        <VStack spacing={2} align="stretch">
          {ranking.slice(0, 5).map((user, index) => (
            <Flex
              key={user.participationID}
              justify="space-between"
              align="center"
              px={4}
              py={2}
              rounded="md"
              bg={
                index === 0
                  ? 'yellow.100'
                  : index === 1
                  ? 'gray.100'
                  : index === 2
                  ? 'orange.50'
                  : 'white'
              }
              _hover={{ bg: 'gray.50' }}
            >
              <HStack spacing={3}>
                <Text fontWeight="bold" minW="24px">
                  #{user.rank}
                </Text>
                <Avatar size="sm" src={user.avatar} name={user.coderName} />
                <Text
                  maxWidth="150px"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {user.coderName}
                </Text>
              </HStack>
              <Text fontWeight="semibold" color="orange.500">
                {user.pointScore}
              </Text>
            </Flex>
          ))}
        </VStack>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent maxWidth="70%" maxHeight="90%">
          <ModalHeader>Bảng xếp hạng chi tiết</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            maxHeight="800px"
            overflowY="scroll"
            sx={customScrollbarStyle}
          >
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Coder</Th>
                  {[...Array(maxQuestionCount)].map((_, idx) => (
                    <Th key={idx} textAlign="center">{`Q${idx + 1}`}</Th>
                  ))}
                  <Th textAlign="center">Tổng điểm</Th>
                  <Th textAlign="center">Thời gian</Th>
                </Tr>
              </Thead>
              <Tbody>
                {ranking.map((user) => {
                  let bg;
                  if (user.rank === 1) bg = 'yellow.100';
                  else if (user.rank === 2) bg = 'gray.100';
                  else if (user.rank === 3) bg = 'orange.50';

                  return (
                    <Tr
                      key={user.participationID}
                      bg={bg}
                      _hover={{ bg: 'gray.50' }}
                    >
                      <Td>{user.rank}</Td>
                      <Td>
                        <HStack spacing={3}>
                          <Avatar
                            size="sm"
                            src={user.avatar}
                            name={user.coderName}
                          />
                          <ChakraLink
                            as={RouterLink}
                            to={`/user/${user.coderID}`}
                            textDecoration="none"
                            _hover={{ textDecoration: 'underline' }}
                            display="flex"
                            alignItems="center"
                          >
                            <Text
                              maxWidth="300px"
                              whiteSpace="nowrap"
                              overflow="hidden"
                              textOverflow="ellipsis"
                            >
                              {user.coderName}
                            </Text>
                          </ChakraLink>
                        </HStack>
                      </Td>
                      {[...Array(maxQuestionCount)].map((_, idx) => (
                        <Td key={idx} textAlign="center">
                          {user.takeParts?.[idx]?.pointWon ?? 0}
                        </Td>
                      ))}
                      <Td textAlign="center">{user.pointScore}</Td>
                      <Td textAlign="center">{user.timeScore} ms</Td>
                    </Tr>
                  );
                })}
              </Tbody>

              <Tfoot>
                <Tr>
                  <Th>#</Th>
                  <Th>Coder</Th>
                  {[...Array(maxQuestionCount)].map((_, idx) => (
                    <Th key={idx} textAlign="center">{`Q${idx + 1}`}</Th>
                  ))}
                  <Th textAlign="center">Tổng điểm</Th>
                  <Th textAlign="center">Thời gian</Th>
                </Tr>
              </Tfoot>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Leaderboard;
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
