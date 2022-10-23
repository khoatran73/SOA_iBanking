import Axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import _ from 'lodash';
import MockAdapter from 'axios-mock-adapter';
import NotifyUtil from '../util/NotifyUtil';
import { useNotificationStore } from '../store/notifications';
import { Identifier } from '~/types/shared';
import NotificationConstant from '~/configs/contants';

// function authRequestInterceptor(config: AxiosRequestConfig) {
//     const token = storage.getToken();
//     if (token) {
//         config.headers.authorization = `${token}`;
//     }
//     config.headers.Accept = 'application/json';
//     return config;
// }

export const axios = Axios.create({
    baseURL: '/',
    // headers: { Accept: 'application/json' },
});
// This sets the mock adapter on the default instance
const mockAxios = new MockAdapter(Axios, { delayResponse: 500, onNoMatch: 'passthrough' });
export const MockAxios = mockAxios;

let CANCEL_TOKEN_SOURCE = Axios.CancelToken.source();

function generateNewCancelTokenSource() {
    CANCEL_TOKEN_SOURCE = Axios.CancelToken.source();
}

export const finishPendingRequests = (cancellationReason: string) => {
    CANCEL_TOKEN_SOURCE.cancel(cancellationReason);
    generateNewCancelTokenSource();
};

const debounceNetworkErrorNotification = _.debounce(() => {
    NotifyUtil.confirmDialog(
        'Thông báo',
        'Lỗi kết nối đến server, vui lòng kiểm tra lại kết nối ' + 'hoặc liên hệ quản trị viên',
    );
}, 500);

// handle Log timeout
const requireAuthenMiddleware = _.debounce(async function (error: any) {
    if (error?.response?.status == 401) {
        const result = await NotifyUtil.confirmDialog('Thông báo', 'Hết phiên đăng nhập');
        if (result.isConfirmed) {
            window.location.reload();
        }
    }
    if (error?.response?.status == 504) {
        debounceNetworkErrorNotification();
    }
    // if (error?.response?.status === 403){
    //    alert()
    // }
}, 500);

// axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
    (response: any) => {
        // console.log('error Axios instance');
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    (error: any) => {
        const message = error.response?.data?.message || error.message;
        console.log('errorRequest', error, error?.response, error?.response?.status);
        useNotificationStore.getState().addNotification({
            type: 'error',
            title: 'Error',
            message,
        });

        return requireAuthenMiddleware(error);
    },
);

export type ApiResponse<T = any> = {
    success: boolean;
    errors?: Record<string, string[]>;
    message?: string;
    result?: T;
    totalCount?: number;
    error?: Record<string, string[]>;
};

export type PaginatedList<T = any> = {
    totalCount: number;
    offset: number;
    limit: number;
    totalPages: number;
    currentPage: number;
    items: T[];
};

export type ResultResponse<T = any> = Promise<AxiosResponse<ApiResponse<T>>>;

/**
 *
 * @param method - request methods
 * @param url - request url
 * @param data - request data or params
 * @param config
 */
