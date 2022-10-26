import { faClose, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { Input } from 'antd';
import _ from 'lodash';
import React, { useRef, useState } from 'react';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';
import BaseForm, { BaseFormRef } from '~/component/Form/BaseForm';
import { AppModalContainer } from '~/component/Layout/AppModalContainer';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import NotificationConstant from '~/configs/contants';
import { requestApi } from '~/lib/axios';
import { Identifier, ITuition } from '~/types/shared';
import NotifyUtil from '~/util/NotifyUtil';
import { PAYMENT_API } from '../api/api';
import '../style/tuition.scss';
import TuitionPayment from './TuitionPayment';
import TuitionStatus from './TuitionStatus';

interface Props {
    initialValues?: ITuition;
    parentId?: Identifier;
    disabled?: boolean;
    onClose?: () => void;
    onSubmitSuccessfully?: () => void;
}
type IState = {
    fields: any[];
    isShowPayment: boolean;
};
const TuitionFormDetail: React.FC<Props> = props => {
    const formRef = useRef<BaseFormRef>(null);
    const modalRef = useRef<ModalRef>(null);
    const { initialValues } = props;
    const status = _.get(
        initialValues,
        nameof.full<ITuition>(x => x.status),
    );
    const isShowPaymentRequest = status === 'waiting' ? true : false;
    const fieldDef = [
        {
            label: 'Tên sinh viên',
            name: nameof.full<ITuition>(x => x.user.fullName),
            children: <Input />,
        },
        {
            label: 'Mã học phí',
            name: nameof.full<ITuition>(x => x.tuitionCode),
            children: <Input />,
        },
        {
            label: 'Hạn thanh toán',
            name: nameof.full<ITuition>(x => x.expiredAt),
            children: <Input type="date" />,
        },
        {
            label: 'Tổng học phí',
            name: nameof.full<ITuition>(x => x.totalFee),
            children: <Input />,
        },
    ];
    const [state, setState] = useState<IState>({
        fields: fieldDef,
        isShowPayment: isShowPaymentRequest,
    });
    const onPaymentRequest = () => {
        setState((pre: IState) => {
            return {
                isShowPayment: !pre.isShowPayment,
                fields: [
                    {
                        label: 'Người thanh toán',
                        name: nameof.full<ITuition>(x => x.userPayment.fullName),
                        children: <Input />,
                    },
                    ...pre.fields,
                ],
            };
        });
    };
    const onPayment = async () => {
        modalRef.current?.onOpen(
            <TuitionPayment
                disabled={true}
                onSubmitSuccessfully={() => {
                    modalRef.current?.onClose();
                }}
                onClose={modalRef.current?.onClose}
            />,
            'Chi tiết học phí',
            '50%',
        );

        // const response = await requestApi('put', `${PAYMENT_API}/${props.initialValues?.id}`);

        // if (response.data?.success) {
        //     NotifyUtil.success(NotificationConstant.TITLE, 'Thanh toán thành công');
        //     props?.onSubmitSuccessfully?.();
        //     props.onClose?.();
        //     return;
        // }
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
                                    <ButtonBase
                                        title="Xác nhận thanh toán"
                                        startIcon={faMoneyBill}
                                        onClick={onPayment}
                                    />
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
            </AppModalContainer>
            <ModalBase ref={modalRef} />
        </>
    );
};
export default TuitionFormDetail;
