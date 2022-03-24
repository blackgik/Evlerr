"use strict";
function formatMessage(objectOrMessage) {
    if (typeof objectOrMessage === "string")
        return objectOrMessage;
    if (typeof objectOrMessage === "object" && objectOrMessage.message) {
        return objectOrMessage.message;
    }
    return "";
}
function createResponse(objectOrMessage, data = null, success = null) {
    return {
        message: formatMessage(objectOrMessage),
        data,
        success: success === null ? true : success,
    };
}
module.exports = createResponse;
