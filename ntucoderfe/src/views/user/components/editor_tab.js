import React, { useState } from "react";
import { Box, Select, HStack, Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { CheckIcon, ChevronDownIcon } from "@chakra-ui/icons";
import Editor from "@monaco-editor/react";

const sampleCode = {
  cpp: `#include <stdio.h>
int main() {
    printf("Hello world");
    return 0;
}`,
  python: `print("Hello, World!")`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
};

const EditorTab = () => {
  const [language, setLanguage] = useState("cpp");
  const [theme, setTheme] = useState("vs-light");
  const [code, setCode] = useState(sampleCode[language]); 

  // Xử lý thay đổi ngôn ngữ
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    if (code === sampleCode[language]) {
      setCode(sampleCode[newLanguage]);
    }
  };

  return (
    <Box display="flex" flexDirection="column" p={4}>
      <HStack justify="end" mb={4}>
        <Select value={language} onChange={handleLanguageChange} width="150px">
          <option value="cpp">C/C++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
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
          language={language}
          theme={theme}
          value={code}
          onChange={(newValue) => setCode(newValue)}
          options={{ fontSize: 14, minimap: { enabled: false } }}
        />
      </Box>

      <HStack justify="flex-end" mt={4}>
        <Button colorScheme="blue">Chạy chương trình</Button>
        <Button colorScheme="green">Nộp bài</Button>
      </HStack>
    </Box>
  );
};

export default EditorTab;
