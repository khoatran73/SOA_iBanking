import { faClose, faCog, faSave } from '@fortawesome/free-solid-svg-icons';
import { Input } from 'antd';
import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';
import BaseForm, { BaseFormRef } from '~/component/Form/BaseForm';
import { AppModalContainer } from '~/component/Layout/AppModalContainer';
import NotificationConstant from '~/configs/contants';
import { requestApi } from '~/lib/axios';
import { Identifier } from '~/types/shared';
import NotifyUtil from '~/util/NotifyUtil';
import { PAYMENT_API, PAYMENT_REQUEST_API } from '../api/api';
import '../style/tuition.scss';

interface Props {
    initialValues?: any;
    parentId?: Identifier;
    disabled?: boolean;
    onClose?: () => void;
    onSubmitSuccessfully?: () => void;
}

const TuitionPayment: React.FC<Props> = props => {
    const formRef = useRef<BaseFormRef>(null);
    const [counter, setCounter] = React.useState(60);
    const {initialValues} = props;
    useEffect(() => {
        const timerId = setInterval(() => {
            counter > 0 && setCounter(pre => pre - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [counter]);

    const onPayment = async () => {
        const otpCode = formRef.current?.getFieldValue('otpCode');
        const payload = {
            id: initialValues?.id,
            userPaymentId: initialValues.userPaymentId,
            userId: initialValues.userId,
            otpCode: otpCode,
        };
        const response = await requestApi('post', `${PAYMENT_API}/${props.initialValues?.id}`, payload);

        if (response.data?.success) {
            NotifyUtil.success(NotificationConstant.TITLE, 'Thanh toán thành công');
            props?.onSubmitSuccessfully?.();
            return;
        } else {
            NotifyUtil.error(NotificationConstant.TITLE, `${response.data?.message}`);
            props.onClose?.();
        }
    };

    const onResentOtp = async () => {
        const response = await requestApi('get', `${PAYMENT_REQUEST_API}/${initialValues?.id}`);
        if (response.data?.success) {
           setCounter(60);
        }
    };
    return (
        <AppModalContainer>
            <BaseForm
                ref={formRef}
                baseFormItem={[
                    {
                        label: `Nhập mã OTP ( ${counter}s )`,
                        name: 'otpCode',
                        children: <Input />,
                        rules: [{ required: true, message: 'Vui lòng nhập mã OTP' }],
                    },
                ]}
                labelAlign="left"
                className={'w-full flex items-center justify-center flex-col'}
                width={'100%'}
                labelCol={5}
                renderBtnBottom={() => {
                    return (
                        <>
                            {counter == 0 && (
                                <div className="flex items-center justify-start w-full">
                                    <ButtonBase title="Gửi lại mã" startIcon={faCog} onClick={onResentOtp} />
                                </div>
                            )}
                            <div className="flex items-center justify-center w-full">
                                <ButtonBase title="Xác nhận" startIcon={faSave} onClick={onPayment} />
                                <ButtonBase title="Đóng" startIcon={faClose} variant="danger" onClick={props.onClose} />
                            </div>
                        </>
                    );
                }}
            />
        </AppModalContainer>
    );
};
export default TuitionPayment;
