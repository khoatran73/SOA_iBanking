import React from 'react';
import { matchRoutes, RouteMatch, RouteObject, useRoutes } from 'react-router-dom';

//layout
const LayoutPage = React.lazy(() => import('~/component/Layout/LayoutPage'));
const LoginView = React.lazy(() => import('~/component/Layout/LoginView'));
const NotFound = React.lazy(() => import('~/component/Layout/NotFound'));

//system
const MenuListView = React.lazy(() => import('~/page/system/menu/MenuListView'));
const RoleListView = React.lazy(() => import('~/page/system/role/RoleListView'));

const routeList = [
    {
        path: '/',
        element: <LayoutPage />,
        children: [
            {
                path: 'system',
                children: [
                    {
                        path: 'menu',
                        element: <MenuListView />,
                    },
                    {
                        path: 'role',
                        element: <RoleListView />,
                    },
                ],
            },
        ],
    },
    {
        path: '/login',
        element: <LoginView />,
    },
    {
        path: '/*',
        element: <NotFound />,
    },
] as RouteObject[];

export const AppRoute: React.FC = () => {
    if (process.env.NODE_ENV !== 'production') {
        const elements = useRoutes(routeList);
        return <>{elements}</>;
    }
    const elements = useRoutes(routeList);
    return <>{elements}</>;
};

export const useMatchRoute = (pathName: string): RouteMatch<string>[] | null => {
    return matchRoutes(routeList, pathName);
};
