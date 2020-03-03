"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommandState;
(function (CommandState) {
    CommandState["OK"] = "OK";
    CommandState["NOK"] = "NOK";
    CommandState["PENDING"] = "PENDING";
    CommandState["INCOMPLETE"] = "INCOMPLETE";
    CommandState["UNDEFINED"] = "UNDEFINED";
})(CommandState = exports.CommandState || (exports.CommandState = {}));
class CommandResponse {
    constructor(input, output, state, inquirerPrompt) {
        this.input = input;
        this.state = state || CommandState.OK;
        this.output = output || '';
        this.inquirerPrompt = inquirerPrompt;
        this._id = CommandResponse._responseId++;
    }
    get json() {
        return {
            command: this.input,
            state: CommandState[this.state],
            output: this.output,
            inquirerPrompt: this.inquirerPrompt,
        };
    }
}
exports.default = CommandResponse;
CommandResponse._responseId = 0;
//# sourceMappingURL=CommandResponse.js.map