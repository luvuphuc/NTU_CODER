import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Link,
  Skeleton,
  Divider,
} from '@chakra-ui/react';
import { GoPin } from 'react-icons/go';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from 'config/api';

const MotionBox = motion(Box);

const PinHomeBlog = ({ onPostClick }) => {
  const [pinnedBlogs, setPinnedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    });

    const fetchPinned = async () => {
      try {
        const res = await api.get('/Blog/all', {
          params: {
            ascending: true,
            sortfield: 'blogdate',
            published: true,
            pinHome: true,
          },
        });
        setPinnedBlogs(res.data.data || []);
      } catch (err) {
        console.error('Lỗi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPinned();
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
      <VStack align="start" spacing={2}>
        <HStack spacing={2}>
          <Icon as={GoPin} color="black" boxSize={4} />
          <Text fontWeight="semibold" fontSize="lg" color="gray.500">
            Bài đăng được ghim
          </Text>
        </HStack>

        {loading
          ? Array.from({ length: 2 }).map((_, idx) => (
              <Box key={idx}>
                <Skeleton height="16px" mb={1} width="70%" />
                <Skeleton height="40px" />
              </Box>
            ))
          : pinnedBlogs.map((post, index) => (
              <Box key={post.blogID} w="100%">
                <Link
                  onClick={() => onPostClick(post)}
                  fontWeight="semibold"
                  fontSize="sm"
                  color="gray.700"
                  _hover={{ textDecoration: 'underline', color: 'blue.500' }}
                >
                  {post.title}
                </Link>
                <Text
                  mt={1}
                  fontSize="sm"
                  color="gray.600"
                  noOfLines={3}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                {index < pinnedBlogs.length - 1 && <Divider my={2} />}
              </Box>
            ))}
      </VStack>
    </MotionBox>
  );
};

export default PinHomeBlog;
