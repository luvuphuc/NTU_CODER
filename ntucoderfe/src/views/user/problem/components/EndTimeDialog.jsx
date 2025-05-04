import { useEffect, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment-timezone';
export default function ContestEndCheckModal({ contest }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const now = moment.tz('Asia/Ho_Chi_Minh');
    const endTime = moment.utc(contest.endTime).tz('Asia/Ho_Chi_Minh');
    if (endTime <= now) {
      onOpen();
    }
  }, [contest.endTime, onOpen]);

  const handleRedirect = () => {
    onClose();
    navigate('/');
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={handleRedirect}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Cuộc thi đã kết thúc
          </AlertDialogHeader>

          <AlertDialogBody>Vui lòng quay lại trang chủ.</AlertDialogBody>

          <AlertDialogFooter>
            <Button
              colorScheme="blue"
              borderRadius="md"
              onClick={handleRedirect}
            >
              QUAY LẠI
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
