import { Gutter } from 'antd/lib/grid/row';

export const DEFAULT_GUTTER_ROW_FORM = 32 as Gutter;

//action row
export const CREATE_BUTTON_TOOLTIP = 'Tạo mới';
export const EDIT_BUTTON_TOOLTIP = 'Sửa';
export const DELETE_BUTTON_TOOLTIP = 'Xóa';
export const VIEW_BUTTON_TOOLTIP = 'Xem';
export const DETAIL_BUTTON_TOOLTIP = 'Chi tiết';

//notify
export default class NotificationConstant {
    static TITLE = 'Thông báo';
    static DESCRIPTION_DELETE_FAIL = 'Xóa không thành công!';
    static DESCRIPTION_DELETE_SUCCESS = 'Xóa thành công';
    static DESCRIPTION_UPDATE_FAIL = 'Cập nhật không thành công!';
    static DESCRIPTION_UPDATE_SUCCESS = 'Cập nhật thành công';
    static DESCRIPTION_CREATE_FAIL = 'Tạo mới không thành công!';
    static DESCRIPTION_CREATE_SUCCESS = 'Tạo mới thành công';
    static CONFIRM_DELETE = 'Bạn có chắc muốn xóa?';
    static SERVER_ERROR = 'Có lỗi xảy ra, vui lòng thử lại!';
    static DESCRIPTION_SAVE = 'Bạn có chắc muốn lưu lại không?';
    static SEND_MAIL_SUCCESS = 'Gửi mail thành công!';
    static SEND_MAIL_FAIL = 'Gửi mail thất bại!';
    static ERROR_MESSAGE_UTIL = 'Dữ liệu không hợp lệ';
}

export const FORM_CONSTANT = {
    FORM_ROW_GUTTER: [20, 0] as Gutter,
    FULL_ROW_SPAN: 24,
    ROW_SPAN: 12,

    ROW_SPAN_DETAIL_FORM: 24,
    ROW_SPAN_DUAL_GRID: 11,
    ROW_SPAN_DUAL_GRID_BUTTON: 2,
};
