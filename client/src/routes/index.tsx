import React from 'react';
import { matchRoutes, RouteMatch, RouteObject, useRoutes } from 'react-router-dom';
import { NotFound } from '~/component/Layout/NotFound';
import LayoutPage from '~/component/Layout/LayoutPage';
import { LoginView } from '~/component/Layout/LoginView';
import MenuListView from '~/page/system/menu/MenuListView';

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
                    // {
                    //     path: 'role',
                    //     children: [
                    //         {
                    //             path: '',
                    //             element: <RoleListView />,
                    //         },
                    //         {
                    //             path: 'add-claim',
                    //             children: [
                    //                 {
                    //                     path: ':id',
                    //                     element: <RoleAddClaimView />,
                    //                 },
                    //             ],
                    //         },
                    //     ],
                    // },
                ],
            },
        ],
    },
    {
        path: '/login',
        element: <LoginView />,
    },
    // {
    //     path: '/admin',
    //     element: <MainPage />,
    // },
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
