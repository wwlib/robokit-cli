"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs-extra');
const crs = require('crypto-random-string');
function moveFileIfItExists(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const exists = yield fs.exists(filePath);
        if (exists) {
            const randomString = crs({ length: 5, type: 'url-safe' });
            yield fs.move(filePath, `${filePath}.${randomString}.bak`);
        }
    });
}
exports.moveFileIfItExists = moveFileIfItExists;
function moveFilesThatExist(filePaths) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = [];
        filePaths.forEach((filePath) => {
            promises.push(moveFileIfItExists(filePath));
        });
        yield Promise.all(promises);
    });
}
exports.moveFilesThatExist = moveFilesThatExist;
//# sourceMappingURL=MoveFilesThatExist.js.map