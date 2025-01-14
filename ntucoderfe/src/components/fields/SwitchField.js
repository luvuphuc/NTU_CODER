import React from "react";
import { Box, Flex, FormLabel, Switch, Text, useColorModeValue } from "@chakra-ui/react";

export default function Default(props) {
  const {
    id,
    label,
    isChecked,
    onChange,
    desc,
    textWidth,
    reversed,
    fontSize,
    ...rest
  } = props;

  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");

  return (
    <Box w="100%" fontWeight="500" {...rest}>
      {reversed ? (
        <Flex align="center" borderRadius="16px">
          <Switch
            id={id}
            size="lg"
            isChecked={isChecked}
            onChange={(e) => onChange && onChange(e.target.checked)}
          />
          <FormLabel
            ms="15px"
            htmlFor={id}
            _hover={{ cursor: "pointer" }}
            direction="column"
            mb="0px"
            maxW={textWidth ? textWidth : "75%"}
          >
            <Text color={textColorPrimary} fontSize="md" fontWeight="500">
              {label}
            </Text>
            <Text color="secondaryGray.600" fontSize={fontSize || "md"}>
              {desc}
            </Text>
          </FormLabel>
        </Flex>
      ) : (
        <Flex justify="space-between" align="center" borderRadius="16px">
          <FormLabel
            htmlFor={id}
            _hover={{ cursor: "pointer" }}
            direction="column"
            maxW={textWidth ? textWidth : "75%"}
          >
            <Text color={textColorPrimary} fontSize="md" fontWeight="500">
              {label}
            </Text>
            <Text color="secondaryGray.600" fontSize={fontSize || "md"}>
              {desc}
            </Text>
          </FormLabel>
          <Switch
            id={id}
            size="lg"
            isChecked={isChecked}
            onChange={(e) => onChange && onChange(e.target.checked)}
          />
        </Flex>
      )}
    </Box>
  );
}
