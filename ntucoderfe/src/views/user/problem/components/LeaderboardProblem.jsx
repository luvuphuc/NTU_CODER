import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  HStack,
  Text,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tfoot,
  Spinner,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { MdBarChart } from 'react-icons/md';
import { FaMedal } from 'react-icons/fa';
import api from 'config/api';
import { CiMedal } from 'react-icons/ci';
import LeaderboardProblemModal from './LeaderboardProblemModal';
const LeaderboardProblem = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await api.get(`/Coder/ranking-coder`);
        setRanking(res.data);
      } catch (err) {
        console.error('Failed to load ranking:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  const getMedal = (rank) => {
    const medalColor = {
      1: 'yellow.400',
      2: 'gray.400',
      3: 'orange.300',
    };
    return (
      <Icon
        as={FaMedal}
        color={medalColor[rank]}
        boxSize={5}
        title={`Top ${rank}`}
      />
    );
  };

  return (
    <Box
      p={4}
      rounded="xl"
      bgGradient="linear(to-br, orange.50, white)"
      shadow="md"
      mb={6}
      w="full"
      cursor="pointer"
      onClick={onOpen}
      _hover={{ shadow: 'lg' }}
    >
      <Flex align="center" justify="space-between">
        <HStack spacing={3}>
          <MdBarChart size={20} color="#ED8936" />
          <Text fontWeight="bold" color="orange.500" fontSize="md">
            Bảng xếp hạng
          </Text>
        </HStack>
        {loading ? (
          <Spinner size="sm" />
        ) : (
          <Box
            position="relative"
            w={`${(ranking.slice(0, 5).length - 1) * 20 + 40}px`}
            h="40px"
            display="flex"
            alignItems="center"
          >
            {ranking.slice(0, 5).map((user, index) => {
              const isTop3 = user.rank <= 3;
              const borderColor =
                user.rank === 1
                  ? 'yellow.400'
                  : user.rank === 2
                  ? 'gray.400'
                  : user.rank === 3
                  ? 'orange.300'
                  : 'white';

              return (
                <Box
                  key={user.coderID}
                  position="absolute"
                  left={`${index * 20}px`}
                  zIndex={ranking.length - index}
                >
                  <Box position="relative">
                    <Avatar
                      size="sm"
                      src={user.avatar}
                      name={user.coderName}
                      border="2px solid white"
                      boxShadow={user.rank <= 3 ? '0 0 0 2px gold' : undefined}
                    />
                    {user.rank <= 3 && (
                      <Icon
                        as={FaMedal}
                        boxSize={3}
                        color={
                          user.rank === 1
                            ? 'yellow.400'
                            : user.rank === 2
                            ? 'gray.400'
                            : 'orange.300'
                        }
                        position="absolute"
                        bottom="-2px"
                        right="-2px"
                        bg="white"
                        borderRadius="full"
                        p="1px"
                      />
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Flex>

      {/* Modal chi tiết */}
      <LeaderboardProblemModal
        isOpen={isOpen}
        onClose={onClose}
        ranking={ranking}
      />
    </Box>
  );
};

export default LeaderboardProblem;

const customScrollbarStyle = {
  '&::-webkit-scrollbar': {
    width: '8px',
    backgroundColor: '#f1f1f1',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#c4c4c4',
    borderRadius: '8px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#a0a0a0',
  },
};
