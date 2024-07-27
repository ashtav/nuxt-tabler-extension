
import { defineNuxtPlugin } from '#imports';
import eventBus from '../../plugins/mitt';

const show = (message: string, options: any = {}, type = 'default') => {
    eventBus.emit('__show_toast', {
        message: message,
        options: options,
        type: type
    })
}

const toast = {
    show,
    error: (message: string, options: any = {}) => show(message, options, 'error'),
    success: (message: string, options: any = {}) => show(message, options, 'success'),
    warning: (message: string, options: any = {}) => show(message, options, 'warning'),
    auto: (message: string, value: boolean) => show(message, {}, value ? 'success' : 'error'),
}

export default defineNuxtPlugin((_) => {
    return {
        provide: {
            toast: toast
        }
    }
})
