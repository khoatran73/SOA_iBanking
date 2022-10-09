// @flow
import { faPlus, faSync } from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';
import { CSSProperties } from 'react';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';

type ToolbarType = {
    rightToolbarStyle?: CSSProperties;
    leftToolbarStyle?: CSSProperties;
};

export type GridToolbarProps = {
    hasCreateButton?: boolean;
    hasRefreshButton?: boolean;
    onClickCreateButton?: () => void;
    onClickRefreshButton?: () => void;
} & ToolbarType;

const basicToolbar = (props: GridToolbarProps) => {
    const { hasCreateButton, hasRefreshButton } = props;
    return (
        <div className="flex items-center justify-end">
            {hasCreateButton && (
                <ButtonBase
                    onClick={() => props.onClickCreateButton?.()}
                    className={'btn-create'}
                    variant={'success'}
                    title="Tạo mới"
                    startIcon={faPlus}
                />
            )}
            {hasRefreshButton && (
                <ButtonBase
                    variant={'primary'}
                    title={'Làm mới'}
                    startIcon={faSync}
                    onClick={() => props.onClickRefreshButton?.()}
                />
            )}
        </div>
    );
};

export const GridToolbar: React.FC<GridToolbarProps> = props => {
    return <>{basicToolbar(props)}</>;
};
