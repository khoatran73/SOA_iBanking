import { Form, FormInstance } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import React, { useImperativeHandle, useRef } from 'react';

export interface BaseFormProps {
    initialValues?: Record<string, any>;
    labelCol?: number;
    layout?: 'horizontal' | 'inline' | 'vertical';
    labelAlign?: 'left' | 'right';
    disabled?: boolean;
    baseFormItem?: BaseFormItem[];
    renderBtnBottom?: () => JSX.Element;
}

export interface BaseFormItem {
    label: React.ReactNode;
    name: string;
    rules?: Array<Record<string, any>>;
    children?: React.ReactNode;
}

export interface FieldData {
    name: NamePath;
    value: any;
}

export interface BaseFormRef {
    getFieldsValue: () => Record<string, any>;
    getFieldValue: (fieldName: string) => Record<string, any>;
    isFieldsValidate: () => Promise<boolean | undefined>;
    resetFields: (fields?: NamePath[]) => void;
    setFields: (fields: FieldData[]) => void;
    setFieldValue: (name: NamePath, value: any) => void;
    setFieldsValue: (values: any) => void;
}

const BaseForm = React.forwardRef<BaseFormRef, BaseFormProps>((props, ref) => {
    const formRef = useRef<FormInstance>(null);

    useImperativeHandle(ref, () => ({
        getFieldsValue: () => formRef.current?.getFieldsValue(true),
        getFieldValue: (fieldName: string) => formRef.current?.getFieldValue(fieldName),
        isFieldsValidate: async () => {
            return await formRef.current
                ?.validateFields()
                .then(() => true)
                .catch(() => false);
        },
        resetFields: (fields?: NamePath[]) => formRef.current?.resetFields(fields),
        setFields: (fields: FieldData[]) => formRef.current?.setFields(fields),
        setFieldValue: (name: NamePath, value: any) => formRef.current?.setFieldValue(name, value),
        setFieldsValue: (values: any) => formRef.current?.setFieldsValue(values),
    }));

    return (
        <div>
            <Form
                labelCol={{ span: props.labelCol ?? 6 }}
                wrapperCol={{ span: 24 - Number(props.labelCol ?? 6) }}
                initialValues={props.initialValues}
                autoComplete="off"
                ref={formRef}
                labelAlign={props.labelAlign}
                layout={props.layout}
                disabled={props.disabled}
            >
                {props.baseFormItem?.map(item => {
                    return (
                        <Form.Item key={item.name} {...item}>
                            {item.children}
                        </Form.Item>
                    );
                })}
            </Form>
            {props.renderBtnBottom?.()}
        </div>
    );
});

export default BaseForm;
