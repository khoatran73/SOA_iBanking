import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '~/AppStore';
import { API_LAYOUT } from '~/configs';
import { requestApi } from '~/lib/axios';
import { MenuLayout } from '~/types/layout/Menu';
import { TreeBuilder } from '~/util/tree';

export interface LayoutState {
    loading: boolean;
    menus: MenuLayout[];
    treeMenus: MenuLayout[];
    openKeys: string[];
    selectKeys: string[];
    sliderCollapsed: boolean;
}

const sliderLocal = window.localStorage.getItem(nameof.full<LayoutState>(x => x.sliderCollapsed)) === 'true';

const initialState: LayoutState = {
    loading: false,
    sliderCollapsed: sliderLocal,
    menus: [],
    treeMenus: [],
    openKeys: [],
    selectKeys: [],
};

const getOpenKeys = (menus: Array<MenuLayout>, selectKeys: string[]): Array<MenuLayout> => {
    const selectItems = menus.filter(x => selectKeys.findIndex(y => y == x.route) >= 0);
    // const selectItems = menus.where(x => selectKeys.indexOf(x.route) >= 0).toArray();
    // return menus.where(menu => selectItems.any(x => x.parentKey == menu.key));

    return menus.filter(menu => selectItems.findIndex((x: MenuLayout) => x.parentKey == menu.key) >= 0);
};

export const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        setMenus: (state, action: PayloadAction<MenuLayout[]>) => {
            state.menus = action.payload;
            const location = window.location;
            // const selectedItem = state.menus
            //     .where(x => {
            //         return location.pathname.startsWith(x.route);
            //     })
            //     .orderByDescending(x => x.route)
            //     .firstOrDefault();
            const selectedItem = state.menus.find(x => location.pathname.startsWith(x.route));
            const selectKeys = !selectedItem ? [] : [selectedItem.route];
            const openKeys = getOpenKeys(state.menus, selectKeys);
            state.treeMenus = TreeBuilder.buildTreeFromFlatData(
                action.payload,
                nameof.full<MenuLayout>(x => x.key),
                nameof.full<MenuLayout>(x => x.parentKey),
                nameof.full<MenuLayout>(x => x.children),
            );
            state.selectKeys = selectKeys;
            // state.openKeys = openKeys.select(x => x.route).toArray();
            state.openKeys = openKeys.map(x => x.route);
        },
        setOpenKeys: (state, action: PayloadAction<string[]>) => {
            state.openKeys = action.payload;
        },
        setSelectKeys: (state, action: PayloadAction<string[]>) => {
            state.selectKeys = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        changeCollapsed: state => {
            const newCollapsed = !state.sliderCollapsed;
            state.sliderCollapsed = newCollapsed;
            window.localStorage.setItem(
                nameof.full<LayoutState>(x => x.sliderCollapsed),
                newCollapsed + '',
            );
        },
    },
});

export const fetchAuthLayoutThunk = createAsyncThunk('fetchAuthLayout', async () => {
    const response = await requestApi<MenuLayout[]>('get', API_LAYOUT);
    return response.data.result ?? [];
});

const { setLoading, setMenus } = layoutSlice.actions;

export const { setOpenKeys, setSelectKeys, changeCollapsed } = layoutSlice.actions;

export const fetchAuthLayoutAsync = (): AppThunk => async dispatch => {
    dispatch(setLoading(true));
    const response = await requestApi<MenuLayout[]>('get', API_LAYOUT);
    if (response.data?.success) {
        dispatch(setMenus(response.data.result ?? []));
    }
    dispatch(setLoading(false));
};
