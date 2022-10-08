import * as React from 'react';

type Props = React.PropsWithChildren<any> & {};
export const AppContainer: React.FC<Props> = (props: Props) => {
    return (
        <div
            style={{
                padding: 10,
                backgroundColor: '#fff',
                height: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                borderRadius: 5,
                overflow: 'auto',
            }}
            className={props.className}
        >
            {props.children}
        </div>
    );
};
