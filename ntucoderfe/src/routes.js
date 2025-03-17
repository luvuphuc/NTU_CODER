import React from 'react';

import { Icon, layout } from '@chakra-ui/react';
import { MdPerson, MdOutlineShoppingCart, MdAssignment } from 'react-icons/md';
import { BiCategory } from 'react-icons/bi';
import { GiProcessor } from 'react-icons/gi';
import { FaTrophy } from 'react-icons/fa';
// Admin Imports
import CoderIndex from 'views/admin/coder/index';
import CreateCoder from 'views/admin/coder/components/Create';
import CoderDetail from 'views/admin/coder/components/Detail';
import CategoryIndex from 'views/admin/category';
import ProblemIndex from 'views/admin/problem';
import ProblemDetail from 'views/admin/problem/components/Detail';
import ProblemCreate from 'views/admin/problem/components/Create';
import CompilerIndex from 'views/admin/compiler';
import ProblemPage from 'views/user/problem/problem_list';
import Submission from 'views/user/problem/submission';
import ContestPage from 'views/user/contest';
import ContestIndex from 'views/admin/contest';
import CreateContest from 'views/admin/contest/components/Create';
import TestCaseIndex from 'views/admin/testcase';
import ContestDetail from 'views/admin/contest/components/Detail';
import HomePage from 'views/user/homepage';
import SignIn from 'views/auth/login';
const routes = [
  {
    name: 'Người dùng',
    layout: '/admin',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    path: '/coder',
    component: <CoderIndex />,
    items: [
      {
        name: 'Tạo người dùng',
        path: '/create',
        component: <CreateCoder />,
      },
      {
        name: 'Chi tiết người dùng',
        path: '/detail/:id',
        component: <CoderDetail />,
      },
    ],
  },
  {
    name: 'Thể loại',
    layout: '/admin',
    path: '/category',
    icon: <Icon as={BiCategory} width="20px" height="20px" color="inherit" />,
    secondary: true,
    component: <CategoryIndex />,
  },
  {
    name: 'Bài tập',
    layout: '/admin',
    path: '/problem',
    icon: <Icon as={MdAssignment} width="20px" height="20px" color="inherit" />,
    component: <ProblemIndex />,
    items: [
      {
        name: 'Tạo bài tập',
        path: '/create',
        component: <ProblemCreate />,
      },
      {
        name: 'Chi tiết bài tập',
        path: '/detail/:id',
        component: <ProblemDetail />,
      },
    ],
  },
  {
    name: 'Cuộc thi',
    layout: '/admin',
    path: '/contest',
    icon: <Icon as={FaTrophy} width="20px" height="20px" color="inherit" />,
    secondary: true,
    component: <ContestIndex />,
    items: [
      {
        name: 'Tạo cuộc thi',
        path: '/create',
        component: <CreateContest />,
      },
      {
        name: 'Chi tiết cuộc thi',
        path: '/detail/:id',
        component: <ContestDetail />,
      },
    ],
  },
  {
    name: 'TestCase',
    layout: '/admin',
    path: 'testcase/:problemID',
    hidden: true,
    component: <TestCaseIndex />,
  },
  {
    name: 'Trình biên dịch',
    layout: '/admin',
    path: '/compiler',
    icon: <Icon as={GiProcessor} width="20px" height="20px" color="inherit" />,
    secondary: true,
    component: <CompilerIndex />,
  },
  {
    name: 'TRANG CHỦ',
    layout: '/user',
    path: '/',
    secondary: true,
    component: <HomePage />,
  },
  {
    name: 'BÀI TẬP',
    layout: '/user',
    path: '/problem',
    secondary: true,
    component: <ProblemPage />,
    items: [
      {
        name: 'Chi tiết bài tập',
        path: 'problem/:id',
        component: <Submission />,
      },
    ],
  },
  {
    name: 'KÌ THI',
    layout: '/user',
    path: '/contest',
    secondary: true,
    component: <ContestPage />,
  },
  {
    name: 'HỎI & ĐÁP',
    layout: '/user',
    path: '/question',
    secondary: true,
    component: <ProblemPage />,
  },
  {
    name: 'BẢNG CHẤM BÀI',
    layout: '/user',
    path: '/Submission',
    secondary: true,
    component: <ProblemPage />,
  },
  {
    name: 'BÀI VIẾT',
    layout: '/user',
    path: '/blog',
    secondary: true,
    component: <ProblemPage />,
  },
  {
    name: 'ĐĂNG NHẬP',
    layout: 'auth',
    path: '/login',
    component: <SignIn />,
  },
];

export default routes;
