import React, { CSSProperties, forwardRef, useImperativeHandle } from 'react';
import { Spin } from 'antd';
import { useMergeState } from '~/hook/useMergeState';

export interface OverlayRef {
    open: () => void;
    close: () => void;
    setValue: (val: number) => void;
    setDefaultText: (val: string) => void;
}
interface IProps {
    style?: CSSProperties;
    defaultText?: string;
    isPercentage?: boolean;
}
const Overlay = forwardRef<OverlayRef, IProps>((props, ref) => {
    const [state, setState] = useMergeState({
        open: false,
        processValue: 0,
        defaultText: props.defaultText || '',
    });
    const open = () => {
        setState({
            open: true,
            processValue: 0,
        });
    };

    const setProcessValue = (processValue: number) => setState({ processValue });

    const setDefaultText = (defaultText: string) => setState({ defaultText });

    const close = () => {
        setState({
            processValue: 100,
            open: false,
        });
    };

    useImperativeHandle(ref, () => ({
        open: open,
        close: close,
        setValue: (val: number) => setProcessValue(val),
        setDefaultText: (val: string) => setDefaultText(val),
    }));

    if (!state?.open) return null;
    return (
        <div
            style={Object.assign(
                {
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    background: 'rgba(255,255,255,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                props.style,
            )}
        >
            <div
                style={Object.assign(
                    {
                        zIndex: 99999,
                    },
                    props.style,
                )}
            >
                <div className="loading">
                    <Spin
                        tip={
                            props.isPercentage
                                ? `${Math.round(state?.processValue ?? 0)}% ${state?.defaultText}`
                                : state?.defaultText
                        }
                    />
                </div>
            </div>
        </div>
    );
});

export default Overlay;
