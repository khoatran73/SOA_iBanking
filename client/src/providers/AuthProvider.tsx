// @flow
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/AppStore';
import Loading from '~/component/Elements/loading/Loading';
import LoginView from '~/component/Layout/LoginView';
import { fetchAuthDataAsync } from '~/store/authSlice';

type Props = {
    children: React.ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
    const dispatch = useDispatch();

    const { loading, isAuthenticated, checkLoginLoading, authUser } = useSelector((state: RootState) => state.authData);

    useEffect(() => {
        dispatch(fetchAuthDataAsync());
    }, []);

    if (checkLoginLoading) return <Loading />;
    if (isAuthenticated === false) {
        return <LoginView />;
    }

    return <>{children}</>;
};
