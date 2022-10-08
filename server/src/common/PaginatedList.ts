export type PaginatedList<T = any> = {
    totalCount: number;
    offset: number;
    limit: number;
    totalPages: number;
    currentPage: number;
    items: Array<T>;
};

export const PaginatedListConstructor = <T = any>(
    items: Array<T>,
    totalCount: number,
    offset: number,
    limit: number,
): PaginatedList<T> => {
    return {
        currentPage: Math.floor(Math.ceil(offset / limit)),
        totalCount: Math.floor(Math.ceil(totalCount / limit)),
        totalPages: 1,
        items: items,
        limit: limit,
        offset: offset,
    };
};
