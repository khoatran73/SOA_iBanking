import { GetDataPath } from '@ag-grid-community/core';
import _ from 'lodash';
import React, { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '~/AppStore';
import Loading from '~/component/Elements/loading/Loading';
import BaseGrid, { BaseGridColDef, BaseGridRef } from '~/component/Grid/BaseGrid';
import { GridToolbar } from '~/component/Grid/Components/GridToolbar';
import { AppContainer } from '~/component/Layout/AppContainer';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import { useBaseGrid } from '~/hook/useBaseGrid';
import { baseDeleteApi } from '~/lib/axios';
import { MENU_DELETE_API } from '~/page/system/menu/api/api';
import MenuForm from '~/page/system/menu/components/MenuForm';
import { Menu } from '~/types/layout/Menu';
import { ITuition } from '~/types/shared';
import { INDEX_API } from './api/api';
import TuitionFormDetail from './components/TuitionFormDetail';
import TuitionStatus from './components/TuitionStatus';

const TuitionListView: React.FC = () => {
    const { authUser } = useSelector((state: RootState) => state.authData);

    const gridRef = useRef<BaseGridRef>(null);
    const modalRef = useRef<ModalRef>(null);
    const gridController = useBaseGrid<Menu>({
        url: INDEX_API,
        gridRef: gridRef,
    });

    const onCreate = () => {
        modalRef.current?.onOpen(
            <MenuForm
                onSubmitSuccessfully={() => {
                    modalRef.current?.onClose();
                    gridController?.reloadData();
                }}
                initialValues={{
                    icon: 'list-ul',
                }}
                onClose={modalRef.current?.onClose}
            />,
            'Tạo mới Menu',
            '50%',
        );
    };

    const ondetail = (data: ITuition) => {
        modalRef.current?.onOpen(
            <TuitionFormDetail
                disabled={true}
                initialValues={data}
                onSubmitSuccessfully={() => {
                    modalRef.current?.onClose();
                    gridController?.reloadData();
                }}
                onClose={modalRef.current?.onClose}
            />,
            'Chi tiết học phí',
            '50%',
        );
    };
    const getDataPath = useMemo<GetDataPath>(() => {
        return (data: Menu) => {
            return data.group ?? [];
        };
    }, []);

    const MenuColDefs: BaseGridColDef[] = [
        {
            headerName: 'Tên sinh viên',
            field: nameof.full<ITuition>(x => x.user.fullName),
            minWidth: 200,
            flex: 1,
        },
        {
            headerName: 'Mã sinh viên',
            field: nameof.full<ITuition>(x => x.user.userCode),
            minWidth: 200,
            flex: 1,
        },
        {
            headerName: 'Tổng học phí',
            field: nameof.full<ITuition>(x => x.totalFee),
            minWidth: 200,
            flex: 1,
        },
        {
            headerName: 'Trạng thái',
            field: nameof.full<ITuition>(x => x.status),
            minWidth: 200,
            cellRenderer: (data: any) => {
                return TuitionStatus(data.value);
            },
        },
    ];


    if (gridController?.loading) return <Loading />;
    return (
        <AppContainer>
            <BaseGrid
                columnDefs={MenuColDefs}
                data={gridController?.data}
                ref={gridRef}
                numberRows={false}
                pagination={false}
                actionRowsList={{
                    hasDetailBtn: true,
                    onClickDetailBtn: (dataRow: any)=>{
                        const data = {
                            ...dataRow,
                            userPayment:authUser?.user
                        }
                        ondetail(data)
                    },
                }}
                actionRowsWidth={120}
                getDataPath={getDataPath}
                groupDefaultExpanded={-1}
            >
                <GridToolbar
                    hasCreateButton
                    hasRefreshButton
                    onClickCreateButton={onCreate}
                    onClickRefreshButton={() => gridController?.reloadData()}
                    renderActionRightToolBar={() => {
                        return (
                            <div className={'flex ml-0 w-full mb-2'}>
                                <span
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '20px',
                                        color: '#3d9bdb'
                                    }}
                                >
                                    Tài khoản hiện có: <b>{authUser?.user?.amount} &#8363;</b>
                                </span>
                            </div>
                        );
                    }}
                />
            </BaseGrid>
            <ModalBase ref={modalRef} />
        </AppContainer>
    );
};

export default TuitionListView;
