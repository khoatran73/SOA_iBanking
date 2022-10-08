import { IconName } from '@fortawesome/free-solid-svg-icons';
import { Identifier } from '../shared';

export interface Menu {
    id: Identifier;
    name: string;
    route: string;
    icon: IconName;
    parentId?: Identifier;
    background?: string;
    path?: string;
    permissions?: string[];
    isDisplay?: boolean;
    displayIndex?: number | null;
    children: Menu[] | null;
}

export interface MenuLayout {
    name: string;
    active: boolean;
    route: string;
    background: string;
    level: number;
    badgeNumber?: number;
    icon: IconName;
    key: string;
    parentKey?: string;
    leaf?: boolean;
    children?: MenuLayout[];
    isDisplay?: boolean;
    breadcrumbs?: Array<string>;
    isLeaf?: boolean;
    hasPermissionToAccess?: boolean;
    path: string;
}
