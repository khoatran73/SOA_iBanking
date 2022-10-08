import { BaseGridColDef } from '~/component/Grid/BaseGrid';

export const MenuColDefs: BaseGridColDef[] = [
    { field: 'make', headerName: 'Make' },
    { field: 'model', headerName: 'Model' },
    {
        headerName: 'price',
        children: [
            {
                field: 'usd',
            },
            {
                field: 'vnd',
            },
            {
                field: 'bat',
            },
        ],
    },
    //
];
