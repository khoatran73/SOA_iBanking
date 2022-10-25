import { Identifier } from '.';

export interface ComboOption<TValue = Identifier> {
    value: TValue;
    label: string;
}

export interface TreeComboOption<TValue = Identifier> extends ComboOption<TValue> {
    children: Array<TreeComboOption<TValue>>;
}

export interface ComboOptionWithKey<TValue = Identifier> {
    key: TValue;
    label: string;
}
