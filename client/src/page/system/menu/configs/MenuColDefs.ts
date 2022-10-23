import { BaseGridColDef } from '~/component/Grid/BaseGrid';
import { Menu } from '~/types/layout/Menu';

export const MenuColDefs: BaseGridColDef[] = [
    // {
    //     headerName: 'Name',
    //     field: nameof.full<Menu>(x => x.name),
    //     flex: 1,
    //     rowDrag: true,
    // },
    {
        headerName: 'Route',
        field: nameof.full<Menu>(x => x.route),
        flex: 1,
    },
    {
        headerName: 'Icon',
        field: nameof.full<Menu>(x => x.icon),
        width: 90,
    },
];
