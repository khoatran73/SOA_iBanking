export * from './ComboOption';
export * from './Tuition'

export type Identifier = string | number;

export interface CoreEntity {
    id: Identifier;
}

export const Authorization = 'authorization';
