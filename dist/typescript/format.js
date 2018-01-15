"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const formatter = require("typescript-formatter");
exports.formatterOptions = {
    replace: false,
    verify: false,
    tsconfig: false,
    tsconfigFile: null,
    tslint: false,
    tslintFile: null,
    editorconfig: false,
    vscode: false,
    vscodeFile: null,
    tsfmt: false,
    tsfmtFile: null
};
function formatTS(ts, options = exports.formatterOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield formatter.processString('', ts, exports.formatterOptions)).dest;
    });
}
exports.formatTS = formatTS;
