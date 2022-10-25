import { CaretDownFilled, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Dropdown, Menu } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppState } from '~/AppStore';
import { logoutAsync } from '~/store/authSlice';

type Action = 'userInfo' | 'userSetting' | 'logout' | 'legal';

interface Props {
    toggle: () => void;
}

const Header: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const { toggle } = props;
    const { isAuthenticated, authUser } = useAppState(state => state.authData);

    const onActionClick = (action: Action) => {
        switch (action) {
            case 'logout':
                dispatch(logoutAsync(() => null));
                return;
        }
    };

    const menu = (
        <Menu>
            <Menu.Item key="logout" onClick={() => onActionClick('logout')}>
                <div className="flex items-center justify-start">
                    <FontAwesomeIcon icon={faSignOut} />
                    <span className="ml-3">Đăng xuất</span>
                </div>
            </Menu.Item>
        </Menu>
    );

    return (
        <div className="h-[50px] flex text-white">
            <div className="flex-1 flex items-center">
                <div
                    className="cursor-pointer hover:bg-white hover:bg-opacity-20 relative border border-solid border-white p-3 w-9 h-9 rounded"
                    id="sidebar-trigger"
                    onClick={toggle}
                >
                    <MenuUnfoldOutlined className="absolute top-1.5 left-1.5" style={{ fontSize: '22px' }} />
                </div>
                <div className="pl-3 uppercase">IBanking</div>
            </div>
            <div className="flex-1 flex items-center justify-end">
                <Dropdown overlay={menu}>
                    <div className="h-9 cursor-pointer flex items-center mx-1.5 justify-center uppercase rounded text-white px-2 hover:bg-white hover:bg-opacity-20 duration-75">
                        <Avatar
                            size={32}
                            icon={<UserOutlined style={{ color: '#198ae3' }} />}
                            className="flex items-center justify-center bg-white rounded-full"
                        />
                        <span className="mx-2">{authUser?.user.username}</span>
                        <CaretDownFilled />
                    </div>
                </Dropdown>
            </div>
        </div>
    );
};

export default Header;
