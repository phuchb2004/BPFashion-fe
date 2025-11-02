import { message, notification } from 'antd';

const NOTIFICATION_CONFIG = {
    placement: {
        success: 'topRight',
        error: 'topRight',
        warning: 'topRight',
        info: 'topRight',
        cart: 'bottomRight',
        form: 'topRight',
    },
    duration: {
        success: 3,
        error: 4,
        warning: 4,
        info: 3,
        cart: 2.5,
        form: 3,
    },
    maxCount: 3,
};

export const showSuccess = (msg, description = null, options = {}) => {
    const config = {
        message: msg,
        description: description,
        placement: options.placement || NOTIFICATION_CONFIG.placement.success,
        duration: options.duration || NOTIFICATION_CONFIG.duration.success,
        ...options
    };

    if (description) {
        notification.success(config);
    } else {
        message.success({
            content: msg,
            duration: config.duration / 1000
        });
    }
};

export const showError = (msg, description = null, options = {}) => {
    const config = {
        message: msg,
        description: description,
        placement: options.placement || NOTIFICATION_CONFIG.placement.error,
        duration: options.duration || NOTIFICATION_CONFIG.duration.error,
        ...options
    };

    if (description) {
        notification.error(config);
    } else {
        message.error({
            content: msg,
            duration: config.duration / 1000
        });
    }
};

export const showWarning = (msg, description = null, options = {}) => {
    const config = {
        message: msg,
        description: description,
        placement: options.placement || NOTIFICATION_CONFIG.placement.warning,
        duration: options.duration || NOTIFICATION_CONFIG.duration.warning,
        ...options
    };

    if (description) {
        notification.warning(config);
    } else {
        message.warning({
            content: msg,
            duration: config.duration / 1000
        });
    }
};

export const showInfo = (msg, description = null, options = {}) => {
    const config = {
        message: msg,
        description: description,
        placement: options.placement || NOTIFICATION_CONFIG.placement.info,
        duration: options.duration || NOTIFICATION_CONFIG.duration.info,
        ...options
    };

    if (description) {
        notification.info(config);
    } else {
        message.info({
            content: msg,
            duration: config.duration / 1000
        });
    }
};

export const showCartNotification = (msg, description = null) => {
    notification.success({
        message: msg,
        description: description,
        placement: NOTIFICATION_CONFIG.placement.cart,
        duration: NOTIFICATION_CONFIG.duration.cart,
    });
};

export const showFormNotification = (type, msg, description = null) => {
    const notificationType = type === 'success' ? showSuccess : showError;
    notificationType(msg, description, {
        placement: NOTIFICATION_CONFIG.placement.form,
        duration: NOTIFICATION_CONFIG.duration.form,
    });
};

