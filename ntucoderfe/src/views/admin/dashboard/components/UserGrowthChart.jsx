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
import api from 'config/api';

function formatDate({ year, month, day }) {
  // format ngày thành string: "YYYY-MM-DD"
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
    2,
    '0',
  )}`;
}

export default function UserGrowthChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bgColor = useColorModeValue('white', 'gray.800');

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

  if (loading)
    return (
      <Center h="140px">
        <Spinner size="md" />
      </Center>
    );

  if (error)
    return (
      <Box color="red.500" textAlign="center" p={2} fontSize="sm">
        Error: {error}
      </Box>
    );

  return (
    <Box
      height="100%"
      maxW="600px"
      mx="auto"
      p={4}
      boxShadow="md"
      borderRadius="md"
      bg={bgColor}
    >
      <Text fontSize="md" fontWeight="semibold" textAlign="center" mb={4}>
        User Growth Over Time
      </Text>

      <ResponsiveContainer width="100%" height={160}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="newUsers"
            stroke="#3182ce"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
