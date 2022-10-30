import { faClose, faSave } from '@fortawesome/free-solid-svg-icons';
import { Input, Select } from 'antd';
import { Method } from 'axios';
import React, { useRef } from 'react';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';
import BaseForm, { BaseFormRef } from '~/component/Form/BaseForm';
import { AppModalContainer } from '~/component/Layout/AppModalContainer';
import NotificationConstant from '~/configs/contants';
import { requestApi } from '~/lib/axios';
import { IUser } from '~/types/ums/AuthUser';
import NotifyUtil from '~/util/NotifyUtil';
import { CREATE_USER_API, UPDATE_USER_API } from '../api/api';

interface Props {
    readonly?: boolean;
    initialValues?: Partial<IUser>;
    onClose?: () => void;
    onSubmitSuccessfully?: () => void;
}

const UserForm: React.FC<Props> = props => {
    const formRef = useRef<BaseFormRef>(null);

    const onSubmit = async () => {
        const urlParams: Record<
            string,
            {
                url: string;
                method: Method;
                message: string;
            }
        > = {
            create: {
                url: CREATE_USER_API,
                method: 'post',
                message: NotificationConstant.DESCRIPTION_CREATE_SUCCESS,
            },
            update: {
                url: `${UPDATE_USER_API}/${props.initialValues?.id}`,
                method: 'put',
                message: NotificationConstant.DESCRIPTION_UPDATE_SUCCESS,
            },
        };
        const formValues = formRef.current?.getFieldsValue();
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
                disabled={props.readonly}
                initialValues={props.initialValues}
                ref={formRef}
                baseFormItem={[
                    {
                        label: 'Tên người dùng',
                        name: nameof.full<IUser>(x => x.fullName),
                        children: <Input placeholder="Nhập tên người dùng ..." />,
                        rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                    },
                    {
                        label: 'Tên đăng nhập',
                        name: nameof.full<IUser>(x => x.username),
                        children: <Input placeholder="Nhập địa chỉ email ..." />,
                        rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                    },
                    {
                        label: 'Địa chỉ email',
                        name: nameof.full<IUser>(x => x.emailAddress),
                        children: <Input placeholder="Nhập địa chỉ email ..." />,
                        rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                    },
                    {
                        label: 'Số điện thoại',
                        name: nameof.full<IUser>(x => x.phoneNumber),
                        children: <Input placeholder="Nhập số điện thoại ..." />,
                        rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                    },
                    {
                        label: 'Số dư ( mặc định )',
                        name: nameof.full<IUser>(x => x.amount),
                        children: <Input type="number" defaultValue={0} placeholder="Nhập tên vai trò ..." />,
                    },
                    {
                        label: 'Vai trò',
                        name: nameof.full<IUser>(x => x.isAdmin),
                        children: (
                            <Select
                                style={{ color: '#333' }}
                                options={[
                                    { label: 'Quản trị viên', value: true },
                                    { label: 'Người dùng', value: false },
                                ]}
                                defaultValue={false}
                                showSearch
                                allowClear
                                placeholder="Chọn học kì..."
                            />
                        ),
                    },
                ]}
                labelAlign="left"
                labelCol={4}
                renderBtnBottom={() => {
                    return (
                        <div className="flex items-center justify-center w-full">
                            {!props.readonly && <ButtonBase title="Lưu" startIcon={faSave} onClick={onSubmit} />}
                            <ButtonBase title="Đóng" startIcon={faClose} variant="danger" onClick={props.onClose} />
                        </div>
                    );
                }}
            />
        </AppModalContainer>
    );
};

export default UserForm;
