import _ from 'lodash';
import React, { useRef } from 'react';
import Loading from '~/component/Elements/loading/Loading';
import BaseGrid, { BaseGridRef } from '~/component/Grid/BaseGrid';
import { GridToolbar } from '~/component/Grid/Components/GridToolbar';
import { AppContainer } from '~/component/Layout/AppContainer';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import { useBaseGrid } from '~/hook/useBaseGrid';
import { Menu } from '~/types/layout/Menu';
import { MENU_INDEX_API } from './api/api';
import MenuForm from './components/MenuForm';
import { MenuColDefs } from './configs/MenuColDefs';

const MenuListView: React.FC = () => {
    const gridRef = useRef<BaseGridRef>(null);
    const modalRef = useRef<ModalRef>(null);
    const gridController = useBaseGrid<Menu>({
        url: MENU_INDEX_API,
        gridRef: gridRef,
    });

    const onCreate = () => {
        modalRef.current?.onOpen(
            <MenuForm
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

    const onUpdate = (data: Menu) => {
        modalRef.current?.onOpen(
            <MenuForm
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

    const onDelete = (data: Menu) => {
        console.log('🚀 ~ file: MenuListView.tsx ~ line 30 ~ onDelete ~ data', data);
    };

    const onCreateChild = (data: Menu) => {
        modalRef.current?.onOpen(
            <MenuForm
                parentId={_.get(data, 'id')}
                onSubmitSuccessfully={() => {
                    modalRef.current?.onClose();
                    gridController?.reloadData();
                }}
                onClose={modalRef.current?.onClose}
            />,
            `Thêm Menu con cho Menu - ${data.name}`,
            '50%',
        );
    };

    if (gridController?.loading) return <Loading />;
    return (
        <AppContainer>
            <BaseGrid
                columnDefs={MenuColDefs}
                data={gridController?.data}
                ref={gridRef}
                numberRows
                actionRowsList={{
                    hasEditBtn: true,
                    hasDeleteBtn: true,
                    hasCreateChildBtn: true,
                    onClickCreateChildBtn: onCreateChild,
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
        </AppContainer>
    );
};

export default MenuListView;
