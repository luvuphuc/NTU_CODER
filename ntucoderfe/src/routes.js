import React from 'react';

import { Icon, layout } from '@chakra-ui/react';
import { MdPerson, MdOutlineShoppingCart, MdAssignment } from 'react-icons/md';
import { BiCategory, BiHome } from 'react-icons/bi';
import { GiProcessor } from 'react-icons/gi';
import { FaTrophy } from 'react-icons/fa';
import CoderIndex from 'views/admin/coder/index';
import CreateCoder from 'views/admin/coder/components/Create';
import CoderDetail from 'views/admin/coder/components/Detail';
import CategoryIndex from 'views/admin/category';
import ProblemIndex from 'views/admin/problem';
import ProblemDetail from 'views/admin/problem/components/Detail';
import ProblemCreate from 'views/admin/problem/components/Create';
import CompilerIndex from 'views/admin/compiler';
import ProblemPage from 'views/user/problem/problem_list';
import ProblemSolver from 'views/user/problem/problem_solve';
import ContestIndex from 'views/admin/contest';
import { BsPostcard } from 'react-icons/bs';
import CreateContest from 'views/admin/contest/components/Create';
import TestCaseIndex from 'views/admin/testcase';
import ContestDetail from 'views/admin/contest/components/Detail';
import HomePage from 'views/user/homepage';
import ContestPage from 'views/user/contest';
import SubmissionPage from 'views/user/submission';
import ContestDetailPage from 'views/user/contest/components/Contest_Detail';
import HasProblemIndex from 'views/admin/hasproblem';
import ProfileCoder from 'views/user/profile';
import BlogIndex from 'views/user/blog';
import BlogIndexAdmin from 'views/admin/blog';
import AnnouncementIndexAdmin from 'views/admin/announcement';
import { GrAnnounce } from 'react-icons/gr';
import AdminDashboard from 'views/admin/dashboard';
import { BiHomeHeart } from 'react-icons/bi';
import SubmissionIndex from 'views/admin/submission';
import DetailSubmissionPage from 'views/admin/submission/components/Detail';
import { BsJournalCode } from 'react-icons/bs';
import ParticipationIndex from 'views/admin/participation';
const routes = [
  {
    name: 'Trang chủ',
    layout: '/admin',
    icon: <Icon as={BiHomeHeart} width="20px" height="20px" color="inherit" />,
    path: '/default',
    allowRoles: [1],
    component: <AdminDashboard />,
  },
  {
    name: 'Người dùng',
    layout: '/admin',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    path: '/coder',
    allowRoles: [1],
    component: <CoderIndex />,
    items: [
      {
        name: 'Tạo người dùng',
        path: '/create',

        component: <CreateCoder />,
        allowRoles: [1],
      },
      {
        name: 'Chi tiết người dùng',
        path: '/detail/:id',
        component: <CoderDetail />,
        allowRoles: [1],
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
    name: 'Bài nộp',
    layout: '/admin',
    path: '/submission',
    icon: (
      <Icon as={BsJournalCode} width="20px" height="20px" color="inherit" />
    ),
    component: <SubmissionIndex />,
    items: [
      {
        name: 'Chi tiết bài nộp',
        path: '/detail/:id',
        component: <DetailSubmissionPage />,
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
    name: 'HasProblem',
    layout: '/admin',
    path: 'hasproblem/:contestID',
    hidden: true,
    component: <HasProblemIndex />,
  },
  {
    name: 'Người dự thi',
    layout: '/admin',
    path: 'participation/:contestID',
    hidden: true,
    component: <ParticipationIndex />,
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
    name: 'Blog',
    layout: '/admin',
    path: '/blog',
    icon: <Icon as={BsPostcard} width="20px" height="20px" color="inherit" />,
    secondary: true,
    component: <BlogIndexAdmin />,
  },
  {
    name: 'Thông báo',
    layout: '/admin',
    path: '/announcement',
    icon: <Icon as={GrAnnounce} width="20px" height="20px" color="inherit" />,
    secondary: true,
    component: <AnnouncementIndexAdmin />,
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
        path: '/:id',
        component: <ProblemSolver />,
      },
    ],
  },
  {
    name: 'KÌ THI',
    layout: '/user',
    path: '/contest',
    secondary: true,
    component: <ContestPage />,
    items: [
      {
        name: 'Chi tiết bài thi',
        path: '/:id',
        component: <ContestDetailPage />,
      },
      {
        name: 'Chi tiết bài tập cuộc thi',
        path: '/:contestId/problem/:id',
        component: <ProblemSolver />,
      },
    ],
  },
  {
    name: 'BÀI VIẾT',
    layout: '/user',
    path: '/blog',
    secondary: true,
    component: <BlogIndex />,
  },
  {
    name: 'BẢNG CHẤM BÀI',
    layout: '/user',
    path: '/submission',
    secondary: true,
    component: <SubmissionPage />,
  },
  {
    name: 'Người dùng',
    layout: '/user',
    path: '/user/:id',
    hidden: true,
    secondary: true,
    component: <ProfileCoder />,
  },
];

export default routes;
