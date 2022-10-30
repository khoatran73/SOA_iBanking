import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ColDef, ColGroupDef, GetDataPath, ModuleRegistry } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { faEdit, faFile, faPlus, faTrash, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Popconfirm } from 'antd';
import _ from 'lodash';
import React, { ReactChild } from 'react';
import { ButtonBase } from '../Elements/Button/ButtonBase';
import './styles/BaseGrid.scss';

export interface BaseGridColDef extends ColDef, Partial<ColGroupDef> {}

ModuleRegistry.registerModules([ClientSideRowModelModule, RowGroupingModule]);

export interface BaseGridProps {
    columnDefs: BaseGridColDef[];
    data: any[] | undefined;
    defaultColDef?: BaseGridColDef;
    gridConfig?: GridConfig;
    numberRows?: boolean;
    actionRows?: boolean;
    actionRowsList?: {
        hasEditBtn?: boolean;
        hasDeleteBtn?: boolean;
        hasDetailBtn?: boolean;
        hasCreateChildBtn?: boolean;
        hasAddUserBtn?: boolean;
        onClickEditBtn?: (data: any) => void;
        onClickDeleteBtn?: (data: any) => void;
        onClickDetailBtn?: (data: any) => void;
        onClickCreateChildBtn?: (data: any) => void;
        onClickAddUserBtn?: (data: any) => void;
    };
    actionRowsWidth?: number;
    treeData?: boolean;
    getDataPath?: GetDataPath;
    groupDefaultExpanded?: number;
    autoGroupColumnDef?: ColDef<any>;
    pagination?: boolean;
    children?: ReactChild; // grid tool bar
}

interface GridConfig {}

export interface BaseGridRef extends AgGridReact {}

const BaseGrid = React.forwardRef<BaseGridRef, BaseGridProps>((props, ref) => {
    const { numberRows = true, actionRows = true, actionRowsList, pagination = true } = props;

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
            cellRenderer: (params: any) => {
                const data = _.get(params, 'data');
                return (
                    <div className="w-full h-full flex items-center justify-center">
                        {actionRowsList?.hasDetailBtn && (
                            <ButtonBase
                                startIcon={faFile}
                                variant={'primary'}
                                onClick={() => {
                                    actionRowsList.onClickDetailBtn?.(data);
                                }}
                                tooltip="Chi tiết"
                            />
                        )}
                        {actionRowsList?.hasCreateChildBtn && (
                            <ButtonBase
                                startIcon={faPlus}
                                variant={'primary'}
                                onClick={() => {
                                    actionRowsList.onClickCreateChildBtn?.(data);
                                }}
                                tooltip="Thêm dữ liệu con"
                            />
                        )}
                        {actionRowsList?.hasAddUserBtn && (
                            <ButtonBase
                                startIcon={faUserPlus}
                                variant={'primary'}
                                onClick={() => {
                                    actionRowsList.onClickAddUserBtn?.(data);
                                }}
                                tooltip="Thay đổi người dùng"
                            />
                        )}
                        {actionRowsList?.hasEditBtn && (
                            <ButtonBase
                                startIcon={faEdit}
                                variant={'success'}
                                onClick={() => {
                                    actionRowsList.onClickEditBtn?.(data);
                                }}
                                tooltip="Cập nhật"
                            />
                        )}
                        {actionRowsList?.hasDeleteBtn && (
                            <Popconfirm
                                placement="topRight"
                                title={'Bạn có chắc muốn xóa ?'}
                                onConfirm={e => actionRowsList.onClickDeleteBtn?.(data)}
                                okText="Đồng ý"
                                cancelText="Đóng"
                            >
                                <ButtonBase startIcon={faTrash} variant={'danger'} />
                            </Popconfirm>
                        )}
                    </div>
                );
            },
        });

    return (
        <div className="w-full h-full">
            <div className="h-[6%]">{props.children}</div>
            <div className="w-full h-[94%] ag-theme-alpine grid base-grid">
                {props.data && (
                    <AgGridReact
                        ref={ref}
                        rowData={props.data}
                        autoGroupColumnDef={props.autoGroupColumnDef}
                        columnDefs={customColDefs}
                        defaultColDef={{
                            resizable: true,
                            floatingFilter: false,
                            ...props.defaultColDef,
                        }}
                        suppressAutoSize
                        pagination={pagination}
                        onGridReady={(params) => params.api.sizeColumnsToFit()}
                        treeData={props.treeData}
                        animateRows
                        getDataPath={props.getDataPath}
                        groupDefaultExpanded={props.groupDefaultExpanded}
                        detailCellRenderer
                        {...props.gridConfig}
                    />
                )}
            </div>
        </div>
    );
});

export default BaseGrid;
