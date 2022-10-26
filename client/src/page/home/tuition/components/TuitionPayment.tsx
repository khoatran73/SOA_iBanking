import { faClose, faCog, faSave } from '@fortawesome/free-solid-svg-icons';
import { Input } from 'antd';
import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';
import BaseForm, { BaseFormRef } from '~/component/Form/BaseForm';
import { AppModalContainer } from '~/component/Layout/AppModalContainer';
import NotificationConstant from '~/configs/contants';
import { requestApi } from '~/lib/axios';
import { Menu } from '~/types/layout/Menu';
import { Identifier, ITuition } from '~/types/shared';
import NotifyUtil from '~/util/NotifyUtil';
import { PAYMENT_API } from '../api/api';
import '../style/tuition.scss';

interface Props {
    initialValues?: Partial<Menu>;
    parentId?: Identifier;
    disabled?: boolean;
    onClose?: () => void;
    onSubmitSuccessfully?: () => void;
}

const TuitionPayment: React.FC<Props> = props => {
    const formRef = useRef<BaseFormRef>(null);
    const [counter, setCounter] = React.useState(5);
    useEffect(() => {
        const timerId = setInterval(() => {
            counter > 0 && setCounter(pre => pre - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [counter]);

    const onPayment = async () => {
        const response = await requestApi('put', `${PAYMENT_API}/${props.initialValues?.id}`);

        if (response.data?.success) {
            NotifyUtil.success(NotificationConstant.TITLE, 'Thanh toán thành công');
            props?.onSubmitSuccessfully?.();
            props.onClose?.();
            return;
        }
        props.onClose?.();
    };

    const onResentOtp = async () => {
        setCounter(5);
    };

    return (
        <AppModalContainer>
            <BaseForm
                ref={formRef}
                baseFormItem={[
                    {
                        label: `Nhập mã OTP ( ${counter}s )`,
                        name: nameof.full<ITuition>(x => x.userPayment.fullName),
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
