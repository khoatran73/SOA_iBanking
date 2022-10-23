import React from 'react';
import { createTeleporter } from 'react-teleporter';
import { get } from 'lodash';
import classNames from 'classnames';
import { useLocation } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import { HomeFilled } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { BaseIcon } from '~/component/Icon/BaseIcon';

export const WrapBreadcrumb = createTeleporter();

export type BreadcrumbType = {
    text: string;
    route?: string;
    tooltip?: string;
    back?: boolean;
    code?: string;
};

type Props = {
    Breadcrumbs: BreadcrumbType[];
};

export const Breadcrumb = (props: Props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const breadcrumbs = props.Breadcrumbs;

    return (
        <div className="page-breadcrumb">
            <div className="flex items-center text-sm text-white pr-2.5">
                {breadcrumbs.map((breadcrumb, index) => {
                    if (breadcrumb.route) {
                        if (breadcrumb.route === 'back') {
                            return (
                                <BreadcrumbItem
                                    key={`breadcrum-${index}`}
                                    onClick={() => {
                                        navigate(-1);
                                    }}
                                >
                                    <span>{breadcrumb.text}</span>
                                </BreadcrumbItem>
                            );
                        }
                        return (
                            <BreadcrumbItem
                                key={`breadcrum-${index}`}
                                onClick={() => {
                                    if (breadcrumb.back) {
                                        if (get(history, 'action') === 'PUSH') {
                                            navigate(-1);
                                        } else {
                                            navigate(`${breadcrumb.route}`);
                                        }
                                    } else {
                                        navigate(`${breadcrumb.route}`);
                                    }
                                }}
                                href={`#${breadcrumb.route}`}
                            >
                                <span>{breadcrumb.text}</span>
                            </BreadcrumbItem>
                        );
                    }
                    return (
                        <BreadcrumbItem
                            key={`breadcrum-${index}`}
                            lastest={index === breadcrumbs.length - 1}
                            className={classNames('', { 'breadcrum-lastest': index === breadcrumbs.length - 1 })}
                            code={breadcrumb.code}
                        >
                            {breadcrumb.tooltip ? (
                                <Tooltip placement="bottomLeft" title={breadcrumb.text}>
                                    <span className="breadcrumb-text">{breadcrumb.text}</span>
                                </Tooltip>
                            ) : (
                                <span className="breadcrumb-text">{breadcrumb.text}</span>
                            )}
                        </BreadcrumbItem>
                    );
                })}
            </div>
        </div>
    );
};

type BreadcrumbItemProp = {
    href?: string;
    className?: string;
    lastest?: boolean;
    code?: string;
    onClick?: () => void;
};

export const BreadcrumbItem = (props: React.PropsWithChildren<BreadcrumbItemProp>) => {
    return (
        <div
            onClick={() => {
                props.onClick && props.onClick();
            }}
            style={{ display: 'flex', cursor: props.href ? 'pointer' : '' }}
            className={props.className}
        >
            <div className="breadcrumb-wrap-text flex items-center">{props.children}</div>
            {props.code && <span style={{ paddingLeft: 5 }}>({props.code})</span>}
            {!props.lastest && <span style={{ margin: '0px 6px' }}>/</span>}
        </div>
    );
};
