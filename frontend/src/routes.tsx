import { Icon } from '@chakra-ui/react';
import { MdHome, MdPeople } from 'react-icons/md';


// Admin Imports
import CivicDashboard from 'views/admin/civic-dashboard';
import UserManagement from 'views/admin/users';


const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome as any} width="20px" height="20px" color="inherit" />,
    component: <CivicDashboard />,
  },
  {
    name: 'User Management',
    layout: '/admin',
    path: '/users',
    icon: <Icon as={MdPeople as any} width="20px" height="20px" color="inherit" />,
    component: <UserManagement />,
  },
];

export default routes;
