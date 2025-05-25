import { Box, Stack, Text, Divider } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const typeColors = [
  'blue.600',
  'green.600',
  'yellow.600',
  'purple.600',
  'orange.600',
  'pink.600',
];

export default function SearchResultDropdown({ searchResults, searchString }) {
  if (!searchString.trim()) return null;
  if (!searchResults.length) {
    return (
      <Box
        position="absolute"
        top="calc(100% + 8px)"
        left="0"
        width="250px"
        bg="white"
        boxShadow="xl"
        borderRadius="md"
        zIndex="20"
        maxH="320px"
        pt={4}
        pb={4}
        textAlign="center"
      >
        <Text fontSize="sm" color="gray.500">
          Không tìm thấy
        </Text>
      </Box>
    );
  }

  const grouped = Object.entries(
    searchResults.reduce((groups, item) => {
      if (!groups[item.type]) groups[item.type] = [];
      groups[item.type].push(item);
      return groups;
    }, {}),
  );

  return (
    <Box
      position="absolute"
      top="calc(100% + 8px)"
      left="0"
      width="250px"
      bg="white"
      boxShadow="xl"
      borderRadius="md"
      zIndex="20"
      maxH="320px"
      pt={2}
      overflowY="auto"
      overflowX="hidden"
      sx={customScrollbarStyle}
    >
      {grouped.map(([type, items], index) => {
        const textColor = typeColors[index % typeColors.length];

        return (
          <Box key={type} mb="4" mx="0" borderRadius="md">
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color={textColor}
              textTransform="uppercase"
              letterSpacing="wider"
              borderRadius="md"
              overflowX="hidden"
              px="2"
              pt="3"
              pb="1"
            >
              {type}
            </Text>
            <Divider borderWidth="1.5px" borderColor="gray.200" mb="1" />
            <Stack spacing="1">
              {items.map((item, itemIndex) => (
                <Link
                  key={`${item.url}/${item.id}`}
                  to={`/${item.url}/${item.id}`}
                >
                  <Box
                    px="3"
                    py="1"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.100"
                    transition="all 0.2s"
                    _hover={{ bg: '#ebebf3', cursor: 'pointer' }}
                    cursor="pointer"
                    overflowX="hidden"
                  >
                    <Text
                      fontSize="md"
                      fontWeight="medium"
                      isTruncated
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {item.name}
                    </Text>
                  </Box>
                  {itemIndex < items.length - 1 && (
                    <Divider borderWidth="1.5px" borderColor="gray.200" />
                  )}
                </Link>
              ))}
            </Stack>
          </Box>
        );
      })}
    </Box>
  );
}

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
