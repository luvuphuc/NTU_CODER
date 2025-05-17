import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Spinner,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { motion } from 'framer-motion';
import api from 'config/api';

function formatDate({ year, month, day }) {
  return `${String(day).padStart(2, '0')}/${String(month).padStart(
    2,
    '0',
  )}/${year}`;
}

const MotionBox = motion(Box);
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box bg="white" p={2} borderRadius="md" boxShadow="md">
        <Text fontSize="sm" fontWeight="bold">
          Ngày: {label}
        </Text>
        <Text fontSize="sm" color="blue.600">
          Người dùng mới: {payload[0].value}
        </Text>
      </Box>
    );
  }
  return null;
};
export default function UserGrowthChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.100');

  useEffect(() => {
    api
      .get('/Statistic/user-growth')
      .then((res) => {
        const chartData = res.data.map((item) => ({
          ...item,
          date: formatDate(item),
        }));
        setData(chartData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Center h="100%">
        <Spinner size="md" />
      </Center>
    );
  }

  if (error) {
    return (
      <Box color="red.500" textAlign="center" p={2} fontSize="sm">
        Lỗi: {error}
      </Box>
    );
  }

  return (
    <MotionBox
      height="100%"
      maxW="600px"
      mx="auto"
      p={4}
      bg={bgColor}
      borderRadius="2xl"
      boxShadow="0 0 15px 5px rgba(165, 160, 160, 0.3)"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Text
        fontSize="lg"
        fontWeight="bold"
        textAlign="center"
        mb={4}
        color={textColor}
      >
        Biểu đồ tăng trưởng người dùng
      </Text>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="4 2" stroke="#ccc" />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis allowDecimals={false} fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="newUsers"
            stroke="#2b6cb0"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: '#2b6cb0' }}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </MotionBox>
  );
}
