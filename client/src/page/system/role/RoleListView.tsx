import React, { useRef } from 'react';
import Loading from '~/component/Elements/loading/Loading';
import BaseGrid, { BaseGridColDef, BaseGridRef } from '~/component/Grid/BaseGrid';
import { GridToolbar } from '~/component/Grid/Components/GridToolbar';
import { AppContainer } from '~/component/Layout/AppContainer';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import { useBaseGrid } from '~/hook/useBaseGrid';
import { baseDeleteApi } from '~/lib/axios';
import { RoleGrid } from '~/types/ums/Role';
import { ROLE_DELETE_API, ROLE_INDEX_API } from './api/api';
import RoleAddUserForm from './components/RoleAddUserForm';
import RoleForm from './components/RoleForm';

interface Props {}

const RoleListView: React.FC<Props> = props => {
    const gridRef = useRef<BaseGridRef>(null);
    const modalRef = useRef<ModalRef>(null);

    const gridController = useBaseGrid<RoleGrid>({
        url: ROLE_INDEX_API,
        gridRef: gridRef,
    });

    const onCreate = () => {
        modalRef.current?.onOpen(
            <RoleForm
                onSubmitSuccessfully={() => {
                    modalRef.current?.onClose();
                    gridController?.reloadData();
                }}
                onClose={modalRef.current?.onClose}
            />,
            'Tạo mới Menu',
            '50%',
        );
    };

    const onUpdate = (data: RoleGrid) => {
        modalRef.current?.onOpen(
            <RoleForm
                initialValues={data}
                onSubmitSuccessfully={() => {
                    modalRef.current?.onClose();
                    gridController?.reloadData();
                }}
                onClose={modalRef.current?.onClose}
            />,
            'Cập nhật Menu',
            '50%',
        );
    };

    const onDelete = (data: RoleGrid) => {
        baseDeleteApi(ROLE_DELETE_API, data.id);
        gridController?.reloadData();
    };

    const onAddUserRole = (data: RoleGrid) => {
        modalRef.current?.onOpen(
            <RoleAddUserForm
                id={data.id}
                selectedKeys={data.userIds}
                onSubmitSuccessfully={() => {
                    modalRef.current?.onClose();
                    gridController?.reloadData();
                }}
                onClose={modalRef.current?.onClose}
            />,
            'Cập nhật Menu',
            '50%',
        );
    };

    const RoleColDefs: BaseGridColDef[] = [
        {
            headerName: 'Mã vai trò',
            field: nameof.full<RoleGrid>(x => x.code),
            minWidth: 300,
            flex: 1,
        },
        {
            headerName: 'Tên vai trò',
            field: nameof.full<RoleGrid>(x => x.name),
            minWidth: 500,
        },
    ];

    return (
        <AppContainer>
            {gridController?.loading ? (
                <Loading />
            ) : (
                <>
                    <BaseGrid
                        columnDefs={RoleColDefs}
                        data={gridController?.data}
                        ref={gridRef}
                        actionRowsList={{
                            hasAddUserBtn: true,
                            hasEditBtn: true,
                            hasDeleteBtn: true,
                            onClickAddUserBtn: onAddUserRole,
                            onClickEditBtn: onUpdate,
                            onClickDeleteBtn: onDelete,
                        }}
                        actionRowsWidth={120}
                    >
                        <GridToolbar
                            hasCreateButton
                            hasRefreshButton
                            onClickCreateButton={onCreate}
                            onClickRefreshButton={() => gridController?.reloadData()}
                        />
                    </BaseGrid>
                    <ModalBase ref={modalRef} />
                </>
            )}
        </AppContainer>
    );
};

export default RoleListView;
