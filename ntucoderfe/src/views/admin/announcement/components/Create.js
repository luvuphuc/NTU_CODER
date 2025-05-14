import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  Flex,
  FormLabel,
  FormErrorMessage,
  Input,
  Checkbox,
  Text,
  Box,
  useToast,
  Switch,
  Select,
} from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from 'utils/api';
import FullPageSpinner from 'components/spinner/FullPageSpinner';
export default function AnnouncementModal({
  isOpen,
  onClose,
  onDone,
  announcementID = null,
}) {
  const isEditMode = Boolean(announcementID);
  const [announceContent, setAnnounceContent] = useState('');
  const [contestID, setContestID] = useState(0);
  const [announcementTime, setAnnouncementTime] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [contestList, setContestList] = useState([]);

  const toast = useToast();

  useEffect(() => {
    if (isOpen && isEditMode) {
      setIsFetching(true);
      api
        .get(`/Announcement/${announcementID}`)
        .then((res) => {
          const data = res.data;
          setAnnounceContent(data.announceContent || '');
          setContestID(data.contestID || 0);
          setAnnouncementTime(data.announcementTime?.slice(0, 16) || '');
        })
        .catch((error) => {
          toast({
            title: 'Lỗi khi lấy dữ liệu bài viết',
            description: error.message || 'Đã có lỗi xảy ra.',
            status: 'error',
            duration: 4000,
            isClosable: true,
          });
          onClose();
        })
        .finally(() => setIsFetching(false));
    } else if (isOpen && !isEditMode) {
      setAnnounceContent('');
      setContestID(0);
      setAnnouncementTime('');
    }
    setErrors({});
  }, [announcementID, isOpen]);

  useEffect(() => {
    api
      .get('/Contest/all', { params: { Page: 1, PageSize: 1000 } })
      .then((res) => setContestList(res.data.data || []))
      .catch((err) => console.error('Failed to load contests:', err));
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!contestID) newErrors.contestID = 'Vui lòng chọn cuộc thi';
    if (!announcementTime)
      newErrors.announcementTime = 'Vui lòng chọn thời gian';
    if (!announceContent.trim())
      newErrors.announceContent = 'Nội dung bài viết là bắt buộc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsLoading(true);

    const payload = {
      contestID,
      announcementTime: new Date(announcementTime).toISOString(),
      announceContent,
    };

    try {
      if (isEditMode) {
        await api.put(`/Announcement/${announcementID}`, payload);
        toast({
          title: 'Cập nhật thông báo thành công!',
          status: 'success',
          duration: 3000,
          position: 'top-right',
          isClosable: true,
        });
      } else {
        await api.post('/Announcement/create', payload);
        toast({
          title: 'Tạo thông báo thành công!',
          status: 'success',
          duration: 3000,
          position: 'top-right',
          isClosable: true,
        });
      }
      onDone?.();
      onClose();
    } catch (error) {
      toast({
        title: isEditMode
          ? 'Lỗi khi cập nhật thông báo'
          : 'Lỗi khi tạo thông báo',
        description: error.message || 'Đã có lỗi xảy ra.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" maxH="90vh" overflow="auto">
        <ModalHeader>
          {isEditMode ? 'CẬP NHẬT THÔNG BÁO' : 'TẠO THÔNG BÁO'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isFetching ? (
            <FullPageSpinner />
          ) : (
            <>
              <Flex gap={6} mb={4}>
                <FormControl isRequired isInvalid={errors.contestID} w="50%">
                  <FormLabel fontWeight="bold">Chọn cuộc thi</FormLabel>
                  <Select
                    placeholder="-- Chọn cuộc thi --"
                    value={contestID}
                    onChange={(e) => setContestID(Number(e.target.value))}
                  >
                    {contestList.map((contest) => (
                      <option key={contest.contestID} value={contest.contestID}>
                        {contest.contestName}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.contestID}</FormErrorMessage>
                </FormControl>

                <FormControl
                  isRequired
                  isInvalid={errors.announcementTime}
                  w="50%"
                >
                  <FormLabel fontWeight="bold">Thời gian thông báo</FormLabel>
                  <Input
                    type="datetime-local"
                    value={announcementTime}
                    onChange={(e) => setAnnouncementTime(e.target.value)}
                  />
                  <FormErrorMessage>{errors.announcementTime}</FormErrorMessage>
                </FormControl>
              </Flex>

              <FormControl isInvalid={errors.announceContent} mb={6}>
                <FormLabel fontWeight="bold">Nội dung bài viết *</FormLabel>
                <Box mb={4}>
                  <ReactQuill
                    value={announceContent}
                    onChange={setAnnounceContent}
                    placeholder="Nhập nội dung bài viết"
                    style={{ height: '200px', paddingBottom: '20px' }}
                  />
                </Box>
                <FormErrorMessage>{errors.announceContent}</FormErrorMessage>
              </FormControl>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Hủy
          </Button>
          <Button
            colorScheme="green"
            onClick={handleSave}
            isLoading={isLoading || isFetching}
            isDisabled={isFetching}
          >
            {isEditMode ? 'Cập nhật' : 'Lưu'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
