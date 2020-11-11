import BasicLayout from '@/layouts/BasicLayout';
import ThinkMind from '@/pages/ThinkMind';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import Test from '@/pages/Test';
import SearchResult from './pages/SearchResult';

const routerConfig = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      { path: '/', exact: true, component: ThinkMind },
      { path: 'register', component: Register },
      { path: 'login', component: Login },
      { path: 'search', component: SearchResult },
      { path: 'test', component: Test },
    ],
  },
];

export default routerConfig;
