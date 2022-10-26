import { Identifier } from './shared';

export interface IMenu {
    id: Identifier;
    name: string;
    route: string;
    icon: string;
    parentId?: Identifier;
    background?: string;
    path: string;
    level?: number;
    permissions?: string;
    isDisplay?: boolean;
    displayIndex?: number | null;
    group?: string[];
}

export interface MenuLayout {
    name: string;
    route: string;
    background: string;
    level: number;
    icon: string;
    key: string;
    parentKey?: string;
    children?: MenuLayout[];
    isDisplay?: boolean;
    breadcrumbs?: Array<string>;
    path: string;
    hasPermissionToAccess?: boolean;
    permissions?: string;
}
