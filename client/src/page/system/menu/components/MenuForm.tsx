import { faClose, faSave } from '@fortawesome/free-solid-svg-icons';
import { Checkbox, DatePicker, Input, Select } from 'antd';
import { Method } from 'axios';
import React, { useEffect, useRef } from 'react';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';
import Loading from '~/component/Elements/loading/Loading';
import BaseForm, { BaseFormRef } from '~/component/Form/BaseForm';
import { AppModalContainer } from '~/component/Layout/AppModalContainer';
import NotificationConstant from '~/configs/contants';
import { useMergeState } from '~/hook/useMergeState';
import { requestApi } from '~/lib/axios';
import { Menu } from '~/types/layout/Menu';
import { ComboOption, Identifier } from '~/types/shared';
import NotifyUtil from '~/util/NotifyUtil';
import { COMBO_ROLE_API } from '../../role/api/api';
import { MENU_CREATE_API, MENU_UPDATE_API } from '../api/api';

interface Props {
    initialValues?: Partial<Menu>;
    parentId?: Identifier;
    onClose?: () => void;
    onSubmitSuccessfully?: () => void;
}

interface State {
    loading: boolean;
    roles: ComboOption[];
}

const MenuForm: React.FC<Props> = props => {
    const formRef = useRef<BaseFormRef>(null);
    const [state, setState] = useMergeState<State>({
        loading: true,
        roles: [],
    });

    const fetchComBoPermission = async () => {
        const res = await requestApi('get', COMBO_ROLE_API);
        if (res.data?.success) {
            setState({
                loading: false,
                roles: res.data?.result,
            });
        }
    };

    useEffect(() => {
        fetchComBoPermission();
    }, []);

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
                url: MENU_CREATE_API,
                method: 'post',
                message: NotificationConstant.DESCRIPTION_CREATE_SUCCESS,
            },
            update: {
                url: `${MENU_UPDATE_API}/${props.initialValues?.id}`,
                method: 'put',
                message: NotificationConstant.DESCRIPTION_UPDATE_SUCCESS,
            },
            createChild: {
                url: MENU_CREATE_API,
                method: 'post',
                message: 'Tạo mới Menu con thành công!',
            },
        };

        let urlParam;
        if (props.initialValues) {
            urlParam = urlParams.update;
        } else if (props.parentId) {
            urlParam = urlParams.createChild;
        } else {
            urlParam = urlParams.create;
        }

        const response = await requestApi(urlParam.method, urlParam.url, {
            ...formValues,
            parentId: props.parentId,
        });

        if (response.data?.success) {
            NotifyUtil.success(NotificationConstant.TITLE, urlParam.message);
            props?.onSubmitSuccessfully?.();
            props.onClose?.();
            return;
        }
    };

    if (state.loading) return <Loading />
    return (
        <AppModalContainer>
            <BaseForm
                initialValues={props.initialValues}
                ref={formRef}
                baseFormItem={[
                    {
                        label: 'Tên menu',
                        name: nameof.full<Menu>(x => x.name),
                        children: <Input placeholder="Nhập tên menu ..." />,
                        rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                    },
                    {
                        label: 'Route Path',
                        name: nameof.full<Menu>(x => x.route),
                        children: <Input placeholder="Nhập route ..." />,
                        rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                    },
                    {
                        label: 'Biểu tượng',
                        name: nameof.full<Menu>(x => x.icon),
                        children: <Input placeholder="Nhập biểu tượng..." />,
                        rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                    },
                    {
                        label: 'Level',
                        name: nameof.full<Menu>(x => x.level),
                        children: <Input type="number" placeholder="Nhập level..." />,
                        rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                    },
                    {
                        label: 'Hiển thị',
                        name: nameof.full<Menu>(x => x.isDisplay),
                        children: <Checkbox />,
                        initialValue: false,
                        valuePropName: 'checked',
                    },
                    {
                        label: 'Quyền xem',
                        name: nameof.full<Menu>(x => x.permissions),
                        children: (
                            <Select
                                options={state.roles}
                                showSearch
                                allowClear
                                placeholder="Chọn quyền..."
                            />
                        ),
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

export default MenuForm;
