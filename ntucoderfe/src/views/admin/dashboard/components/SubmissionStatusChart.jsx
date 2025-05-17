import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Spinner,
  Center,
  Stack,
  HStack,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from 'recharts';
import api from 'config/api';

const getColorByStatus = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes('accepted')) return '#38a169';
  if (
    lower.includes('fail') ||
    lower.includes('error') ||
    lower.includes('wrong')
  )
    return '#e53e3e';
  return '#4299e1';
};

const renderCustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value, payload: data } = payload[0];
    const color = getColorByStatus(name);
    return (
      <Box bg="white" p={3} borderRadius="md" boxShadow="lg" minW="140px">
        <Text fontWeight="bold" fontSize="sm" mb={1} color={color}>
          {name}
        </Text>
        <Text fontSize="sm" color="gray.600">
          Số lượng: {value}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Tỉ lệ: {(data.percent * 100).toFixed(1)}%
        </Text>
      </Box>
    );
  }
  return null;
};

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  const labelText = payload.name.toLowerCase().includes('accepted')
    ? 'Accepted'
    : 'Failed';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 10}
        outerRadius={outerRadius + 15}
        fill={fill}
        opacity={0.3}
      />
      <text
        x={ex}
        y={ey}
        textAnchor={textAnchor}
        fill={fill}
        fontWeight="bold"
        fontSize={12}
        dominantBaseline="central"
      >
        {`${labelText}: ${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  );
};

const renderLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  payload,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const labelText = payload.name.toLowerCase().includes('accepted')
    ? 'Accepted'
    : 'Failed';

  return (
    <text
      x={x}
      y={y}
      fill={getColorByStatus(payload.name)}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontWeight="bold"
      fontSize={12}
    >
      {`${labelText}: ${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

export default function SubmissionStatusChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    api
      .get('/Statistic/submission-status')
      .then((res) => {
        const json = res.data;
        const total = Object.values(json).reduce((a, b) => a + b, 0);
        const chartData = Object.entries(json).map(([status, count]) => ({
          name: status,
          value: count,
          percent: count / total,
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
      maxW="480px"
      mx="auto"
      p={4}
      boxShadow="md"
      borderRadius="md"
      bg={bgColor}
    >
      <Text fontSize="md" fontWeight="semibold" textAlign="center" mb={1}>
        Trạng thái gửi bài
      </Text>

      <ResponsiveContainer width="100%" height={210}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onClick={(_, index) =>
              setActiveIndex(index === activeIndex ? null : index)
            }
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            isAnimationActive
            animationDuration={800}
            label={activeIndex === null ? renderLabel : false}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColorByStatus(entry.name)} />
            ))}
          </Pie>
          <Tooltip content={renderCustomTooltip} />
        </PieChart>
      </ResponsiveContainer>

      <Stack direction="row" spacing={2} justify="center" mt={1} wrap="wrap">
        {data.map((entry, index) => (
          <HStack key={index} spacing={1}>
            <Badge
              w={2.5}
              h={2.5}
              borderRadius="full"
              bg={getColorByStatus(entry.name)}
            />
            <Text fontSize="sm" color="gray.700">
              {entry.name}
            </Text>
          </HStack>
        ))}
      </Stack>
    </Box>
  );
}
