import React, { useRef } from 'react';
import BaseGrid, { BaseGridRef } from '~/component/Grid/BaseGrid';
import { GridToolbar } from '~/component/Grid/Components/GridToolbar';
import { AppContainer } from '~/component/Layout/AppContainer';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import MenuForm from './components/MenuForm';
import { MenuColDefs } from './configs/MenuColDefs';

const MenuListView: React.FC = () => {
    const gridRef = useRef<BaseGridRef>(null);
    const modalRef = useRef<ModalRef>(null);
    const data = [
        { make: 'Toyota', model: 'Celica', price: 35000 },
        { make: 'Ford', model: 'Mondeo', price: 32000 },
        { make: 'Porsche', model: 'Boxster', price: 72000 },
    ];

    const onCreate = () => {
        modalRef.current?.onOpen(<MenuForm onClose={modalRef.current?.onClose} />, 'Tạo mới Menu', '50%');
    };

    return (
        <AppContainer>
            <BaseGrid columnDefs={MenuColDefs} data={data} ref={gridRef} numberRows>
                <GridToolbar hasCreateButton hasRefreshButton onClickCreateButton={onCreate} />
            </BaseGrid>
            <ModalBase ref={modalRef} />
        </AppContainer>
    );
};

export default MenuListView;
