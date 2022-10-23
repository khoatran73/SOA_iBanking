// @flow
import { Menu } from 'antd';
import clsx from 'clsx';
import { SelectInfo } from 'rc-menu/lib/interface';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { RootState } from '~/AppStore';
import backgroundLogo from '~/assets/layout/background_logo.jpg';
import { BaseIcon } from '~/component/Icon/BaseIcon';
import { MenuIcon } from '~/component/Icon/MenuIcon';
import { setOpenKeys, setSelectKeys } from '~/store/layoutSlice';
import { MenuLayout } from '~/types/layout/Menu';
import './MenuSide.scss';

const { Item } = Menu;

type MenuProps = {
    collapsed: boolean;
    menuList?: MenuLayout[];
};

const MenuSide: React.FC<MenuProps> = ({ menuList, collapsed }) => {
    const { menus, treeMenus, selectKeys, openKeys } = useSelector((state: RootState) => {
        return state.layout;
    });
    const [hasOpen, setHasOpen] = useState(false);
    const dispatch = useDispatch();
    const { pathname } = useLocation();

    const onOpenChange = (openKeys: React.Key[]) => {
        dispatch(setOpenKeys(openKeys.map(x => x.toString())));
        setHasOpen(true);
    };

    const onSelectChange = (info: SelectInfo) => {
        const selectedKeys = info.selectedKeys.map(x => x.toString());
        //  info.selectedKeys?.select<string>(x => x.toString()).toArray() || [];
        dispatch(setSelectKeys(selectedKeys));
    };

    const openCurrentKeys = useMemo(() => {
        const computeKeys = () => {
            // const currentMenu = menus.where(x => x.route === selectKeys[0]).first();
            const currentMenu = menus.find(x => x.route === selectKeys[0]);
            const menuKeys = currentMenu?.path.split('.');
            // const mapMenu = menuKeys?.map(m => menus.firstOrDefault(x => x.key === m)?.route);
            const mapMenu = menuKeys?.map(m => menus.find(x => x.key === m)?.route);
            return mapMenu?.filter(x => x != null);
        };
        // @ts-ignore
        if (selectKeys.length > 0 && !hasOpen) return [...computeKeys(), selectKeys[0]];
        return openKeys;
    }, [selectKeys, openKeys]);

    const renderMenu = (menus: MenuLayout[], start: number) => {
        return menus.map((menu, index) => {
            if (!menu.isDisplay) return <></>;
            const { icon, name, route } = menu;

            if ((menu.children && menu.children.length === 0) || menu.children?.every(x => x.isDisplay === false)) {
                return (
                    <Item
                        key={route}
                        icon={
                            menu.level <= 1 ? (
                                <MenuIcon icon={icon} name={name} />
                            ) : (
                                <>
                                    {!collapsed ? (
                                        <div className="side-menu-icon-wrap">
                                            <i className="fa fa-list-alt" />
                                        </div>
                                    ) : (
                                        <BaseIcon
                                            icon={'tasks-alt'}
                                            size={'xs'}
                                            style={{ fontSize: 10, marginRight: 10 }}
                                            color={'rgba(0, 0, 0, 0.85)'}
                                        />
                                    )}
                                </>
                            )
                        }
                    >
                        <Link to={route} className="side-menu-text">
                            {name}
                        </Link>
                    </Item>
                );
            } else {
                const { children } = menu;
                return (
                    <Menu.SubMenu
                        key={route}
                        icon={
                            menu.level < 2 ? (
                                <MenuIcon icon={icon} name={name} />
                            ) : (
                                <>
                                    {!collapsed ? (
                                        <div className="side-menu-icon-wrap">
                                            <i className="fa fa-list-alt" />
                                        </div>
                                    ) : (
                                        <BaseIcon
                                            icon={'dot-circle'}
                                            size={'xs'}
                                            style={{ fontSize: 10, marginRight: 10 }}
                                            color={'rgba(0, 0, 0, 0.85)'}
                                        />
                                    )}
                                </>
                            )
                        }
                        title={menu.name}
                    >
                        {renderMenu(children || [], index + 1)}
                    </Menu.SubMenu>
                );
            }
        });
    };

    const renderSiderHeader = () => {
        const siderHeader = collapsed ? (
            <div
                style={{
                    backgroundImage: `url(${backgroundLogo})`,
                    backgroundSize: 'cover',
                    color: 'var(--info)',
                }}
                className={clsx(
                    'text-xs absolute  z-50 duration-150 ease-out',
                    'h-16 w-full flex items-center justify-center bg-white',
                )}
            >
                IBanking
            </div>
        ) : (
            <div
                className={clsx(
                    'flex items-center justify-center uppercase text-xl bg-cover',
                    ' absolute w-[250px] h-[64px] z-50 font-bold duration-700 ease-out',
                )}
                style={{
                    backgroundImage: `url(${backgroundLogo})`,
                    color: 'var(--info)',
                }}
            >
                IBanking
            </div>
        );

        return (
            <>
                {siderHeader}
                <div className="h-[64px]" />
            </>
        );
    };

    return (
        <Menu
            mode="inline"
            theme="light"
            defaultSelectedKeys={selectKeys}
            selectedKeys={[...selectKeys, pathname]}
            // @ts-ignore
            openKeys={openCurrentKeys || [pathname]}
            onOpenChange={onOpenChange}
            onSelect={onSelectChange}
            inlineIndent={10}
            inlineCollapsed={collapsed}
            className="custom-menu-side"
        >
            {renderSiderHeader()}
            {renderMenu(treeMenus || [], 0)}
        </Menu>
    );
};

export default MenuSide;
