import { Identifier } from ".";

export interface ComboOption<TValue = string | number> {
    value: TValue;
    label: string;
}

export interface TreeComboOption<TValue = string | number> extends ComboOption<TValue> {
    children: Array<TreeComboOption<TValue>>;
}

export interface ComboOptionWithKey<TValue = Identifier> {
    key: TValue;
    label: string;
}