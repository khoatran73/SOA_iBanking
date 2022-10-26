import { faClose, faSave } from '@fortawesome/free-solid-svg-icons';
import { Checkbox, DatePicker, Input } from 'antd';
import { Method } from 'axios';
import React, { useRef } from 'react';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';
import BaseForm, { BaseFormRef } from '~/component/Form/BaseForm';
import { AppModalContainer } from '~/component/Layout/AppModalContainer';
import NotificationConstant from '~/configs/contants';
import { requestApi } from '~/lib/axios';
import { Menu } from '~/types/layout/Menu';
import { Identifier, ITuition } from '~/types/shared';
import NotifyUtil from '~/util/NotifyUtil';
import '../style/tuition.scss';

interface Props {
    initialValues?: Partial<Menu>;
    parentId?: Identifier;
    onClose?: () => void;
    onSubmitSuccessfully?: () => void;
}

const TuitionForm: React.FC<Props> = props => {
    const formRef = useRef<BaseFormRef>(null);
    const onSubmit = async () => {
        return ;
    }
    return (
        <AppModalContainer>
            <BaseForm
                initialValues={props.initialValues}
                ref={formRef}
                baseFormItem={[
                    {
                        label: 'Sinh viên',
                        name: nameof.full<ITuition>(x => x.user.id),
                        children: <Input placeholder="Nhập tên học phí ..." />,
                        rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],

                    },
                    {
                        label: 'Quyền xem',
                        name: nameof.full<Menu>(x => x.permissions),
                        children: <Input placeholder="Nhập quyền..." />,
                    },
                ]}
                labelAlign="left"
                labelCol={4}
                renderBtnBottom={() => {
                    return (
                        <div className="flex items-center justify-center w-full">
                            <ButtonBase title="Lưu" startIcon={faSave} onClick={onSubmit} />
                            <ButtonBase title="Đóng" startIcon={faClose} variant="danger" onClick={props.onClose} />
                        </div>
                    );
                }}
            />
        </AppModalContainer>
    );
};
export default TuitionForm;