import { faClose, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { DatePicker, Input, Select } from 'antd';
import _ from 'lodash';
import React, { useRef, useState } from 'react';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';
import BaseForm, { BaseFormRef } from '~/component/Form/BaseForm';
import { AppModalContainer } from '~/component/Layout/AppModalContainer';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import { requestApi } from '~/lib/axios';
import { Identifier, ITuition } from '~/types/shared';
import { PAYMENT_REQUEST_API } from '../api/api';
import '../style/tuition.scss';
import TuitionPayment from './TuitionPayment';
import TuitionStatus from './TuitionStatus';
import Overlay, { OverlayRef } from '~/component/Elements/loading/Overlay';
import moment from 'moment';
import NotificationConstant from '~/configs/contants';
import NotifyUtil from '~/util/NotifyUtil';

interface Props {
    initialValues?: any;
    parentId?: Identifier;
    disabled?: boolean;
    onClose?: () => void;
    onSubmitSuccessfully?: () => void;
}
type IState = {
    fields: any[];
    isShowPayment: boolean;
    isShowPaymentRequest: boolean;
};
const TuitionFormDetail: React.FC<Props> = props => {
    const formRef = useRef<BaseFormRef>(null);
    const modalRef = useRef<ModalRef>(null);
    const overlayRef = useRef<OverlayRef>(null);
    let { initialValues } = props;
    const status = _.get(
        initialValues,
        nameof.full<ITuition>(x => x.status),
    );
    const expiredAt = moment(
        _.get(
            initialValues,
            nameof.full<ITuition>(x => x.expiredAt),
        ),
    );
    initialValues = {
        ...initialValues,
        expiredAt: expiredAt,
    };
    const isShowPaymentRequestBtn = status === 'waiting' ? true : false;

    const fieldDef = [
        {
            label: 'Tên sinh viên',
            name: nameof.full<ITuition>(x => x.userName),
            children: <Input style={{ color: '#333' }} />,
        },
        {
            label: 'Mã sinh viên',
            name: nameof.full<ITuition>(x => x.userCode),
            children: <Input style={{ color: '#333' }} />,
        },
        {
            label: 'Mã học phí',
            name: nameof.full<ITuition>(x => x.tuitionCode),
            children: <Input style={{ color: '#333' }} />,
        },
        {
            label: 'Học kì',
            name: nameof.full<ITuition>(x => x.semester),
            children: (
                <Select
                    style={{ color: '#333' }}
                    options={initialValues.semesters}
                    showSearch
                    allowClear
                    placeholder="Chọn học kì..."
                />
            ),
        },
        {
            label: 'Hạn thanh toán',
            name: nameof.full<ITuition>(x => x.expiredAt),
            children: (
                <DatePicker  style={{ color: '#333', width: '100%' }} format={'DD/MM/YYYY HH:mm'} />
            ),
        },
        {
            label: 'Tổng học phí',
            name: nameof.full<ITuition>(x => x.totalFee),
            children: <Input style={{ color: '#333' }} />,
        },
    ];
    const [state, setState] = useState<IState>({
        fields: fieldDef,
        isShowPayment: isShowPaymentRequestBtn,
        isShowPaymentRequest: isShowPaymentRequestBtn,
    });
    const onPaymentRequest = () => {
        setState((pre: IState) => {
            return {
                isShowPayment: !pre.isShowPayment,
                isShowPaymentRequest: pre.isShowPaymentRequest,
                fields: [
                    {
                        label: 'Người thanh toán',
                        name: nameof.full<ITuition>(x => x.userPaymentName),
                        children: <Input style={{ color: '#333' }} />,
                    },
                    ...pre.fields,
                ],
            };
        });
    };
    const onPayment = async () => {
        const dataPayment = formRef.current?.getFieldsValue();
        setState((pre: IState) => {
            return {
                ...pre,
                isShowPaymentRequest: pre.isShowPaymentRequest,
            };
        });
        overlayRef.current?.open();
        const response = await requestApi('get', `${PAYMENT_REQUEST_API}/${dataPayment?.id}`);
        if (response.data?.success) {
            overlayRef.current?.close();
            return modalRef.current?.onOpen(
                <TuitionPayment
                    initialValues={dataPayment}
                    disabled={true}
                    onSubmitSuccessfully={props.onSubmitSuccessfully}
                    onClose={modalRef.current?.onClose}
                />,
                'Xác nhận thanh toán',
                '50%',
            );
        }else{
            overlayRef.current?.close();
            NotifyUtil.error(NotificationConstant.TITLE, `${response.data?.message}`);
            props.onClose?.();
        }
    };

    return (
        <>
            <AppModalContainer>
                <BaseForm
                    disabled={props.disabled}
                    initialValues={initialValues}
                    ref={formRef}
                    baseFormItem={state.fields}
                    labelAlign="left"
                    labelCol={4}
                    renderBtnBottom={() => {
                        return (
                            <div className="flex items-center justify-center w-full">
                                {state.isShowPayment ? (
                                    <ButtonBase title="Thanh toán" startIcon={faMoneyBill} onClick={onPaymentRequest} />
                                ) : (
                                    state.isShowPaymentRequest && (
                                        <ButtonBase
                                            title="Xác nhận thanh toán"
                                            startIcon={faMoneyBill}
                                            onClick={onPayment}
                                        />
                                    )
                                )}

                                <ButtonBase title="Đóng" startIcon={faClose} variant="danger" onClick={props.onClose} />
                            </div>
                        );
                    }}
                    renderExtras={() => {
                        const { initialValues } = props;
                        const status = _.get(
                            initialValues,
                            nameof.full<ITuition>(x => x.status),
                        );
                        return (
                            <div className={'flex justify-start w-1/3 items-center'}>
                                <span className={'w-1/2'}>Trạng thái: </span>
                                <div className={'inline-block'}>{TuitionStatus(status)}</div>
                            </div>
                        );
                    }}
                />
                <Overlay ref={overlayRef} />
            </AppModalContainer>
            <ModalBase ref={modalRef} />
        </>
    );
};
export default TuitionFormDetail;
