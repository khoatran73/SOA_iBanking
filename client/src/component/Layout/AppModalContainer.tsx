import * as React from 'react';

type Props = React.PropsWithChildren<any>;
export const AppModalContainer: React.FC<Props> = (props: Props) => {

    return (
        <div
            style={{
                padding: 10,
                height: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                borderRadius: 5,
                // overflow: 'auto',
                ...props.style || {}
            }}
            className={props.className}>
            {props.children}
        </div>
    );
};
