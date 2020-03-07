"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RobotManager_1 = require("./robot/RobotManager");
const inquirer = require('inquirer');
class SayHelper {
    constructor() {
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
                    RobotManager_1.default.Instance.say(result.sayInput);
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