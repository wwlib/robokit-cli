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
const events_1 = require("events");
const Profile_1 = require("./model/Profile");
const RobotConfig_1 = require("./model/RobotConfig");
const CommandResponse_1 = require("./CommandResponse");
const ProfileHelper_1 = require("./ProfileHelper");
const RobotConfigHelper_1 = require("./RobotConfigHelper");
const SayHelper_1 = require("./SayHelper");
const RobotManager_1 = require("./robot/RobotManager");
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const jsonfile = require('jsonfile');
const prettyjson = require('prettyjson');
const prettyjsonColors = {
    numberColor: 'yellow',
};
const chalk = require('chalk');
const { Spinner } = require('cli-spinner');
const inquirer = require('inquirer');
const CANCEL_OPTION = '(cancel)';
exports.help = {
    '$ <shell command>': 'executes the specified shell command',
    '! <rom command>': 'sends the specified rom commmand to targeted robot(s)',
    'load profile <path>': 'loads the specified profile json',
    'show profile <profileId>': 'shows the specified profile',
    'show robot <configId>': 'shows the specified robot config',
    'delete profile <id>': 'deletes the specified profile json (must save)',
    'edit profile <property> <value>': 'edit a profile property (must save)',
    'edit robot <property> <value>': 'edit a robot config property (must save)',
    'new profile': 'create a new profile (must save)',
    'new robot': 'create a new robot config (must save)',
    'save config': 'saves the loaded profiles and robot configs',
    'list [profiles | robots | commands | groups]': '',
    'profiles': 'lists the loaded profiles',
    'robots': 'lists the loaded robot configs',
    'commands': 'lists the defined rom commands',
    'groups': 'lists the defined robot groups',
    'set [profile | group] <id>': '',
    'profile <id>': 'sets the active profile',
    'group <id>': 'sets the active robot group',
    'connect': 'connects the targeted robot(s)',
    'disconnect': 'disconnects the targeted robot(s)',
    'start <skill>': 'starts the specified skill',
    'say <text>': 'sends a tts rom command with the specified text',
    'config': 'shows current cli configuration',
    'status': 'shows current cli status',
    'clear': 'clears the console',
    'quit': 'quit',
    'q': 'quit',
    'bye': 'quit',
    'x': 'quit',
    'help': 'help',
};
class CommandParser extends events_1.EventEmitter {
    constructor(appModel) {
        super();
        // console.log(`CommandParser: config: `, config);
        this._appModel = appModel;
    }
    get profile() {
        return RobotManager_1.default.Instance.profiles.getActiveProfile();
    }
    getConfig() {
        let config = {
            configFile: this._appModel.config.configFile,
        };
        return prettyjson.render(config, prettyjsonColors);
    }
    getStatus() {
        return prettyjson.render(this._appModel.status(), prettyjsonColors);
    }
    parseCommand(input) {
        return new Promise((resolve, reject) => {
            const firstChar = input.substr(0, 1);
            const secondChar = input.substr(1, 1);
            if (input.length > 1 && firstChar === '!' && secondChar !== ' ') {
                input = `${firstChar} ${input.substr(1)}`;
            }
            const tokens = input.split(' ');
            const command = tokens[0];
            let subCommand = '';
            const args = tokens.slice(1);
            const argsText = args.join(' ');
            let cr;
            switch (command) {
                case '$':
                case 'exec':
                case 'shell':
                    this.execShellCommand(argsText)
                        .then((result) => {
                        cr = new CommandResponse_1.default(input, result);
                        resolve(cr);
                    })
                        .catch(error => {
                        cr = new CommandResponse_1.default(input, error, CommandResponse_1.CommandState.NOK);
                        reject(cr);
                    });
                    break;
                case '!':
                    if (argsText) {
                        console.log(`command: ${argsText}`);
                        RobotManager_1.default.Instance.command(argsText);
                    }
                    resolve('OK');
                    break;
                case 'clear':
                    this.execShellCommand('clear')
                        .then((result) => {
                        resolve(result);
                    })
                        .catch(error => {
                        reject(error);
                    });
                    break;
                case 'load':
                    subCommand = args[0];
                    resolve(this.parseLoadCommand(subCommand, args.slice(1)));
                    break;
                case 'show':
                    subCommand = args[0];
                    this.parseShowCommand(subCommand, args.slice(1))
                        .then((result) => {
                        resolve(result);
                    })
                        .catch((error) => {
                        reject(prettyjson.render(error, prettyjsonColors));
                    });
                    break;
                case 'delete':
                    subCommand = args[0];
                    resolve(this.parseDeleteCommand(subCommand, args.slice(1)));
                    break;
                case 'save':
                    subCommand = args[0];
                    this.parseSaveCommand(subCommand, args.slice(1))
                        .then((result) => {
                        resolve(result);
                    })
                        .catch((error) => {
                        reject(prettyjson.render(error, prettyjsonColors));
                    });
                    break;
                case 'edit':
                    subCommand = args[0];
                    resolve(this.parseEditCommand(subCommand, args.slice(1)));
                    break;
                case 'new':
                    subCommand = args[0];
                    resolve(this.parseNewCommand(subCommand, args.slice(1)));
                    break;
                case 'profile':
                    resolve(this.parseSetCommand('profile', args));
                    break;
                case 'group':
                    resolve(this.parseSetCommand('group', args));
                    break;
                case 'profiles':
                    resolve(this.parseListCommand('profiles', []));
                case 'robots':
                    resolve(this.parseListCommand('robots', []));
                    break;
                case 'commands':
                    resolve(this.parseListCommand('commands', []));
                    break;
                case 'groups':
                    resolve(this.parseListCommand('groups', []));
                    break;
                case 'list':
                    subCommand = args[0];
                    resolve(this.parseListCommand(subCommand, args.slice(1)));
                    break;
                case 'config':
                    resolve(this.getConfig());
                    break;
                case 'status':
                    resolve(this.getStatus());
                    break;
                case 'set':
                    subCommand = args[0];
                    resolve(this.parseSetCommand(subCommand, args.slice(1)));
                    break;
                case 'connect':
                    subCommand = args[0];
                    this.parseConnectCommand(subCommand, args.slice(1))
                        .then((result) => {
                        resolve(result);
                    })
                        .catch((error) => {
                        reject(prettyjson.render(error, prettyjsonColors));
                    });
                    break;
                case 'disconnect':
                    subCommand = args[0];
                    this.parseDisconnectCommand(subCommand, args.slice(1))
                        .then((result) => {
                        resolve(result);
                    })
                        .catch((error) => {
                        reject(prettyjson.render(error, prettyjsonColors));
                    });
                    break;
                case 'start':
                    subCommand = args[0];
                    if (subCommand) {
                        this._appModel.start(subCommand);
                        resolve('OK');
                    }
                    else {
                        resolve('Skill not found');
                    }
                    break;
                case 'say':
                    if (argsText) {
                        console.log(`say: ${argsText}`);
                        RobotManager_1.default.Instance.say(argsText);
                        resolve('OK');
                    }
                    else {
                        const sayHelper = new SayHelper_1.default();
                        sayHelper.loop()
                            .then((sayResult) => {
                            resolve(sayResult);
                        });
                    }
                    break;
                case 'help':
                    resolve(prettyjson.render(exports.help, prettyjsonColors));
                default:
                    resolve(`${chalk.keyword('orange')('unrecognized command:')} ${input}`);
                    break;
            }
        });
    }
    execShellCommand(shellCommand) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(`executing shell command: ${shellCommand}`);
            const { stdout, stderr } = yield exec(shellCommand);
            // console.log('stdout:', stdout);
            // console.log('stderr:', stderr);
            return stdout;
        });
    }
    parseSetCommand(command, args) {
        let result = '';
        switch (command) {
            case 'profile':
                var profileId = args.join(' ');
                if (profileId) {
                    var activeProfile = RobotManager_1.default.Instance.profiles.setActiveProfile(profileId);
                    if (activeProfile) {
                        result = `current profile set to: ${activeProfile.id}`;
                    }
                    else {
                        result = `current profile set to: undefined`;
                    }
                    this._appModel.saveConfig();
                }
                else {
                    let choices = RobotManager_1.default.Instance.profiles.getProfileIds();
                    choices.push(CANCEL_OPTION);
                    result = {
                        type: 'list',
                        name: 'mainInput',
                        message: 'Set which profile?',
                        choices: choices,
                        filter: function (val) {
                            if (val === CANCEL_OPTION) {
                                return '';
                            }
                            else {
                                return `set profile ${val}`;
                            }
                        }
                    };
                }
                break;
            case 'group':
                let groupName = args.join(' ');
                if (groupName) {
                    RobotManager_1.default.Instance.activeGroupName = groupName;
                    result = `current group set to: ${RobotManager_1.default.Instance.activeGroupName}`;
                    this._appModel.saveConfig();
                }
                else {
                    let choices = RobotManager_1.default.Instance.robotGroupNames;
                    choices.push(CANCEL_OPTION);
                    result = {
                        type: 'list',
                        name: 'mainInput',
                        message: 'Set which group?',
                        choices: choices,
                        filter: function (val) {
                            if (val === CANCEL_OPTION) {
                                return '';
                            }
                            else {
                                return `set group ${val}`;
                            }
                        }
                    };
                }
                break;
            default:
                break;
        }
        return result;
    }
    parseLoadCommand(command, args) {
        let result = '';
        switch (command) {
            case 'profile':
                const profilePath = args[0];
                result = `loading profile: ${profilePath}`;
                jsonfile.readFile(profilePath, (err, obj) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        this._appModel.saveConfig();
                    }
                });
                break;
        }
        return result;
    }
    parseDeleteCommand(command, args) {
        let result = '';
        switch (command) {
            case 'profile':
                const profileId = args.join(' ');
                if (profileId) {
                    RobotManager_1.default.Instance.profiles.deleteProfile(profileId);
                    RobotManager_1.default.Instance.profiles.getProfileIds().forEach((profileId) => {
                        result += `${chalk.green(profileId)}]\n`;
                    });
                    result += `Remember to ${chalk.green('save profiles')}`;
                }
                else {
                    let choices = RobotManager_1.default.Instance.profiles.getProfileIds();
                    choices.push(CANCEL_OPTION);
                    result = {
                        type: 'list',
                        name: 'mainInput',
                        message: 'Delete which profile?',
                        choices: choices,
                        filter: function (val) {
                            if (val === CANCEL_OPTION) {
                                return '';
                            }
                            else {
                                return `delete profile ${val}`;
                            }
                        }
                    };
                }
                break;
        }
        return result;
    }
    parseShowCommand(command, args) {
        return new Promise((resolve, reject) => {
            let result = '';
            switch (command) {
                case 'profile':
                    const profileId = args.join(' ');
                    var profile;
                    if (profileId) {
                        profile = RobotManager_1.default.Instance.profiles.getProfileWithId(profileId);
                    }
                    else {
                        let choices = RobotManager_1.default.Instance.profiles.getProfileIds();
                        choices.push(CANCEL_OPTION);
                        result = {
                            type: 'list',
                            name: 'mainInput',
                            message: 'Show which profile?',
                            choices: choices,
                            filter: function (val) {
                                if (val === CANCEL_OPTION) {
                                    return '';
                                }
                                else {
                                    return `show profile ${val}`;
                                }
                            }
                        };
                    }
                    if (profile) {
                        result = prettyjson.render(profile.json, prettyjsonColors);
                    }
                    resolve(result);
                    break;
                case 'robot':
                    const configId = args.join(' ');
                    var config;
                    if (configId) {
                        config = RobotManager_1.default.Instance.robotConfigs.getRobotConfigWithId(configId);
                    }
                    else {
                        let choices = RobotManager_1.default.Instance.robotConfigs.getRobotConfigIds();
                        choices.push(CANCEL_OPTION);
                        result = {
                            type: 'list',
                            name: 'mainInput',
                            message: 'Show which robot config?',
                            choices: choices,
                            filter: function (val) {
                                if (val === CANCEL_OPTION) {
                                    return '';
                                }
                                else {
                                    return `show robot ${val}`;
                                }
                            }
                        };
                    }
                    if (config) {
                        result = prettyjson.render(config.json, prettyjsonColors);
                    }
                    resolve(result);
                    break;
                default:
                    result = {
                        type: 'list',
                        name: 'mainInput',
                        message: 'Show what?',
                        choices: ['profile', 'robot', CANCEL_OPTION],
                        filter: function (val) {
                            if (val === CANCEL_OPTION) {
                                return '';
                            }
                            else {
                                return `show ${val}`;
                            }
                        }
                    };
                    resolve(result);
                    break;
            }
        });
    }
    parseSaveCommand(command, args) {
        return new Promise((resolve, reject) => {
            let result = '';
            switch (command) {
                case 'config':
                    this._appModel.saveConfig();
                    result = `${chalk.green('saved')} profiles`;
                    resolve(result);
                    break;
                default:
                    result = {
                        type: 'list',
                        name: 'mainInput',
                        message: 'Save what?',
                        choices: ['config', CANCEL_OPTION],
                        filter: function (val) {
                            if (val === CANCEL_OPTION) {
                                return '';
                            }
                            else {
                                return `save ${val}`;
                            }
                        }
                    };
                    resolve(result);
                    break;
            }
        });
    }
    parseEditCommand(command, args) {
        return new Promise((resolve, reject) => {
            let result = '';
            let key = '';
            let value = '';
            switch (command) {
                case 'profile':
                    key = args[0];
                    value = args.slice(1).join(' ');
                    if (this.profile) {
                        if (key) {
                            if (value) {
                                RobotManager_1.default.Instance.profiles.setProfileProperty(key, value);
                                result = prettyjson.render(this.profile.json, prettyjsonColors);
                            }
                            else {
                                result = {
                                    type: 'input',
                                    name: 'mainInput',
                                    message: 'What is the property value?',
                                    default: this.profile.getProperty(key),
                                    filter: function (val) {
                                        if (val === CANCEL_OPTION) {
                                            return '';
                                        }
                                        else {
                                            return `edit profile ${key} ${val}`;
                                        }
                                    }
                                };
                            }
                        }
                        else {
                            var choices = Profile_1.default.propertyKeys;
                            choices.push(CANCEL_OPTION);
                            result = {
                                type: 'list',
                                name: 'mainInput',
                                message: 'Edit which profile property?',
                                choices: choices,
                                filter: function (val) {
                                    if (val === CANCEL_OPTION) {
                                        return '';
                                    }
                                    else {
                                        return `edit profile ${val}`;
                                    }
                                }
                            };
                        }
                    }
                    else {
                        result = `no active profile.`;
                    }
                    resolve(result);
                    break;
                case 'robot':
                    key = args[0];
                    if (key) {
                        const robotConfig = RobotManager_1.default.Instance.robotConfigs.getRobotConfigWithId(key);
                        if (robotConfig) {
                            const robotConfigHelper = new RobotConfigHelper_1.default(robotConfig);
                            robotConfigHelper.create()
                                .then((newRobotConfigResult) => {
                                if (newRobotConfigResult instanceof RobotConfig_1.default) {
                                    this._appModel.saveConfig();
                                    result = prettyjson.render(newRobotConfigResult.json, prettyjsonColors);
                                }
                                else {
                                    result = `${chalk.red(newRobotConfigResult)}`;
                                }
                                const cr = new CommandResponse_1.default('edit robot', result);
                                resolve(cr);
                            });
                        }
                        else {
                            const cr = new CommandResponse_1.default('edit robot', 'invalid robot config');
                            resolve(cr);
                        }
                    }
                    else {
                        let choices = RobotManager_1.default.Instance.robotConfigs.getRobotConfigIds();
                        choices.push(CANCEL_OPTION);
                        result = {
                            type: 'list',
                            name: 'mainInput',
                            message: 'Edit which robot config?',
                            choices: choices,
                            filter: function (val) {
                                if (val === CANCEL_OPTION) {
                                    return '';
                                }
                                else {
                                    return `edit robot ${val}`;
                                }
                            }
                        };
                        resolve(result);
                    }
                    break;
                default:
                    result = {
                        type: 'list',
                        name: 'mainInput',
                        message: 'Edit what?',
                        choices: ['profile', 'robot', CANCEL_OPTION],
                        filter: function (val) {
                            if (val === CANCEL_OPTION) {
                                return '';
                            }
                            else {
                                return `edit ${val}`;
                            }
                        }
                    };
                    resolve(result);
                    break;
            }
        });
    }
    parseNewCommand(command, args) {
        return new Promise((resolve, reject) => {
            let result = '';
            switch (command) {
                case 'profile':
                    if (this.profile) {
                        const profileId = args.join(' ');
                        if (profileId) {
                            const newProfile = RobotManager_1.default.Instance.profiles.newProfile(profileId);
                            if (newProfile) {
                                result = prettyjson.render(this.profile.json, prettyjsonColors);
                            }
                            else {
                                result = `${chalk.red('Error making new profile.')}`;
                            }
                            resolve(result);
                        }
                        else {
                            const profileHelper = new ProfileHelper_1.default();
                            profileHelper.create()
                                .then((newProfileResult) => {
                                if (newProfileResult instanceof Profile_1.default) {
                                    this._appModel.saveConfig();
                                    result = prettyjson.render(newProfileResult.json, prettyjsonColors);
                                }
                                else {
                                    result = `${chalk.red(newProfileResult)}`;
                                }
                                const cr = new CommandResponse_1.default('new profile', result);
                                resolve(cr);
                            });
                        }
                    }
                    else {
                        const cr = new CommandResponse_1.default('new profile', `no active profile.`);
                        resolve(cr);
                    }
                    break;
                case 'robot':
                    const robotConfigHelper = new RobotConfigHelper_1.default();
                    robotConfigHelper.create()
                        .then((newRobotConfigResult) => {
                        if (newRobotConfigResult instanceof RobotConfig_1.default) {
                            this._appModel.saveConfig();
                            result = prettyjson.render(newRobotConfigResult.json, prettyjsonColors);
                        }
                        else {
                            result = `${chalk.red(newRobotConfigResult)}`;
                        }
                        const cr = new CommandResponse_1.default('new robot', result);
                        resolve(cr);
                    });
                    break;
                default:
                    resolve(`${chalk.keyword('orange')('incomplete command:')} new ${command}`);
                    break;
            }
        });
    }
    parseListCommand(command, args) {
        let result = '';
        switch (command) {
            case 'profiles':
                RobotManager_1.default.Instance.profiles.getProfileIds().forEach((profileId) => {
                    result += `${chalk.green(profileId)}\n`;
                });
                break;
            case 'robots':
                RobotManager_1.default.Instance.robotConfigs.getRobotConfigIds().forEach((configId) => {
                    result += `${chalk.green(configId)}\n`;
                });
                break;
            case 'commands':
                RobotManager_1.default.Instance.romCommands.commandNamesWithKeyCodes.forEach((commandName) => {
                    result += `${chalk.green(commandName)}\n`;
                });
                break;
            case 'groups':
                RobotManager_1.default.Instance.robotGroups.json.forEach((groupData) => {
                    const line = `${groupData.name} -> [${groupData.robots.join(', ')}]`;
                    result += `${chalk.green(line)}\n`;
                });
                break;
            default:
                break;
        }
        return result;
    }
    parseConnectCommand(robotGroupName = '', args) {
        return new Promise((resolve, reject) => {
            RobotManager_1.default.Instance.connect(robotGroupName);
            let result = '';
            result = `${chalk.green('connected:')} ${robotGroupName}`;
            resolve(result);
        });
    }
    parseDisconnectCommand(robotGroupName = '', args) {
        return new Promise((resolve, reject) => {
            RobotManager_1.default.Instance.disconnect(robotGroupName);
            let result = '';
            result = `${chalk.green('disconnected:')} ${robotGroupName}`;
            resolve(result);
        });
    }
}
exports.default = CommandParser;
//# sourceMappingURL=CommandParser.js.map