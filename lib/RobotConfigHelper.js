"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RobotManager_1 = require("./robot/RobotManager");
const RobotConfig_1 = require("./model/RobotConfig");
const inquirer = require('inquirer');
/*
  configId = 'configId',
  type = 'type',
  ip = 'ip',
  serialName = 'serialName',
  email = 'email',
  password = 'password',
*/
class RobotConfigHelper {
    constructor(config) {
        this._editMode = false;
        if (!config) {
            this._config = new RobotConfig_1.default();
        }
        else {
            this._config = config;
            this._editMode = true;
        }
    }
    create() {
        return new Promise((resolve, reject) => {
            const questions = [
                {
                    type: 'list',
                    name: 'type',
                    choices: ['jibo', 'robokit'],
                    message: `What is the robot type?:\n`,
                    default: this._config.type,
                },
                {
                    type: 'input',
                    name: 'serialName',
                    message: `What is robot serial name?:\n`,
                    default: this._config.serialName,
                },
                {
                    type: 'input',
                    name: 'email',
                    message: `What is robot owner's email?:\n`,
                    default: this._config.email,
                },
                {
                    type: 'input',
                    name: 'password',
                    message: `What is robot owner's password?:\n`,
                    default: this._config.password,
                },
                {
                    type: 'list',
                    name: 'confirm',
                    choices: ['yes', 'no'],
                    message: `Confirm: ${this._editMode ? 'Edit' : 'Create'} this new robot config?:\n`,
                }
            ];
            if (!this._editMode) {
                questions.unshift({
                    type: 'input',
                    name: 'configId',
                    message: `Provide a name (id) for the new robot config:\n`,
                });
            }
            inquirer.prompt(questions).then((result) => {
                // console.log(result);
                if (result.confirm === 'yes') {
                    this._config.data.type = result.type;
                    this._config.data.serialName = result.serialName;
                    this._config.data.email = result.email;
                    this._config.data.password = result.password;
                    if (!this._editMode) {
                        this._config.id = result.configId;
                        RobotManager_1.default.Instance.addRobotConfig(this._config);
                    }
                    resolve(this._config);
                }
                else {
                    resolve('new/edit robot config canceled.');
                }
            });
        });
    }
    dispose() {
    }
}
exports.default = RobotConfigHelper;
//# sourceMappingURL=RobotConfigHelper.js.map