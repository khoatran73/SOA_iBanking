import { faClose, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { DatePicker, Input, Select } from 'antd';
import _ from 'lodash';
import React, { useRef } from 'react';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';
import BaseForm, { BaseFormRef } from '~/component/Form/BaseForm';
import { AppModalContainer } from '~/component/Layout/AppModalContainer';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import { requestApi } from '~/lib/axios';
import { Identifier, ITuition } from '~/types/shared';
import { CREATE_API } from '../api/api';
import '../style/tuition.scss';
import Overlay, { OverlayRef } from '~/component/Elements/loading/Overlay';
import NotifyUtil from '~/util/NotifyUtil';
import NotificationConstant from '~/configs/contants';


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
const TuitionFormCreate: React.FC<Props> = props => {
    const formRef = useRef<BaseFormRef>(null);
    const modalRef = useRef<ModalRef>(null);
    const overlayRef = useRef<OverlayRef>(null);
    const { initialValues } = props;
    const fieldDef = [
        {
            label: 'Sinh viên',
            name: nameof.full<ITuition>(x => x.userId),
            children: (
                <Select
                    style={{ color: '#333' }}
                    options={initialValues.users}
                    showSearch
                    allowClear
                    placeholder="Chọn sinh viên..."
                />
            ),
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
            children: <DatePicker  style={{ color: '#333' , width:'100%' }} format={'DD/MM/YYYY HH:mm'} />,
        },
        {
            label: 'Tổng học phí',
            name: nameof.full<ITuition>(x => x.totalFee),
            children: <Input style={{ color: '#333' }} />,
        },
    ];
    const onCreate = async() => {
        const data = formRef.current?.getFieldsValue();
        const response = await requestApi('post', CREATE_API, data);
        if (response.data?.success) {
            NotifyUtil.success(NotificationConstant.TITLE, 'Tạo mới thành công');
            props?.onSubmitSuccessfully?.();
            return;
        } else {
            NotifyUtil.error(NotificationConstant.TITLE, `${response.data?.message}`);
            props.onClose?.();
        }

    }
    return (
        <>
            <AppModalContainer>
                <BaseForm
                    disabled={props.disabled}
                    initialValues={initialValues}
                    ref={formRef}
                    baseFormItem={fieldDef}
                    labelAlign="left"
                    labelCol={4}
                    renderBtnBottom={() => {
                        return (
                            <div className="flex items-center justify-center w-full">
                                <ButtonBase title="Save" startIcon={faMoneyBill} onClick={onCreate} />
                                <ButtonBase title="Đóng" startIcon={faClose} variant="danger" onClick={props.onClose} />
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
export default TuitionFormCreate;
