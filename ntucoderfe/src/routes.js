import React from 'react';

import { Icon, layout } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdOutlineShoppingCart,
} from 'react-icons/md';

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
        path: 'create',
        component: <CreateCoder />,
      },
      {
        name: 'Chi tiết người dùng',
        path: 'detail/:id',
        component: <CoderDetail />,
      },
    ]
  },
  {
    name: 'Thể loại',
    layout: '/admin',
    path: '/category',
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    secondary: true,
    component: <CategoryIndex/>
  },
  {
    name: 'Bài tập',
    layout: '/admin',
    path: '/problem',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <ProblemIndex />,
    items:[
    {
      name: 'Tạo bài tập',
      path: 'create',
      component: <ProblemCreate />,
    },
    {
      name: 'Chi tiết bài tập',
      path: 'detail/:id',
      component: <ProblemDetail />,
    },
    ]
  },
  {
    name: 'TestCase',
    layout: '/admin',
    path: 'testcase',
    hidden: true,
    
  },
  {
    name: 'Trình biên dịch',
    layout: '/admin',
    path: '/compiler',
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    secondary: true,
    component: <CompilerIndex/>
  },
  {
    name: 'TRANG CHỦ',
    layout: '/user',
    path: '/',
    secondary: true,
    component: <ProblemPage/>
  },
  {
    name: 'BÀI TẬP',
    layout: '/user',
    path: '/problem',
    secondary: true,
    component: <ProblemPage/>,
    items:[
      {
        name: 'Chi tiết bài tập',
        path: 'problem/:id',
        component: <Submission />,
      },
    ]
  },
  {
    name: 'KÌ THI',
    layout: '/user',
    path: '/contest',
    secondary: true,
    component: <ProblemPage/>
  },
  {
    name: 'HỎI & ĐÁP',
    layout: '/user',
    path: '/question',
    secondary: true,
    component: <ProblemPage/>
  },
  {
    name: 'BẢNG CHẤM BÀI',
    layout: '/user',
    path: '/Submission',
    secondary: true,
    component: <ProblemPage/>
  },
  {
    name: 'BÀI VIẾT',
    layout: '/user',
    path: '/blog',
    secondary: true,
    component: <ProblemPage/>
  },
];

export default routes;
