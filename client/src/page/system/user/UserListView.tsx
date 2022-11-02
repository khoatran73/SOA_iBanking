import { icon } from '@fortawesome/fontawesome-svg-core';
import { faAppleAlt } from '@fortawesome/free-solid-svg-icons';
import { GetDataPath } from 'ag-grid-community';
import _ from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Loading from 'react-loading';
import { useSelector } from 'react-redux';
import { RootState } from '~/AppStore';
import Overlay, { OverlayRef } from '~/component/Elements/loading/Overlay';
import BaseGrid, { BaseGridColDef, BaseGridRef } from '~/component/Grid/BaseGrid';
import { GridToolbar } from '~/component/Grid/Components/GridToolbar';
import { AppContainer } from '~/component/Layout/AppContainer';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import { useBaseGrid } from '~/hook/useBaseGrid';
import { useMergeState } from '~/hook/useMergeState';
import { baseDeleteApi, requestApi } from '~/lib/axios';
import { DELETE_USER_BY_ID_API, USER_LIST_API } from '~/page/system/user/api/api';
import { Menu } from '~/types/layout/Menu';
import { ComboOption, ITuition } from '~/types/shared';
import { AppUser, IUser } from '~/types/ums/AuthUser';
import UserForm from './component/UserForm';

interface State {
    loading: boolean;
    semesters: ComboOption[];
}
const UserListView: React.FC = () => {
    const { authUser } = useSelector((state: RootState) => state.authData);
    const overlayRef = useRef<OverlayRef>(null);
    const gridRef = useRef<BaseGridRef>(null);
    const modalRef = useRef<ModalRef>(null);
    const [user, setUser] = useState<AppUser | null>(null);
    const gridController = useBaseGrid<ITuition>({
        url: USER_LIST_API,
        gridRef: gridRef,
    });
    const [state, setState] = useMergeState<State>({
        loading: true,
        semesters: [],
    });

    const getDataPath = useMemo<GetDataPath>(() => {
        return (data: Menu) => {
            return data?.group ?? [];
        };
    }, []);

    const ondetail = (dataRow: IUser) => {
        modalRef.current?.onOpen(
            <UserForm
                readonly={true}
                initialValues={dataRow}
                onSubmitSuccessfully={() => {
                    modalRef.current?.onClose();
                    gridController?.reloadData();
                }}
                onClose={modalRef.current?.onClose}
            />,
            'Tạo mới tài khoản',
            '80%',
            faAppleAlt
        );
    };
    const onCreate = () => {
        modalRef.current?.onOpen(
            <UserForm
                onSubmitSuccessfully={() => {
                    modalRef.current?.onClose();
                    gridController?.reloadData();
                }}
                onClose={modalRef.current?.onClose}
                
            />,
            'Tạo mới tài khoản',
            '50%',
           
        
        );
    };

    const MenuColDefs: BaseGridColDef[] = [
        {
            headerName: 'Tên người dùng',
            field: nameof.full<AppUser>(x => x.fullName),
            minWidth: 200,
            flex: 1,
            cellStyle: { textAlign: 'center', fontWeight: '500' },
        },
        {
            headerName: 'Username',
            field: nameof.full<AppUser>(x => x.username),
            minWidth: 200,
            flex: 1,
            cellStyle: { textAlign: 'center', fontWeight: '500' },
        },
        {
            headerName: 'Địa chỉ Email',
            field: nameof.full<AppUser>(x => x.emailAddress),
            minWidth: 200,
            flex: 1,
            cellStyle: { textAlign: 'center', fontWeight: '500' },
        },
        {
            headerName: 'Số điện thoại',
            field: nameof.full<AppUser>(x => x.phoneNumber),
            minWidth: 200,
            flex: 1,
            cellStyle: { textAlign: 'center', fontWeight: '500' },
        },
        {
            headerName: 'Vai trò',
            field: nameof.full<AppUser>(x => x.isSupper),
            minWidth: 200,
            flex: 1,
            cellStyle: { textAlign: 'center', fontWeight: '500' },
            cellRenderer: (data: any) => {
                return data.value ? 'Quản trị viên' : 'Người dùng';
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
                    hasDeleteBtn: true,
                    onClickDetailBtn: (dataRow: any) => {
                        ondetail(dataRow);
                    },
                    onClickDeleteBtn(data) {
                        baseDeleteApi(DELETE_USER_BY_ID_API, data.id);
                        gridController?.reloadData();
                    },
                }}
                actionRowsWidth={120}
                getDataPath={getDataPath}
                groupDefaultExpanded={-1}
            >
                <GridToolbar
                    hasCreateButton={true}
                    hasRefreshButton={false}
                    onClickCreateButton={onCreate}
                    renderAdditionLeftToolBar={() => {
                        return (
                            <div className={'flex ml-0 w-full mb-2'}>
                                <span
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '20px',
                                        color: '#3d9bdb',
                                    }}
                                >
                                    <b>Danh sách người dùng:</b>
                                </span>
                            </div>
                        );
                    }}
                />
            </BaseGrid>
            <Overlay ref={overlayRef} />
            <ModalBase ref={modalRef} />
        </AppContainer>
    );
};

export default UserListView;
