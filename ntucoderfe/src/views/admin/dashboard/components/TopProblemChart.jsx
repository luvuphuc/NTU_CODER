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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { motion } from 'framer-motion';
import api from 'config/api';

const MotionBar = motion(Bar);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box bg="white" p={2} borderRadius="md" boxShadow="md" fontSize="sm">
        <Text fontWeight="bold">{label}</Text>
        <Text> Số lượt nộp: {payload[0]?.payload?.submissionCount}</Text>
      </Box>
    );
  }
  return null;
};

export default function TopProblemsChart() {
  const bgColor = useColorModeValue('white', 'gray.700');
  const gridStroke = useColorModeValue('#e2e8f0', '#4a5568');
  const tooltipCursorFill = useColorModeValue('#bee3f8', '#2a4365');
  const textColor = useColorModeValue('gray.800', 'gray.200');

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get('/Statistic/top-problems?top=5')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <Center h="140px">
        <Spinner size="md" />
      </Center>
    );

  if (error)
    return (
      <Box color="red.500" textAlign="center" p={2} fontSize="sm">
        Lỗi: {error}
      </Box>
    );

  const chartHeight = Math.max(data.length * 45, 200);

  return (
    <Box
      maxW="700px"
      mx="auto"
      p={4}
      bg={bgColor}
      borderRadius="2xl"
      boxShadow="0 0 15px 5px rgba(165, 160, 160, 0.3)"
      userSelect="none"
    >
      <Text
        fontSize="lg"
        fontWeight="bold"
        textAlign="center"
        mb={4}
        color={textColor}
      >
        Top 5 bài toán được nộp nhiều nhất
      </Text>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="4 2" stroke={gridStroke} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
          <YAxis
            dataKey="problemName"
            type="category"
            width={160}
            tick={{ fontSize: 14, fontWeight: '600' }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: tooltipCursorFill }}
          />
          <Bar
            dataKey="submissionCount"
            fill="#3182ce"
            isAnimationActive={true}
            animationDuration={1000}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
