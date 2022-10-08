import { Action, applyMiddleware, combineReducers, createStore } from 'redux';
import thunkMiddleware, { ThunkAction } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { useDispatch, useSelector } from 'react-redux';
import { authSlice } from './store/authSlice';
import { layoutSlice } from './store/layoutSlice';

const rootReducer = combineReducers({
    authData: authSlice.reducer,
    layout: layoutSlice.reducer,
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const useAppState = <T extends (state: RootState) => any>(selector: T): ReturnType<T> => useSelector(selector);

export default store;
