import { useState, useEffect } from 'react';
import Header from 'views/user/common/header';
import Navigation from 'views/user/common/navigation';
import FooterUser from 'views/user/common/footer';
import { Box } from '@chakra-ui/react';

export default function LayoutUser({ children }) {
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
      <Header hideHeader={hideHeader} />
      <Navigation hideHeader={hideHeader} />
      <Box as="main" pt="130px">
        {children}
      </Box>
      <FooterUser />
    </Box>
  );
}
