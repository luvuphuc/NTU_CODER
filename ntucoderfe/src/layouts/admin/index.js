  // Chakra imports
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import { SidebarContext } from 'contexts/SidebarContext';
import React, { useState } from 'react';
import { Navigate, Route, Routes,Outlet } from 'react-router-dom';
import routes from 'routes.js';
import CreateCoder from 'views/admin/coder/components/Create';
import CoderIndex from 'views/admin/coder';
import CoderDetail from 'views/admin/coder/components/Detail';
import CategoryIndex from 'views/admin/category';
import ProblemIndex from 'views/admin/problem';
import ProblemDetail from 'views/admin/problem/components/Detail';
import ProblemCreate from 'views/admin/problem/components/Create';
import CompilerIndex from 'views/admin/compiler';
import ProtectedRoute from 'views/admin/protectedRoute';
import TestCaseIndex from 'views/admin/testcase';
  // Custom Chakra theme
  export default function Dashboard(props) {
    const { ...rest } = props;
    // states and functions
    const [fixed] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const getRoute = () => {
      return window.location.pathname !== '/admin/full-screen-maps';
    };
    const getActiveRoute = (routes) => {
      let activeRoute = 'Default Brand Text';
      for (let i = 0; i < routes.length; i++) {
        if (routes[i].collapse) {
          let collapseActiveRoute = getActiveRoute(routes[i].items);
          if (collapseActiveRoute !== activeRoute) {
            return collapseActiveRoute;
          }
        } else if (routes[i].category) {
          let categoryActiveRoute = getActiveRoute(routes[i].items);
          if (categoryActiveRoute !== activeRoute) {
            return categoryActiveRoute;
          }
        } else {
          if (
            window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
          ) {
            return routes[i].name;
          }
        }
      }
      return activeRoute;
    };
    const getActiveNavbar = (routes) => {
      let activeNavbar = false;
      for (let i = 0; i < routes.length; i++) {
        if (routes[i].collapse) {
          let collapseActiveNavbar = getActiveNavbar(routes[i].items);
          if (collapseActiveNavbar !== activeNavbar) {
            return collapseActiveNavbar;
          }
        } else if (routes[i].category) {
          let categoryActiveNavbar = getActiveNavbar(routes[i].items);
          if (categoryActiveNavbar !== activeNavbar) {
            return categoryActiveNavbar;
          }
        } else {
          if (
            window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
          ) {
            return routes[i].secondary;
          }
        }
      }
      return activeNavbar;
    };
    const getActiveNavbarText = (routes) => {
      let activeNavbar = false;
      for (let i = 0; i < routes.length; i++) {
        if (routes[i].collapse) {
          let collapseActiveNavbar = getActiveNavbarText(routes[i].items);
          if (collapseActiveNavbar !== activeNavbar) {
            return collapseActiveNavbar;
          }
        } else if (routes[i].category) {
          let categoryActiveNavbar = getActiveNavbarText(routes[i].items);
          if (categoryActiveNavbar !== activeNavbar) {
            return categoryActiveNavbar;
          }
        } else {
          if (
            window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
          ) {
            return routes[i].messageNavbar;
          }
        }
      }
      return activeNavbar;
    };
    const getRoutes = (routes) => {
      return routes.map((route, key) => {
        if (route.layout === '/admin') {
          if (route.item) {
            // Nếu có sub-routes, render các sub-route trong item
            return (
              <>
                <Route path={`${route.path}`} element={route.component} key={key} />
                {route.item.map((subRoute, subKey) => (
                  <Route
                    key={subKey}
                    path={`${route.path}/${subRoute.path}`}
                    element={subRoute.component}
                  />
                ))}
              </>
            );
          } else {
            return (
              <Route path={`${route.path}`} element={route.component} key={key} />
            );
          }
        }
        return null;
      });
    };
    
    document.documentElement.dir = 'ltr';
    const { onOpen } = useDisclosure();
    document.documentElement.dir = 'ltr';
    return (
      <Box>
        <Box>
          <SidebarContext.Provider
            value={{
              toggleSidebar,
              setToggleSidebar,
            }}
          >
            <Sidebar routes={routes} display="none" {...rest} />
            <Box
              float="right"
              minHeight="100vh"
              height="100%"
              overflow="auto"
              position="relative"
              maxHeight="100%"
              w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
              maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
              transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
              transitionDuration=".2s, .2s, .35s"
              transitionProperty="top, bottom, width"
              transitionTimingFunction="linear, linear, ease"
            >
              <Portal>
                <Box>
                  <Navbar
                    onOpen={onOpen}
                    logoText={'NTU Coder'}
                    brandText={getActiveRoute(routes)}
                    secondary={getActiveNavbar(routes)}
                    message={getActiveNavbarText(routes)}
                    fixed={fixed}
                    {...rest}
                  />
                </Box>
              </Portal>

              {getRoute() ? (
                <Box
                  mx="auto"
                  p={{ base: '20px', md: '30px' }}
                  pe="20px"
                  minH="100vh"
                  pt="50px"
                >
                  <Routes>
                    {getRoutes(routes)}
                    <Route path="/coder" element={<ProtectedRoute><CoderIndex /></ProtectedRoute>} />
                    <Route path="/coder/create" element={<ProtectedRoute><CreateCoder /></ProtectedRoute>} />
                    <Route path="/coder/detail/:id" element={<ProtectedRoute><CoderDetail /></ProtectedRoute>} />
                    <Route path="/category" element={<ProtectedRoute><CategoryIndex /></ProtectedRoute>} />
                    <Route path="/problem" element={<ProtectedRoute><ProblemIndex /></ProtectedRoute>} />
                    <Route path="/problem/create" element={<ProtectedRoute><ProblemCreate /></ProtectedRoute>} />
                    <Route path="/problem/detail/:id" element={<ProtectedRoute><ProblemDetail /></ProtectedRoute>} />
                    <Route path="/testcase/:problemID" element={<ProtectedRoute><TestCaseIndex /></ProtectedRoute>} />
                    <Route path="/compiler" element={<ProtectedRoute><CompilerIndex /></ProtectedRoute>} />
                    
                    <Route path="/" element={<Navigate to="/admin/default" replace />} />
                  </Routes>
                  
                </Box>
              ) : null}
              <Box>
                <Footer />
              </Box>
            </Box>
          </SidebarContext.Provider>
        </Box>
      </Box>
    );
  }
