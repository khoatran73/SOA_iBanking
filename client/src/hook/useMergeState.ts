
import { useState } from 'react';

export const useMergeState = <T>(initialState: T): [T, (values: Partial<T>) => void] => {
    const [state, setState] = useState(initialState);
    const setMergedState = (newState: Partial<T>): void => setState((prevState: T) => ({ ...prevState, ...newState }));
    return [state, setMergedState];
};