export const requestApi = <T = any>(
    method: Method,
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
): ResultResponse<T> => {
    switch (method) {
        case 'get':
        case 'GET':
            return Axios.get(url, {
                params: data,
                ...config,
            }).catch(error => {
                console.log('errorRequest', error, error?.response, error?.response?.status);
                return Promise.resolve({
                    ...error.response,
                    data: {
                        success: false,
                        message: '',
                        errors: error.response?.data?.errors,
                    },
                });
            });
        case 'post':
        case 'POST':
            return Axios.post(url, data, config).catch(error => {
                console.log('errorRequest', error, error.response, error.response?.status);
                return Promise.resolve({
                    ...error.response,
                    data: {
                        success: false,
                        message: '',
                        errors: error.response?.data?.errors || error.response?.data?.error,
                    },
                });
            });
        case 'delete':
        case 'DELETE':
            return Axios.delete(url, {
                params: data,
                ...config,
            }).catch(error => {
                console.log('errorRequest', error, error.response, error.response?.status);
                return Promise.resolve({
                    ...error.response,
                    data: {
                        success: false,
                        message: '',
                        errors: error.response?.data?.errors,
                    },
                });
            });
        case 'put':
        case 'PUT':
            return Axios.put(url, data, config).catch(error => {
                console.log('errorRequest', error, error.response, error.response?.status);
                return Promise.resolve({
                    ...error.response,
                    data: {
                        success: false,
                        message: '',
                        errors: error.response?.data?.errors,
                    },
                });
            });
        default:
            return Axios.get(url, {
                params: data,
                ...config,
            }).catch(error => {
                console.log('errorRequest', error, error.response, error.response?.status);
                return Promise.resolve({
                    ...error.response,
                    data: {
                        success: false,
                        message: '',
                        errors: error.response?.data?.errors,
                    },
                });
            });
    }
};

export const downloadFileAsGetRequest = (
    url: string,
    {
        params,
        downloadFileName,
        config,
    }: { params?: Record<string, any>; downloadFileName?: string; config?: AxiosRequestConfig },
): Promise<any> => {
    return Axios.get(url, {
        params: params,
        responseType: 'blob',
        ...config,
    })
        .then(response => {
            if (response?.status == 200) {
                const link = document.createElement('a');
                const contentDisposition: string =
                    response.headers['content-disposition'] ?? response.headers['Content-Disposition'];
                const serverFileName = getFileNameFromContentDisposition(contentDisposition);
                const fileName = downloadFileName ?? serverFileName;
                if (!fileName) {
                    return Promise.reject('cannot resolve file name for download!');
                }
                link.download = fileName;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const url = URL.createObjectURL(response.data);
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
                return Promise.resolve(true);
            }
        })
        .catch(error => {
            console.error(error);
            return Promise.reject(error);
        });
};

export const downloadFileAsPostRequest = (
    url: string,
    {
        params,
        downloadFileName,
        config,
    }: { params: Record<string, any>; downloadFileName?: string; config?: AxiosRequestConfig },
) => {
    return Axios.post(url, params, {
        responseType: 'blob',
        ...config,
    }).then(response => {
        if (response?.status == 200) {
            const link = document.createElement('a');
            const contentDisposition: string =
                response.headers['content-disposition'] ?? response.headers['Content-Disposition'];
            const serverFileName = getFileNameFromContentDisposition(contentDisposition);
            const fileName = downloadFileName ?? serverFileName;
            if (!fileName) {
                return Promise.reject('cannot resolve file name for download!');
            }
            link.download = fileName;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const url = URL.createObjectURL(response.data);
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            return Promise.resolve(true);
        }
    });
};

export const getFileNameFromContentDisposition = (disposition: string): string | null => {
    let filename = '';
    const normalDisposition = decodeURI(disposition);
    if (normalDisposition && normalDisposition.indexOf('attachment') === -1) {
        return null;
    }
    if (normalDisposition.indexOf('*=UTF-8\'\'') != -1) {
        filename = normalDisposition.split('*=UTF-8\'\'')[1];
        return filename;
    }
    if (normalDisposition && normalDisposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(normalDisposition);
        if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
        }
    }
    return filename;
};

export const queryStringSerialize = (obj: any = {}): string => {
    const str = [];
    for (const p in obj)
        if (obj.hasOwnProperty(p) && obj[p] != null) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
    return str.join('&');
};

export const baseDeleteApi = async (url: string, id: Identifier) => {
    const response = await requestApi('delete', `${url}/${id}`);
    if (response.data?.success) {
        NotifyUtil.success(NotificationConstant.TITLE, NotificationConstant.DESCRIPTION_DELETE_SUCCESS);
    } else {
        NotifyUtil.error(NotificationConstant.TITLE, response.data?.message ?? NotificationConstant.DESCRIPTION_DELETE_FAIL);
    }
};
