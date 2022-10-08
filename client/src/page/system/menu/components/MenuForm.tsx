import { faClose, faSave } from '@fortawesome/free-solid-svg-icons';
import { DatePicker, Input } from 'antd';
import React, { useRef } from 'react';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';
import BaseForm, { BaseFormRef } from '~/component/Form/BaseForm';
import { AppModalContainer } from '~/component/Layout/AppModalContainer';
import NotifyUtil from '~/util/NotifyUtil';

interface Props {
    onClose?: () => void;
    onSubmitSuccessfully?: () => void;
}

const MenuForm: React.FC<Props> = props => {
    const formRef = useRef<BaseFormRef>(null);

    const onSubmit = async () => {
        // const isValidform;
        await formRef.current?.isFieldsValidate();

        const formValues = formRef.current?.getFieldsValue();

        // console.log('🚀 ~ file: MenuForm.tsx ~ line 13 ~ onSubmit ~ formValues', formValues);

        NotifyUtil.success('thong bao', 'sucessss');
    };

    return (
        <AppModalContainer>
            <BaseForm
                ref={formRef}
                baseFormItem={[
                    {
                        label: 'username',
                        name: 'username',
                        children: <Input />,
                        rules: [{ required: true }],
                    },
                    {
                        label: 'password',
                        name: 'password',
                        children: <Input.Password />,
                        rules: [{ required: true }],
                    },
                    {
                        label: 'date',
                        name: 'date',
                        children: <DatePicker />,
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

export default MenuForm;
