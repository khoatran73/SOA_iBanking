import { faClose, faSave } from '@fortawesome/free-solid-svg-icons';
import { Input } from 'antd';
import { Method } from 'axios';
import React, { useRef } from 'react';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';
import BaseForm, { BaseFormRef } from '~/component/Form/BaseForm';
import { AppModalContainer } from '~/component/Layout/AppModalContainer';
import NotificationConstant from '~/configs/contants';
import { requestApi } from '~/lib/axios';
import { Role } from '~/types/ums/Role';
import NotifyUtil from '~/util/NotifyUtil';
import { ROLE_CREATE_API, ROLE_UPDATE_API } from '../api/api';


interface Props {
    initialValues?: Partial<Role>;
    onClose?: () => void;
    onSubmitSuccessfully?: () => void;
}

const RoleForm: React.FC<Props> = props => {
    const formRef = useRef<BaseFormRef>(null);

    const onSubmit = async () => {
        const isValidForm = await formRef.current?.isFieldsValidate();

        if (!isValidForm) {
            NotifyUtil.error(NotificationConstant.TITLE, NotificationConstant.ERROR_MESSAGE_UTIL);
            return;
        }

        const formValues = formRef.current?.getFieldsValue();

        const urlParams: Record<
            string,
            {
                url: string;
                method: Method;
                message: string;
            }
        > = {
            create: {
                url: ROLE_CREATE_API,
                method: 'post',
                message: NotificationConstant.DESCRIPTION_CREATE_SUCCESS,
            },
            update: {
                url: `${ROLE_UPDATE_API}/${props.initialValues?.id}`,
                method: 'put',
                message: NotificationConstant.DESCRIPTION_UPDATE_SUCCESS,
            },
        };

        const urlParam = props.initialValues ? urlParams.update : urlParams.create;

        const response = await requestApi(urlParam.method, urlParam.url, {
            ...formValues,
        });

        if (response.data?.success) {
            NotifyUtil.success(NotificationConstant.TITLE, urlParam.message);
            props?.onSubmitSuccessfully?.();
            props.onClose?.();
            return;
        }
    };

    return (
        <AppModalContainer>
            <BaseForm
                initialValues={props.initialValues}
                ref={formRef}
                baseFormItem={[
                    {
                        label: 'Mã vai trò',
                        name: nameof.full<Role>(x => x.code),
                        children: <Input placeholder="Nhập mã vai trò ..." />,
                        rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                    },
                    {
                        label: 'Tên vai trò',
                        name: nameof.full<Role>(x => x.name),
                        children: <Input placeholder="Nhập tên vai trò ..." />,
                        rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                    },
                ]}
                labelAlign="left"
                labelCol={4}
                renderBtnBottom={() => {
                    return (
                        <div className="flex items-center justify-center w-full">
                            <ButtonBase title="Lưu" startIcon={faSave} onClick={onSubmit} />
                            <ButtonBase title="Đóng" startIcon={faClose} variant="danger" onClick={props.onClose} />
                        </div>
                    );
                }}
            />
        </AppModalContainer>
    );
};

export default RoleForm;