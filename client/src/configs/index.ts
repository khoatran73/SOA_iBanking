// export const APP_API_PATH = `${window.location.host}`
export const APP_API_PATH = process.env.REACT_APP_API_URL as string;

export const API_CHECK_LOGIN = APP_API_PATH + '/identity/check-login';
export const API_LOGIN = APP_API_PATH + '/identity/login';
export const API_LOGOUT = APP_API_PATH + '/identity/logout';
//layout

export const API_LAYOUT = APP_API_PATH + '/menu/layout';

// common api
export const COMBO_USER_WITH_KEY_API = APP_API_PATH + '/common/combo-user-with-key';
