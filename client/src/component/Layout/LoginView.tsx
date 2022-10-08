// @flow
import { faUnlock, faUnlockAlt, faUser, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import srcBgImage from '~/assets/login/background_login.png';
import { LoginParams } from '~/types/ums/AuthUser';
import { loginAsync } from '~/store/authSlice';
import Loading from '../Elements/loading/Loading';
import { RootState } from '~/AppStore';

export const LoginView: React.FC = () => {
    const [loginParam, setLoginParam] = useState<LoginParams>({
        username: '',
        password: '',
        rememberMe: false,
    });
    const [viewPassword, setViewPassword] = useState<boolean>(false);
    const passwordRef = useRef<HTMLInputElement>(null);
    const { loading } = useSelector((state: RootState) => state.authData);
    const dispatch = useDispatch();
    const onChangeInput = (val: any, field: keyof LoginParams) => {
        setLoginParam({
            ...loginParam,
            [field]: val,
        });
    };

    const onLogin = (e: any) => {
        e.preventDefault();
        dispatch(
            loginAsync(loginParam, () => {
                console.log('login-success!!');
            }),
        );
    };

    return (
        <div className="w-full relative">
            <div className="h-full ">
                <img src={srcBgImage} alt="" className="w-full h-full" />
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center flex-col overflow-auto">
                    <div>asd</div>
                </div>
            </div>
        </div>
    );
};
