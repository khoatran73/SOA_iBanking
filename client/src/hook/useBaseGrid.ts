import React from 'react';
import { BaseGridRef } from '~/component/Grid/BaseGrid';
import { PaginatedList, requestApi } from '~/lib/axios';
import { useSelector } from 'react-redux';
import { RootState } from '~/AppStore';
import { Authorization } from '~/types/shared';

export interface BaseGridResponse<TData> {
    loading: boolean;
    data: TData[] | undefined;
    reloadData(): void;
}

interface Props {
    url: string;
    gridRef?: React.RefObject<BaseGridRef>;
    pageSize?: number;
}

interface State<TData> {
    loading: boolean;
    data: TData[] | undefined;
}

interface PaginatedListQuery {
    offset: number;
    limit: number;
}

const countOffset = (pageNumber: number, limit: number) => {
    return limit * (pageNumber - 1);
};

export function useBaseGrid<TData>({ pageSize = 25, ...props }: Props): BaseGridResponse<TData> | null {
    const { authUser } = useSelector((state: RootState) => state.authData);
    const [state, setState] = React.useState<State<TData>>({
        loading: true,
        data: undefined,
    });

    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (limit: number = pageSize, pageNumber = 1) => {
        props.gridRef?.current?.api.showLoadingOverlay();
        const query: PaginatedListQuery = {
            offset: countOffset(pageNumber, limit),
            limit: limit,
        };

        const response = await requestApi<PaginatedList<TData>>(
            'get',
            props.url,
            {},
            { params: query, headers: { [Authorization]: authUser?.token ?? '' } },
        );

        if (response.data?.success) {
            setState({
                loading: false,
                data: response.data?.result?.items,
            });
        }

        props.gridRef?.current?.api.hideOverlay();
    };

    return {
        ...state,
        reloadData: fetchData,
    };
}
