import { Box } from '@chakra-ui/react';
import React from 'react';

const scrollbarStyles = {
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

const CustomScrollbarBox = ({ children, ...rest }) => {
  return (
    <Box sx={scrollbarStyles} {...rest}>
      {children}
    </Box>
  );
};

export default CustomScrollbarBox;
