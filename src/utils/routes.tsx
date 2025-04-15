import React from 'react';
import {
  Home,
  Inbox,
  User,
  Users,
  BookA,
  Bell,
  MessagesSquare,
  Store,
  ShoppingBag
} from 'lucide-react';

interface Route {
  route: string;
  title: string;
  icon: React.ReactElement;
  roles: string[];
  isSidebarVisible: boolean;
  child_routes: Route[] | [];
}

const routes: Route[] = [
  {
    route: '/dashboard',
    title: 'Dashboard',
    icon: <Store />,
    roles: ['admin', 'user'],
    isSidebarVisible: true,
    child_routes: [],
  },
  {
    route: '/notifications',
    title: 'Notifications',
    icon: <Bell />,
    roles: ['user'],
    isSidebarVisible: true,
    child_routes: [],
  },
  {
    route: '/messages',
    title: 'Messages',
    icon: <MessagesSquare />,
    roles: ['admin', 'user'],
    isSidebarVisible: true,
    child_routes: [],
  },
  {
    route: '/categories',
    title: 'Categories',
    icon: <ShoppingBag />,
    roles: ['admin'],
    isSidebarVisible: true,
    child_routes: [],
  },
  {
    route: '/users-list',
    title: 'Users List',
    icon: <Users />,
    roles: ['admin'],
    isSidebarVisible: true,
    child_routes: [],
  },
  {
    route: '/profile',
    title: 'Profile',
    icon: <User />,
    roles: ['admin', 'user'],
    isSidebarVisible: true,
    child_routes: [],
  },
];

export default routes;
