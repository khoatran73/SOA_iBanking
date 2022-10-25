// @flow
import { Input } from 'antd';
import * as React from 'react';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import bgImageUrl from '~/assets/login/background_login.png';
import { loginAsync } from '~/store/authSlice';
import { LoginParam } from '~/types/ums/AuthUser';
import { ButtonBase } from '../Elements/Button/ButtonBase';
import BaseForm, { BaseFormRef } from '../Form/BaseForm';

const LoginView: React.FC = () => {
    const formRef = useRef<BaseFormRef>(null);

    const dispatch = useDispatch();

    const onLogin = () => {
        const loginParams = formRef.current?.getFieldsValue() as LoginParam;
        dispatch(
            loginAsync(loginParams, () => {
                console.log('login-success!!');
            }),
        );
    };

    return (
        <div className="w-full h-screen relative flex items-center justify-center">
            <img src={bgImageUrl} className="w-full h-full absolute top-0 left-0 -z-10" alt="" />
            <div className="w-[500px] h-[200px] bg-white rounded-md shadow p-3">
                <BaseForm
                    ref={formRef}
                    baseFormItem={[
                        {
                            label: 'Tài khoản',
                            name: nameof.full<LoginParam>(x => x.username),
                            children: <Input />,
                            rules: [{ required: true }],
                        },
                        {
                            label: 'Mật khẩu',
                            name: nameof.full<LoginParam>(x => x.password),
                            children: <Input.Password />,
                            rules: [{ required: true }],
                        },
                    ]}
                    labelAlign="left"
                    labelCol={6}
                    className={'w-full flex items-center justify-center flex-col'}
                    width={'100%'}
                    renderBtnBottom={() => {
                        return (
                            <div className="flex items-center justify-center w-full">
                                <ButtonBase title="Đăng nhập" size="md" onClick={onLogin} />
                            </div>
                        );
                    }}
                />
            </div>
        </div>
    );
};

export default LoginView;
