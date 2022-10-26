import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { IconName } from '@fortawesome/free-solid-svg-icons';
import { Identifier } from '../shared';

export interface Menu {
    id: Identifier;
    name: string;
    route: string;
    icon: IconProp;
    parentId?: Identifier;
    background?: string;
    path?: string;
    level?: number;
    permissions?: string[];
    isDisplay?: boolean;
    displayIndex?: number | null;
    children: Menu[] | null;
    group?: string[];
}

export interface MenuLayout {
    name: string;
    route: string;
    background: string;
    level: number;
    icon: IconProp;
    key: string;
    parentKey?: string;
    leaf?: boolean;
    children?: MenuLayout[];
    permissions?: string;
    isDisplay?: boolean;
    breadcrumbs?: Array<string>;
    isLeaf?: boolean;
    hasPermissionToAccess?: boolean;
    path: string;
}
