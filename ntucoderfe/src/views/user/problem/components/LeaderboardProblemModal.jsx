import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tfoot,
  HStack,
  Avatar,
  Text,
  Badge,
} from '@chakra-ui/react';
import { CiMedal } from 'react-icons/ci';
import { FaMedal } from 'react-icons/fa';

const LeaderboardProblemModal = ({ isOpen, onClose, ranking }) => {
  const getMedal = (rank) => {
    const medalColor = {
      1: 'yellow.400',
      2: 'gray.400',
      3: 'orange.300',
    };
    return (
      <FaMedal
        color={medalColor[rank]}
        title={`Top ${rank}`}
        style={{ display: 'inline-block', verticalAlign: 'middle' }}
      />
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontWeight="bold">
          <HStack spacing={2}>
            <CiMedal size={22} color="#FBBF24" />
            <Text>Bảng xếp hạng chi tiết</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody maxHeight="600px" overflowY="auto" sx={customScrollbarStyle}>
          <Table variant="striped" size="sm" colorScheme="orange">
            <Thead>
              <Tr>
                <Th textAlign="center">#</Th>
                <Th>Coder</Th>
                <Th isNumeric>Số bài đã giải</Th>
                <Th isNumeric>Thời gian (ms)</Th>
              </Tr>
            </Thead>
            <Tbody>
              {ranking.map((user) => (
                <Tr key={user.coderID}>
                  <Td textAlign="center">
                    {user.rank <= 3 ? getMedal(user.rank) : user.rank}
                  </Td>
                  <Td>
                    <HStack spacing={3}>
                      <Avatar
                        size="sm"
                        src={user.avatar}
                        name={user.coderName}
                      />
                      <Text fontWeight="medium">{user.coderName}</Text>
                      {user.rank <= 10 && (
                        <Badge colorScheme="orange" ml={2}>
                          Top {user.rank}
                        </Badge>
                      )}
                    </HStack>
                  </Td>
                  <Td isNumeric>{user.solvedCount}</Td>
                  <Td isNumeric>{user.timeScore}</Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th textAlign="center">#</Th>
                <Th>Coder</Th>
                <Th isNumeric>Số bài đã giải</Th>
                <Th isNumeric>Thời gian (ms)</Th>
              </Tr>
            </Tfoot>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LeaderboardProblemModal;

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
