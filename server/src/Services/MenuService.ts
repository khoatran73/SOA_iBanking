import { Response, Request } from 'express';
import { ApiResponse, ResponseOk } from '../common/ApiResponse';
import { AuthUser } from '../types/Identity';
import { Menu, MenuLayout } from '../types/Menu';

export const getMenuIndex = (req: Request, res: Response) => {
    const result: Menu[] = [
        {
            id: 'f25e75d7-02be-48ce-88ff-8dfdb24155e2',
            name: 'Hệ thống',
            route: '/admin/system',
            icon: 'user-gear',
            parentId: '2b858bf8-1028-4fa7-90ea-79868d9d42fd',
            background: '#030303',
            path: '2b858bf8-1028-4fa7-90ea-79868d9d42fd.f25e75d7-02be-48ce-88ff-8dfdb24155e2',
            permissions: [],
            children: [
                {
                    id: 'fe102cca-93d3-49b3-96a4-c5d611e61c77',
                    name: 'Menu',
                    route: '/admin/system/menu',
                    icon: 'home',
                    parentId: 'f25e75d7-02be-48ce-88ff-8dfdb24155e2',
                    background: '#c9c9c9',
                    path: '2b858bf8-1028-4fa7-90ea-79868d9d42fd.f25e75d7-02be-48ce-88ff-8dfdb24155e2.fe102cca-93d3-49b3-96a4-c5d611e61c77',
                    isDisplay: true,
                    displayIndex: null,
                    permissions: [],
                    children: null,
                },
            ],
        },
    ];

    return res.json(ResponseOk<Menu[]>(result));
};

export const getMenuLayout = (req: Request, res: Response) => {
    const result: MenuLayout[] = [
        {
            key: 'f25e75d7-02be-48ce-88ff-8dfdb24155e2',
            name: 'Hệ thống',
            route: '/admin/system',
            icon: 'user-gear',
            parentKey: '2b858bf8-1028-4fa7-90ea-79868d9d42fd',
            background: '#030303',
            isDisplay: true,
            level: 1,
            badgeNumber: 0,
            active: true,
            path: '2b858bf8-1028-4fa7-90ea-79868d9d42fd.f25e75d7-02be-48ce-88ff-8dfdb24155e2',
            breadcrumbs: ['Hệ thống'],
            isLeaf: false,
            hasPermissionToAccess: true,
        },
        {
            key: '62f75944-01e4-4bca-921c-27bc6d4d308b',
            name: 'Vai trò',
            route: '/system/role',
            icon: 'users-gear',
            parentKey: 'f25e75d7-02be-48ce-88ff-8dfdb24155e2',
            background: '#c9c9c9',
            isDisplay: true,
            level: 2,
            badgeNumber: 0,
            active: true,
            path: '2b858bf8-1028-4fa7-90ea-79868d9d42fd.f25e75d7-02be-48ce-88ff-8dfdb24155e2.62f75944-01e4-4bca-921c-27bc6d4d308b',
            breadcrumbs: ['Hệ thống', 'Vai trò'],
            isLeaf: false,
            hasPermissionToAccess: true,
        },
        {
            key: 'fe102cca-93d3-49b3-96a4-c5d611e61c77',
            name: 'Menu',
            route: '/system/menu',
            icon: 'gear',
            parentKey: 'f25e75d7-02be-48ce-88ff-8dfdb24155e2',
            background: '#c9c9c9',
            isDisplay: true,
            level: 2,
            badgeNumber: 0,
            active: true,
            path: '2b858bf8-1028-4fa7-90ea-79868d9d42fd.f25e75d7-02be-48ce-88ff-8dfdb24155e2.fe102cca-93d3-49b3-96a4-c5d611e61c77',
            breadcrumbs: ['Hệ thống', 'Menu'],
            isLeaf: false,
            hasPermissionToAccess: true,
        },
    ];

    return res.json(ResponseOk<MenuLayout[]>(result));
};
