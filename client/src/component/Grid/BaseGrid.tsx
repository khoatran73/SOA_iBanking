import { faEdit, faFile, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import _ from 'lodash';
import React, { ReactChild, useImperativeHandle, useRef } from 'react';
import { ButtonBase } from '../Elements/Button/ButtonBase';
import Loading from '../Elements/loading/Loading';
import './styles/BaseGrid.scss';

export interface BaseGridColDef extends ColDef, Partial<ColGroupDef> {}

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
        onClickEditBtn?: (data: any) => void;
        onClickDeleteBtn?: (data: any) => void;
        onClickDetailBtn?: (data: any) => void;
        onClickCreateChildBtn?: (data: any) => void;
    };
    actionRowsWidth?: number;
    treeData?: boolean;
    getDataPath?: (data: any) => string[];
    groupDefaultExpanded?: number;
    children?: ReactChild; // grid tool bar
}

interface GridConfig {}

export interface BaseGridRef extends AgGridReact {}

const BaseGrid = React.forwardRef<BaseGridRef, BaseGridProps>((props, ref) => {
    const { numberRows = true, actionRows = true, actionRowsList } = props;

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
                            <ButtonBase
                                startIcon={faTrash}
                                variant={'danger'}
                                onClick={() => {
                                    // TODO: confirm here
                                    actionRowsList.onClickDeleteBtn?.(data);
                                }}
                                tooltip="Xóa"
                            />
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
                        suppressLoadingOverlay
                        loadingOverlayComponent={<Loading />}
                        overlayLoadingTemplate={'this is loading'}
                        // onGridReady={() => {
                        //     // console.log(123);
                        //     setTimeout(function () {
                        //         gridRef.current?.api.sizeColumnsToFit();
                        //     }, 200);
                        // }}
                        treeData={props.treeData}
                        animateRows
                        groupDefaultExpanded={props.groupDefaultExpanded}
                        {...props.gridConfig}
                    />
                )}
            </div>
        </div>
    );
});

export default BaseGrid;
