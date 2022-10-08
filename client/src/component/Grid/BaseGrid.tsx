import React, { ReactChild, useImperativeHandle, useRef } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ColGroupDef, ColumnApi, Grid, GridApi, GridOptions, RowNode } from 'ag-grid-community';
import Loading from '../Elements/loading/Loading';
import { GridToolbar, GridToolbarProps } from './Components/GridToolbar';
import './styles/BaseGrid.scss';
import _ from 'lodash';
import { BaseIcon } from '../Icon/BaseIcon';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ButtonBase } from '../Elements/Button/ButtonBase';

export interface BaseGridColDef extends ColDef, Partial<ColGroupDef> {}

export interface BaseGridProps {
    columnDefs: BaseGridColDef[];
    data: any[];
    defaultColDef?: BaseGridColDef;
    gridConfig?: GridConfig;
    numberRows?: boolean;
    actionRows?: boolean;
    actionRowsWidth?: number;
    children?: ReactChild; // grid tool bar
}

interface GridConfig {}

export interface BaseGridRef {
    reload: () => void;
}

const BaseGrid = React.forwardRef<BaseGridRef, BaseGridProps>((props, ref) => {
    const gridRef = useRef<AgGridReact>(null);
    useImperativeHandle(ref, () => ({
        reload: reload,
    }));

    const { numberRows = true, actionRows = true } = props;

    const reload = () => {
        //do some thing
    };

    const customColDefs = (
        numberRows
            ? [
                  {
                      field: 'stt',
                      headerName: 'STT',
                      width: 60,
                      cellStyle: {
                          textAlign: 'center',
                      },
                      valueGetter: params => {
                          const rowIndex = _.get(params, 'node.rowIndex');

                          return Number(rowIndex) + 1;
                      },
                  },
              ]
            : []
    ) as BaseGridColDef[];

    customColDefs.push(...props.columnDefs);

    actionRows &&
        customColDefs.push({
            field: 'actionRows',
            headerName: 'Hành động',
            width: props.actionRowsWidth ?? 100,
            cellStyle: {
                textAlign: 'center',
            },
            cellRenderer: () => {
                return (
                    <div className="w-full h-full flex items-center justify-center">
                        <ButtonBase startIcon={faEdit} variant={'success'} />
                        <ButtonBase startIcon={faTrash} variant={'danger'} />
                    </div>
                );
            },
        });

    return (
        <div className="w-full h-full">
            <div className="h-[6%]">{props.children}</div>
            <div className="w-full h-[94%] ag-theme-alpine grid base-grid">
                <AgGridReact
                    ref={gridRef}
                    rowData={props.data}
                    columnDefs={customColDefs}
                    defaultColDef={{
                        resizable: true,
                        suppressSizeToFit: true,
                        floatingFilter: false,
                        suppressAutoSize: true,
                        ...props.defaultColDef,
                    }}
                    suppressAutoSize
                    pagination
                    loadingOverlayComponent={<Loading />}
                    onGridReady={() => {
                        console.log(123);
                        setTimeout(function () {
                            gridRef.current?.api.sizeColumnsToFit();
                        }, 200);
                    }}
                    {...props.gridConfig}
                />
            </div>
        </div>
    );
});

export default BaseGrid;
