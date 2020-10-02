import BasicLayout from '@/layouts/BasicLayout';
import Mind from '@/pages/ThinkMind';
import Register from '@/pages/Register';
import Login from '@/pages/Login';

const routerConfig = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      { path: '/', exact: true, component: Mind },
      { path: 'register', component: Register },
      { path: 'login', component: Login },
    ],
  },
];

export default routerConfig;
