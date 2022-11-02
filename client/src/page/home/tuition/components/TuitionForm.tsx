import { faClose, faSave } from '@fortawesome/free-solid-svg-icons';
import { DatePicker, Input, Select } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';
import Overlay, { OverlayRef } from '~/component/Elements/loading/Overlay';
import BaseForm, { BaseFormRef } from '~/component/Form/BaseForm';
import { AppModalContainer } from '~/component/Layout/AppModalContainer';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import NotificationConstant from '~/configs/contants';
import { requestApi } from '~/lib/axios';
import { Identifier, ITuition } from '~/types/shared';
import NotifyUtil from '~/util/NotifyUtil';
import { PAYMENT_REQUEST_API, PAYMENT_SUGGEST_API } from '../api/api';
import '../style/tuition.scss';
import TuitionPayment from './TuitionPayment';

interface Props {
    initialValues?: any;
    parentId?: Identifier;
    onClose?: () => void;
    onSubmitSuccessfully?: () => void;
}
type IState = {
    fields: any[];
    isShowPayment: boolean;
};
const TuitionForm: React.FC<Props> = props => {
    const formRef = useRef<BaseFormRef>(null);
    const modalRef = useRef<ModalRef>(null);
    const overlayRef = useRef<OverlayRef>(null);

    const onPayment = async () => {
        const dataPayment = formRef.current?.getFieldsValue();
        overlayRef.current?.open();
        const response = await requestApi('get', PAYMENT_REQUEST_API);
        if (response.data?.success) {
            overlayRef.current?.close();
            return modalRef.current?.onOpen(
                <TuitionPayment
                    initialValues={{
                        ...dataPayment,
                        userPaymentId: props.initialValues?.userPaymentId,
                    }}
                    disabled={true}
                    onSubmitSuccessfully={props.onSubmitSuccessfully}
                    onClose={modalRef.current?.onClose}
                />,
                'Xác nhận thanh toán',
                '50%',
            );
        } else {
            overlayRef.current?.close();
        }
    };
    const onPaymentSuggest = async () => {
        const params = formRef.current?.getFieldsValue();
        const response = await requestApi('get', `${PAYMENT_SUGGEST_API}`, params);
        if (response.data?.success) {
            setState((pre: IState) => {
                return {
                    isShowPayment: !pre.isShowPayment,
                    fields: [
                        {
                            label: 'Mã sinh viên',
                            name: nameof.full<ITuition>(x => x.userCode),
                            children: <Input placeholder="Nhập mã sinh viên..." />,
                            rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                        },
                        {
                            label: 'Học kì',
                            name: nameof.full<ITuition>(x => x.semester),
                            children: (
                                <Select
                                    options={props.initialValues.semesters}
                                    showSearch
                                    allowClear
                                    placeholder="Chọn học kì..."
                                />
                            ),
                            rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                        },
                        {
                            label: 'Người thanh toán',
                            name: nameof.full<ITuition>(x => x.userPaymentName),
                            children: <Input disabled={true} style={{ color: '#333' }} />,
                        },
                        {
                            label: 'Tên sinh viên',
                            name: nameof.full<ITuition>(x => x.userName),
                            children: <Input disabled={true} style={{ color: '#333' }} />,
                        },
                        {
                            label: 'Mã học phí',
                            name: nameof.full<ITuition>(x => x.tuitionCode),
                            children: <Input disabled={true} style={{ color: '#333' }} />,
                        },
                        {
                            label: 'Hạn thanh toán',
                            name: nameof.full<ITuition>(x => x.expiredAt),
                            children: (
                                <DatePicker
                                    disabled={true}
                                    style={{ color: '#333', width: '100%' }}
                                    format={'DD/MM/YYYY HH:mm'}
                                />
                            ),
                        },
                        {
                            label: 'Tổng học phí',
                            name: nameof.full<ITuition>(x => x.totalFee),
                            children: <Input disabled={true} style={{ color: '#333' }} />,
                        },
                    ],
                };
            });
            formRef.current?.setFieldsValue({
                ...response.data?.result,
                userPaymentName: props.initialValues.userPaymentName,
                expiredAt: moment(response.data?.result.expiredAt),
            });
        } else {
            NotifyUtil.error(NotificationConstant.TITLE, `${response.data?.message}`);
        }
    };

    const [state, setState] = useState<IState>({
        fields: [
            {
                label: 'Mã sinh viên',
                name: nameof.full<ITuition>(x => x.userCode),
                children: <Input placeholder="Nhập mã sinh viên..." />,
                rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
            },
            {
                label: 'Học kì',
                name: nameof.full<ITuition>(x => x.semester),
                children: (
                    <Select
                        options={props.initialValues.semesters}
                        showSearch
                        allowClear
                        placeholder="Chọn học kì..."
                    />
                ),
                rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
            },
        ],
        isShowPayment: false,
    });

    return (
        <AppModalContainer>
            <BaseForm
                initialValues={props.initialValues}
                ref={formRef}
                baseFormItem={state.fields}
                labelAlign="left"
                labelCol={4}
                renderBtnBottom={() => {
                    return (
                        <div className="flex items-center justify-center w-full">
                            {state.isShowPayment ? (
                                <ButtonBase title="Xác nhận thanh toán" startIcon={faSave} onClick={onPayment} />
                            ) : (
                                <ButtonBase title="Thanh toán hộ" startIcon={faSave} onClick={onPaymentSuggest} />
                            )}
                            <ButtonBase title="Đóng" startIcon={faClose} variant="danger" onClick={props.onClose} />
                        </div>
                    );
                }}
            />
            <Overlay ref={overlayRef} />
            <ModalBase ref={modalRef} />
        </AppModalContainer>
    );
};
export default TuitionForm;
