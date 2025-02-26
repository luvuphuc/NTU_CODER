import React, { useState } from "react";
import { Box, Select, HStack, Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { CheckIcon, ChevronDownIcon } from "@chakra-ui/icons";
import Editor from "@monaco-editor/react";

const EditorTab = () => {
  const [code, setCode] = useState("// Viết code của bạn ở đây...");
  const [language, setLanguage] = useState("python");
  const [theme, setTheme] = useState("vs-light");

  return (
    <Box display="flex" flexDirection="column" p={4}>
      <HStack justify="end" mb={4}>
        <Select value={language} onChange={(e) => setLanguage(e.target.value)} width="150px">
          <option value="python">Python</option>
          <option value="cpp">C/C++</option>
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
