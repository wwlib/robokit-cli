"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require('inquirer');
class SayHelper {
    constructor(appModel) {
        this._appModel = appModel;
    }
    sayPrompt() {
        const result = {
            type: 'input',
            name: 'sayInput',
            message: 'say: ',
        };
        return result;
    }
    loop() {
        return new Promise((resolve, reject) => {
            inquirer.prompt(this.sayPrompt()).then((result) => {
                // console.log(result);
                if (result.sayInput === '') {
                    resolve('okOK');
                }
                else {
                    this._appModel.say(result.sayInput);
                    this.loop()
                        .then((loopResult) => {
                        resolve(loopResult);
                    });
                }
            });
        });
    }
    dispose() {
    }
}
exports.default = SayHelper;
//# sourceMappingURL=SayHelper.js.map