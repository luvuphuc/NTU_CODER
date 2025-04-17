import React, { useState, useEffect, memo } from 'react';
import Header from 'views/user/common/header';
import Navigation from 'views/user/common/navigation';
import FooterUser from 'views/user/common/footer';
import { Box } from '@chakra-ui/react';

const MemoizedHeader = memo(Header);
const MemoizedNavigation = memo(Navigation);
const MemoizedFooter = memo(FooterUser);

function LayoutUser({ children }) {
  const [hideHeader, setHideHeader] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 70) {
        setHideHeader(true);
      } else {
        setHideHeader(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box>
      <MemoizedHeader hideHeader={hideHeader} />
      <MemoizedNavigation hideHeader={hideHeader} />
      <Box
        as="main"
        pt="130px"
        flex="1"
        minHeight="calc(100vh - 130px - FOOTER_HEIGHT)"
      >
        {children}
      </Box>

      <MemoizedFooter />
    </Box>
  );
}

export default memo(LayoutUser);
