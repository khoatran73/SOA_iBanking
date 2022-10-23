import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router';
import { RootState } from '~/AppStore';
import { BreadcrumbType, WrapBreadcrumb } from '~/component/Elements/Breadcrumb/WrapBreadcrumb';
import { fetchAuthLayoutAsync } from '~/store/layoutSlice';
import { Breadcrumb } from '../Elements/Breadcrumb/WrapBreadcrumb';
import Footer from './Footer';
import Header from './Header';
import MenuSide from './MenuSide';

const { Sider, Content } = Layout;

const LayoutPage: React.FC = () => {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const location = useLocation();
    const dispatch = useDispatch();
    const { menus } = useSelector((state: RootState) => state.layout);

    useEffect(() => {
        dispatch(fetchAuthLayoutAsync());
    }, []);

    const toggle = () => {
        setCollapsed(state => !state);
    };

    const menuBreadcrumb = menus.find(x => location.pathname === x.route);

    const breadcrumbs =
        menuBreadcrumb?.breadcrumbs?.map<BreadcrumbType>(value => {
            return {
                text: value,
            };
        }) || [];

    return (
        <div className="flex w-screen h-screen text-[13px]">
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                breakpoint="md"
                theme={'light'}
                width={250}
                className="h-full"
            >
                <MenuSide collapsed={collapsed} />
            </Sider>
            <div className="w-full px-2.5 h-full flex flex-col justify-between relative">
                <div
                    className="w-full h-[140px] absolute top-0 left-0 -z-10"
                    style={{ background: 'linear-gradient(90deg,#046db3 0,#1696cf 60%,#20aade)' }}
                />
                <div
                    className="w-full absolute left-0 -z-10"
                    style={{
                        background: '#f3f2f2',
                        height: 'calc(100vh - 140px)',
                        top: 140,
                    }}
                />
                <Header toggle={toggle} />
                <div className="w-full mb-1">
                    <WrapBreadcrumb.Target />
                    <WrapBreadcrumb.Source>
                        <Breadcrumb Breadcrumbs={breadcrumbs || []} />
                    </WrapBreadcrumb.Source>
                </div>
                <Outlet />
                <Footer />
            </div>
        </div>
    );
};

export default LayoutPage;
