"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMention = exports.isEmpty = exports.isURL = exports.isInvite = void 0;
function isInvite(str) {
    return /(https:\/\/)?.*(discord.*\.?g.*g.*|invite\/*)\/?.+/igm.test(str);
}
exports.isInvite = isInvite;
function isURL(str) {
    return /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/.test(str);
}
exports.isURL = isURL;
function isEmpty(str) {
    return !/^(\w+\S+)$/.test(str);
}
exports.isEmpty = isEmpty;
function isMention(str) {
    return /(<a?:.+:.[0-9]+>)|.*(<(#|@)*(!|&)?[0-9]+>)/.test(str);
}
exports.isMention = isMention;
