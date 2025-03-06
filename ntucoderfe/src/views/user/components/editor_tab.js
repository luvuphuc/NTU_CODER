import React, { useState } from "react";
import { 
  Box, Select, HStack, Menu, MenuButton, MenuList, MenuItem, Button, 
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, 
  useDisclosure, Text
} from "@chakra-ui/react";
import { CheckIcon, ChevronDownIcon } from "@chakra-ui/icons";
import Editor from "@monaco-editor/react";
import api from "utils/api";
import { useParams } from "react-router-dom";

const sampleCode = {
  1: `#include <stdio.h>\nint main() {\n    printf(\"Hello world\");\n    return 0;\n}`,
  2: `print(\"Hello, World!\")`,
  3: `public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}`,
};

const EditorTab = () => {
  const [language, setLanguage] = useState(1);
  const [theme, setTheme] = useState("vs-light");
  const [code, setCode] = useState(sampleCode[language]); 
  const { id: problemId } = useParams();

  // State cho Modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalStatus, setModalStatus] = useState("success"); // success | error

  // Xử lý thay đổi ngôn ngữ
  const handleLanguageChange = (e) => {
    const newLanguage = Number(e.target.value);
    setLanguage(newLanguage);
    if (code === sampleCode[language]) {
      setCode(sampleCode[newLanguage]);
    }
  };

  // Xử lý gửi bài
  const handleSubmit = async () => {
    try {
      const response = await api.post("/Submission/create", {
        problemId: problemId,
        coderId: 1,
        compilerId: language,
        submitTime: new Date().toISOString(),
        submissionCode: code,
        submissionStatus: 0
      });

      console.log(response);

      if (response.status === 201) {
        setModalTitle("Nộp bài thành công!");
        setModalMessage("Bài của bạn đã được gửi.");
        setModalStatus("success");
        onOpen();
      }
    } catch (error) {
      setModalTitle("Lỗi khi nộp bài!");
      setModalMessage("Đã xảy ra lỗi, vui lòng thử lại.");
      setModalStatus("error");
      onOpen();
    }
  };

  return (
    <Box display="flex" flexDirection="column" p={4}>
      <HStack justify="end" mb={4}>
        <Select value={language} onChange={handleLanguageChange} width="150px">
          <option value={1}>C/C++</option>
          <option value={2}>Python</option>
          <option value={3}>Java</option>
        </Select>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="purple">
            Giao diện
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => setTheme("vs-light")}>VS Light {theme === "vs-light" && <CheckIcon />}</MenuItem>
            <MenuItem onClick={() => setTheme("vs-dark")}>VS Dark {theme === "vs-dark" && <CheckIcon />}</MenuItem>
            <MenuItem onClick={() => setTheme("hc-black")}>High Contrast {theme === "hc-black" && <CheckIcon />}</MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      {/* Trình soạn thảo */}
      <Box borderRadius="md" overflow="hidden" border="1px solid #ddd">
        <Editor
          width="100%"
          height="400px"
          language={language === 1 ? "cpp" : language === 2 ? "python" : "java"}
          theme={theme}
          value={code}
          onChange={(newValue) => setCode(newValue)}
          options={{ fontSize: 14, minimap: { enabled: false } }}
        />
      </Box>

      <HStack justify="flex-end" mt={4}>
        <Button colorScheme="blue">Chạy chương trình</Button>
        <Button colorScheme="green" onClick={handleSubmit}>Nộp bài</Button>
      </HStack>

      {/* Modal Thông báo */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={modalStatus === "success" ? "green.500" : "red.500"}>
            {modalTitle}
          </ModalHeader>
          <ModalBody>
            <Text>{modalMessage}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>Đóng</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EditorTab;
