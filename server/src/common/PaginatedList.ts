export type PaginatedList<T = any> = {
    totalCount: number;
    offset: number;
    limit: number;
    totalPages: number;
    currentPage: number;
    items: Array<T>;
};

export interface PaginatedListQuery {
    offset: number;
    limit: number;
}

export const PaginatedListConstructor = <T = any>(items: Array<T>, offset: number, limit: number): PaginatedList<T> => {
    return {
        currentPage: Math.floor(Math.ceil(offset / limit)),
        totalCount: items.length,
        totalPages: 1,
        items: items.slice(offset, limit),
        limit: limit,
        offset: offset,
    };
};
