import { notification } from 'antd';
import swal from 'sweetalert2';

export default class NotifyUtil {
    static confirmDialog(title: string, description: string) {
        return swal.fire({
            title,
            text: description,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Từ chối',
            icon: 'question',
            showConfirmButton: true,
            showCancelButton: true,
        });
    }

    static success(message: string, description: string) {
        notification.success({
            message: message,
            description: description,
        });
    }

    static error(message: string, description: string) {
        notification.error({
            message: message,
            description: description,
        });
    }

    static warn(message: string, description: string) {
        notification.warn({
            message: message,
            description: description,
        });
    }

    static info(message: string, description: string) {
        notification.info({
            message: message,
            description: description,
        });
    }
}
