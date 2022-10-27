import { GetDataPath } from '@ag-grid-community/core';
import _ from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '~/AppStore';
import Loading from '~/component/Elements/loading/Loading';
import Overlay, { OverlayRef } from '~/component/Elements/loading/Overlay';
import BaseGrid, { BaseGridColDef, BaseGridRef } from '~/component/Grid/BaseGrid';
import { GridToolbar } from '~/component/Grid/Components/GridToolbar';
import { AppContainer } from '~/component/Layout/AppContainer';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import { useBaseGrid } from '~/hook/useBaseGrid';
import { useMergeState } from '~/hook/useMergeState';
import { requestApi } from '~/lib/axios';
import MenuForm from '~/page/system/menu/components/MenuForm';
import { GET_USER_BY_ID_API } from '~/page/system/user/api/api';
import { Menu } from '~/types/layout/Menu';
import { ComboOption, ITuition } from '~/types/shared';
import { AppUser } from '~/types/ums/AuthUser';
import { INDEX_API, PAYMENT_REQUEST_API, SEMESTER_COMBO_API } from './api/api';
import TuitionForm from './components/TuitionForm';
import TuitionFormDetail from './components/TuitionFormDetail';
import TuitionStatus from './components/TuitionStatus';
interface State {
    loading: boolean;
    semesters: ComboOption[];
}
const TuitionListView: React.FC = () => {
    const { authUser } = useSelector((state: RootState) => state.authData);
    const overlayRef = useRef<OverlayRef>(null);
    const gridRef = useRef<BaseGridRef>(null);
    const modalRef = useRef<ModalRef>(null);
    const [user, setUser] = useState<AppUser | null>(null);
    const gridController = useBaseGrid<Menu>({
        url: INDEX_API,
        gridRef: gridRef,
    });
    const [state, setState] = useMergeState<State>({
        loading: true,
        semesters: [],
    });

    const fetchComBoPermission = async () => {
        const res = await requestApi('get', SEMESTER_COMBO_API);
        if (res.data?.success) {
            setState({
                loading: false,
                semesters: res.data?.result,
            });
        }
    };

    useEffect(() => {
        requestApi('get', `${GET_USER_BY_ID_API}/${authUser?.user?.id}`).then(response => {
            if (response.data.success) {
                setUser(response.data.result);
            }
        });
        fetchComBoPermission();
    }, [gridController?.data]);

    const onPaymentSuggest = async () => {
        modalRef.current?.onOpen(
            <TuitionForm
                initialValues={{ 
                    semesters: state.semesters,
                    userPaymentName: authUser?.user?.fullName,
                    userPaymentId: authUser?.user?.id,
                }}
                onSubmitSuccessfully={() => {
                    modalRef.current?.onClose();
                    gridController?.reloadData();
                }}
                onClose={modalRef.current?.onClose}
            />,
            'Thông tin thanh toán hộ',
            '50%',
        );
    };

    const ondetail = (dataRow: ITuition) => {
        requestApi('get', `${GET_USER_BY_ID_API}/${authUser?.user?.id}`).then(response => {
            if (response.data.success) {
                const user = response.data.result;
                const data = {
                    ...dataRow,
                    userCode: user?.userCode,
                    userName: user?.fullName,
                    userId: user?.id,
                    userPaymentId: authUser?.user.id,
                    userPaymentName: authUser?.user.fullName,
                    semesters: state.semesters,
                };
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
            }
        });
    };
    const getDataPath = useMemo<GetDataPath>(() => {
        return (data: Menu) => {
            return data.group ?? [];
        };
    }, []);

    const MenuColDefs: BaseGridColDef[] = [
        {
            headerName: 'Tên sinh viên',
            field: nameof.full<ITuition>(x => x.userName),
            minWidth: 200,
            flex: 1,
            cellStyle: { textAlign: 'center', fontWeight: '500' },
        },
        {
            headerName: 'Mã sinh viên',
            field: nameof.full<ITuition>(x => x.userCode),
            minWidth: 200,
            flex: 1,
            cellStyle: { textAlign: 'center', fontWeight: '500' },
        },
        {
            headerName: 'Học kì',
            field: nameof.full<ITuition>(x => x.semester),
            minWidth: 200,
            flex: 1,
            cellStyle: { textAlign: 'center', fontWeight: '500' },
            cellRenderer: (data: any) => {
                return _.find(state.semesters, x => x.value === data.value)?.label;
            },
        },
        {
            headerName: 'Tổng học phí',
            field: nameof.full<ITuition>(x => x.totalFee),
            minWidth: 200,
            flex: 1,
            cellStyle: { textAlign: 'center', fontWeight: '500' },
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
                    onClickDetailBtn: (dataRow: any) => {
                        ondetail(dataRow);
                    },
                }}
                actionRowsWidth={120}
                getDataPath={getDataPath}
                groupDefaultExpanded={-1}
            >
                <GridToolbar
                    buttonNameCreate='Thanh toán hộ'
                    hasCreateButton
                    hasRefreshButton={false}
                    onClickCreateButton={onPaymentSuggest}
                    renderActionRightToolBar={() => {
                        return (
                            <div className={'flex ml-0 w-full mb-2'}>
                                <span
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '20px',
                                        color: '#3d9bdb',
                                    }}
                                >
                                    Tài khoản hiện có: <b>{user?.amount} &#8363;</b>
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

export default TuitionListView;
