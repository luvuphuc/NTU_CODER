import {
    Box,
    Flex,
    Image,
    IconButton,
    Button,
    Stack,
    useColorModeValue,
    useDisclosure,
  } from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import logo from '../../../assets/img/ntu-coders.png';
import { DesktopNav,MobileNav } from './navigation';
import { Link, useLocation } from 'react-router-dom';
export default function Header() {
    const location = useLocation();
    const { isOpen, onToggle } = useDisclosure()
    return (
        <Box
        bg={useColorModeValue('white', 'gray.800')}
        borderBottom={1}
        borderStyle="solid"
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        w="100%">
        <Box maxW="1200px" mx="auto"px={{ base: 4, md: 4 }}>
            <Flex
            color={useColorModeValue('gray.600', 'white')}
            minH={'60px'}
            py={{ base: 2 }}
            px={{ base: 4 }}
            align={'center'}
            justify="space-between">
            <Flex
                flex={{ base: 1, md: 'auto' }}
                ml={{ base: -2 }}
                display={{ base: 'flex', md: 'none' }}>
                <IconButton
                onClick={onToggle}
                icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                variant={'ghost'}
                aria-label={'Toggle Navigation'}
                />
            </Flex>
            <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                <Image
                src={logo}
                alt="Logo"
                width="300px"
                />
            </Flex>

            <Stack
                flex={{ base: 1, md: 0 }}
                justify={'flex-end'}
                direction={'row'}
                spacing={6}>
                
                <Button as={'a'} _hover={{ textDecoration: "none" }} fontSize={'md'} fontWeight={400} variant={'link'}><Link to="/login">
                Đăng nhập</Link>
                </Button>
                <Button
                as={'a'} 
                textDecoration="none"
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'md'}
                fontWeight={600}
                color={'white'}
                bg="#0186bd"
                href={'#'}
                _hover={{
                    bg: 'red.300',
                    textDecoration: "none"
                }}>
                Đăng ký
                </Button>
            </Stack>
            </Flex>
        </Box>
        </Box>
    )
}
