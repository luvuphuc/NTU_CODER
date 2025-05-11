import { Box, HStack, Icon, Text, VStack, Link } from '@chakra-ui/react';
import { GoPin } from 'react-icons/go';
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

const MotionBox = motion(Box);

const PinHomeBlog = () => {
  const sections = {
    Compensation: ['Meta System Design Questions', 'Need Advice'],
    Career: [
      'SDE-2 Interview Journey – Looking for advice',
      'How to crack FAANG from tier 3 college',
    ],
    Google: [
      'Screwed up Google phone interview',
      'Google Onsite – Waiting in Limbo After Interview',
    ],
  };

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    });
  }, []);

  return (
    <MotionBox
      position="sticky"
      top="100px"
      p={6}
      bg="white"
      shadow="sm"
      rounded="2xl"
      h="fit-content"
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={controls}
    >
      <VStack align="start" spacing={6}>
        <HStack spacing={2}>
          <Icon as={GoPin} color="black" boxSize={4} />
          <Text fontWeight="semibold" fontSize="lg" color="gray.500">
            Bài đăng được ghim
          </Text>
        </HStack>

        {Object.entries(sections).map(([tag, items]) => (
          <Box key={tag}>
            <Text fontWeight="semibold" fontSize="sm" color="gray.500">
              #{tag}
            </Text>
            <VStack align="start" spacing={2} mt={2}>
              {items.map((text, i) => (
                <Link
                  key={i}
                  fontSize="sm"
                  color="gray.700"
                  _hover={{ textDecoration: 'underline', color: 'blue.500' }}
                >
                  {text}
                </Link>
              ))}
            </VStack>
          </Box>
        ))}
      </VStack>
    </MotionBox>
  );
};

export default PinHomeBlog;
