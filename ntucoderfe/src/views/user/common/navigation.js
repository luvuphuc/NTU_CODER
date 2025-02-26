import { Box, Flex, Button, Stack, Input, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { SearchIcon } from '@chakra-ui/icons';
import routes from 'routes.js';

export default function Navigation() {
  const location = useLocation(); // Lấy đường dẫn hiện tại

  return (
    <Box bg="#0186bd" w="100%" py={3} borderBottom="1px solid" borderColor="#0170a3">
      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }}>
        <Flex justify="space-between" align="center">
          {/* Menu buttons */}
          <Stack direction="row" spacing={4}>
            {routes
              .filter(route => route.layout === '/user')
              .map(route => (
                <Link to={route.path} key={route.path}>
                  <Button
                    variant="link"
                    fontWeight="500"
                    fontSize="md"
                    px={4}
                    py={2}
                    _hover={{ textDecoration: 'none' }}
                    color={location.pathname === route.path ? '#0186bd' : 'white'}
                    bg={location.pathname === route.path ? 'white' : 'transparent'}
                    borderRadius="10" // Bo tròn góc khi active
                  >
                    {route.icon} {route.name}
                  </Button>
                </Link>
              ))}
          </Stack>

          {/* Search input on the right */}
          <InputGroup maxW="250px">
            <Input placeholder="Tìm kiếm..." bg="white" color="black" />
            <InputRightElement>
              <IconButton
                aria-label="Tìm kiếm"
                icon={<SearchIcon />}
                size="sm"
                bg="transparent"
                _hover={{ bg: 'gray.200' }}
              />
            </InputRightElement>
          </InputGroup>
        </Flex>
      </Box>
    </Box>
  );
}
