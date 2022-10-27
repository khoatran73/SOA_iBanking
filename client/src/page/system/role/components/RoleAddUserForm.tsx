import { faClose, faSave } from '@fortawesome/free-solid-svg-icons';
import { Transfer } from 'antd';
import { TransferItem } from 'antd/lib/transfer';
import React, { useEffect, useRef } from 'react';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';
import Loading from '~/component/Elements/loading/Loading';
import BaseForm, { BaseFormRef } from '~/component/Form/BaseForm';
import { AppModalContainer } from '~/component/Layout/AppModalContainer';
import { COMBO_USER_WITH_KEY_API } from '~/configs';
import NotificationConstant from '~/configs/contants';
import { useMergeState } from '~/hook/useMergeState';
import { requestApi } from '~/lib/axios';
import { Identifier } from '~/types/shared';
import NotifyUtil from '~/util/NotifyUtil';
import { UPDATE_USER_ROLE_API } from '../api/api';

interface Props {
    id: Identifier;
    selectedKeys?: string[];
    onClose?: () => void;
    onSubmitSuccessfully?: () => void;
}

interface State {
    loading: boolean;
    users: TransferItem[];
    choseKey: string[];
}

const RoleAddUserForm: React.FC<Props> = props => {
    const formRef = useRef<BaseFormRef>(null);
    const [state, setState] = useMergeState<State>({
        loading: true,
        users: [],
        choseKey: props.selectedKeys ?? [],
    });

    const onSubmit = async () => {
        const body = {
            roleId: props.id,
            userIds: state.choseKey,
        };
        const response = await requestApi('put', UPDATE_USER_ROLE_API, body);

        if (response.data?.success) {
            NotifyUtil.success(NotificationConstant.TITLE, NotificationConstant.DESCRIPTION_UPDATE_SUCCESS);
            props?.onSubmitSuccessfully?.();
            props.onClose?.();
            return;
        }
    };

    const fetchUsers = async () => {
        const res = await requestApi('get', COMBO_USER_WITH_KEY_API);
        if (res?.data?.success) {
            setState({
                loading: false,
                users: res.data.result,
            });
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (newTargetKeys: string[]) => {
        setState({
            choseKey: newTargetKeys,
        });
    };

    if (state.loading) return <Loading />;
    return (
        <AppModalContainer>
            <BaseForm
                ref={formRef}
                baseFormItem={[
                    {
                        name: 'userIds',
                        children: (
                            <Transfer
                                dataSource={state.users}
                                showSearch
                                targetKeys={state.choseKey}
                                onChange={handleChange}
                                render={item => item.label}
                            />
                        ),
                    },
                ]}
                labelAlign="left"
                labelCol={0}
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

export default RoleAddUserForm;
