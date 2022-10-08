import { faCircleInfo, faCirclePlus, IconDefinition, faPlus, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import './ModalBase.scss';

type Zero = 0;
type ValidNumber = Zero | PositiveInt;
type PositiveInt = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Percentage = `${ValidNumber}%` | `${PositiveInt}${ValidNumber}%` | '100%';

export type ModalRef = {
    onClose: () => void;
    onOpen: (
        Component: JSX.Element,
        title: string | React.ReactNode,
        percentWidth?: Percentage,
        icon?: IconDefinition,
    ) => void;
};
interface IState {
    visible: boolean;
    title: string | React.ReactNode;
    children: JSX.Element | null;
    percentWidth: Percentage;
    icon: IconDefinition;
}
const ModalBase = forwardRef((props, ref) => {
    const [state, setState] = useState<IState>({
        visible: false,
        title: '',
        children: null,
        percentWidth: '50%',
        icon: faCircleInfo,
    });

    React.useEffect(() => {
        return () => {
            // console.log('unmount');
        };
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onOpen = (
        Component: JSX.Element,
        title: string | React.ReactNode,
        percentWidth: Percentage = '50%',
        icon: IconDefinition,
    ) => {
        setState(prevState => ({
            ...prevState,
            title,
            visible: true,
            children: Component,
            percentWidth,
            icon,
        }));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onClose = () => {
        setState(prevState => ({ ...prevState, visible: false }));
    };

    useImperativeHandle(
        ref,
        () => ({
            onClose,
            onOpen,
        }),
        [onClose, onOpen],
    );

    const handleCancel = () => setState(prevState => ({ ...prevState, visible: false }));

    if (!state.visible) return null;
    return (
        // @ts-ignore
        <Modal
            wrapClassName="modal-base"
            visible={state.visible}
            title={
                <div className="flex items-center uppercase">
                    <FontAwesomeIcon icon={state.icon || faPlus} className="mr-1.5" />
                    <div>{state.title}</div>
                </div>
            }
            closeIcon={<FontAwesomeIcon icon={faClose} />}
            onCancel={handleCancel}
            destroyOnClose
            footer={null}
            width={(window.innerWidth * parseInt(state.percentWidth.replace('%', ''))) / 100}
        >
            {state.children}
        </Modal>
    );
});

export default ModalBase;
