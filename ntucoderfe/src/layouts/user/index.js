import React from 'react';
import { Box } from '@chakra-ui/react';
import Navigation from 'views/user/common/navigation';
import Header from 'views/user/common/header';
import FooterUser from 'views/user/common/footer';
const LayoutUser = ({ children }) => {
  return (
    <Box>
      <Header />
      <Navigation />
      <Box as="main" minHeight="100v" pt="130px">
        {children}
      </Box>
      <FooterUser />
    </Box>
  );
};

export default LayoutUser;
