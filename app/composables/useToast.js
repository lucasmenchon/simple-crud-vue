"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToast = useToast;
var toasts = ref([]);
function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}
function useToast() {
    function show(message, type, duration) {
        if (type === void 0) { type = 'info'; }
        if (duration === void 0) { duration = 3500; }
        var id = uid();
        toasts.value.push({ id: id, message: message, type: type, duration: duration });
        if (duration > 0)
            setTimeout(function () { return dismiss(id); }, duration);
    }
    function dismiss(id) {
        toasts.value = toasts.value.filter(function (t) { return t.id !== id; });
    }
    var success = function (msg) { return show(msg, 'success'); };
    var error = function (msg) { return show(msg, 'error', 5000); };
    var info = function (msg) { return show(msg, 'info'); };
    var warning = function (msg) { return show(msg, 'warning', 4000); };
    return { toasts: toasts, show: show, dismiss: dismiss, success: success, error: error, info: info, warning: warning };
}
