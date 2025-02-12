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
];

export default routes;
