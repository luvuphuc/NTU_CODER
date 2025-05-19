import { Box, Text, Flex, Link, Icon, Divider } from '@chakra-ui/react';
import { FaFacebook, FaGithub } from 'react-icons/fa';

export default function FooterUser() {
  return (
    <Box bg="#0186bd" color="white" py={8} px={6}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align="center"
        maxW="6xl"
        mx="auto"
      >
        {/* Logo or Site Name */}
        <Text fontSize="lg" fontWeight="bold">
          NTU-CODER
        </Text>

        {/* Navigation Links */}
        <Flex mt={{ base: 4, md: 0 }}>
          <Link mx={3} href="/about" _hover={{ color: 'gray.200' }}>
            Giới thiệu
          </Link>
          <Link mx={3} href="/terms" _hover={{ color: 'gray.200' }}>
            Điều khoản
          </Link>
          <Link mx={3} href="/contact" _hover={{ color: 'gray.200' }}>
            Liên hệ
          </Link>
        </Flex>

        {/* Social Icons */}
        <Flex mt={{ base: 4, md: 0 }}>
          <Link href="https://facebook.com/luvuphuc382003" isExternal mx={2}>
            <Icon as={FaFacebook} boxSize={5} _hover={{ color: 'gray.200' }} />
          </Link>
          <Link href="https://github.com/luvuphuc" isExternal mx={2}>
            <Icon as={FaGithub} boxSize={5} _hover={{ color: 'gray.200' }} />
          </Link>
        </Flex>
      </Flex>

      <Divider my={4} borderColor="gray.300" />

      <Text textAlign="center" fontSize="sm">
        &copy; {new Date().getFullYear()} NTU-CODER. All rights reserved.
      </Text>
    </Box>
  );
}
