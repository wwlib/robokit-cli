import { EventEmitter } from 'events';
import Model from './model/Model';
import Profile from './model/Profile';
import RobotConfig from './model/RobotConfig';
import CommandResponse, { CommandState } from './CommandResponse';
import ProfileHelper from './ProfileHelper';
import RobotConfigHelper from './RobotConfigHelper';
import SayHelper from './SayHelper';
import RobotManager from './robot/RobotManager';

const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const jsonfile = require('jsonfile');
const prettyjson = require('prettyjson');
const prettyjsonColors: any = {
    numberColor: 'yellow',
}
const chalk = require('chalk');
const { Spinner } = require('cli-spinner');
const inquirer = require('inquirer');

const CANCEL_OPTION: string = '(cancel)';

export const help: any = {
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
    's': 'shows current cli status',
    'clear': 'clears the console',
    'quit': 'quit',
    'q': 'quit',
    'bye': 'quit',
    'x': 'quit',
    'help': 'help',
}

export default class CommandParser extends EventEmitter {

    private _appModel: Model;

    constructor(appModel: Model) {
        super();
        // console.log(`CommandParser: config: `, config);
        this._appModel = appModel;
    }

    get profile(): Profile | undefined {
        return RobotManager.Instance.profiles.getActiveProfile();
    }

    getConfig(): string {
        let config = {
            configFile: this._appModel.config.configFile,
        }
        return prettyjson.render(config, prettyjsonColors);
    }

    getStatus(robotName?: string): string {
        return prettyjson.render(this._appModel.status(robotName), prettyjsonColors);
    }

    parseCommand(input: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const firstChar: string = input.substr(0, 1);
            const secondChar: string = input.substr(1, 1);
            if (input.length > 1 && firstChar === '!' && secondChar !== ' ') {
                input = `${firstChar} ${input.substr(1)}`;
            }
            const tokens: string[] = input.split(' ');
            const command: string = tokens[0];
            let subCommand: string = '';
            const args = tokens.slice(1);
            const argsText = args.join(' ');
            let cr: CommandResponse;

            switch (command) {
                case '$':
                case 'exec':
                case 'shell':
                    this.execShellCommand(argsText)
                        .then((result: any) => {
                            cr = new CommandResponse(input, result);
                            resolve(cr);
                        })
                        .catch(error => {
                            cr = new CommandResponse(input, error, CommandState.NOK);
                            reject(cr);
                        });
                    break;
                case '!':
                    if (argsText) {
                        console.log(`command: ${argsText}`);
                        RobotManager.Instance.command(argsText);
                    }
                    resolve('OK');
                    break;
                case 'clear':
                    this.execShellCommand('clear')
                        .then((result: any) => {
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
                        .then((result: string) => {
                            resolve(result);
                        })
                        .catch((error: any) => {
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
                        .then((result: string) => {
                            resolve(result);
                        })
                        .catch((error: any) => {
                            reject(prettyjson.render(error, prettyjsonColors));
                        });
                    break;
                case 'edit':
                    subCommand = args[0];
                    resolve(this.parseEditCommand(subCommand, args.slice(1)));
                    break;
                case 'add':
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
                case 's':
                case 'status':
                    subCommand = args[0];
                    resolve(this.getStatus(subCommand));
                    break;
                case 'set':
                    subCommand = args[0];
                    resolve(this.parseSetCommand(subCommand, args.slice(1)));
                    break;
                case 'connect':
                    subCommand = args[0];
                    this.parseConnectCommand(subCommand, args.slice(1))
                        .then((result: string) => {
                            resolve(result);
                        })
                        .catch((error: any) => {
                            reject(prettyjson.render(error, prettyjsonColors));
                        });
                    break;
                case 'disconnect':
                    subCommand = args[0];
                    this.parseDisconnectCommand(subCommand, args.slice(1))
                        .then((result: string) => {
                            resolve(result);
                        })
                        .catch((error: any) => {
                            reject(prettyjson.render(error, prettyjsonColors));
                        });
                    break;
                case 'start':
                    subCommand = args[0];
                    if (subCommand) {
                        this._appModel.start(subCommand);
                        resolve('OK');
                    } else {
                        resolve('Skill not found');
                    }
                    break;
                case 'say':
                    if (argsText) {
                        console.log(`say: ${argsText}`);
                        RobotManager.Instance.say(argsText);
                        resolve('OK');
                    } else {
                        const sayHelper: SayHelper = new SayHelper();
                        sayHelper.loop()
                            .then((sayResult: string) => {
                                resolve(sayResult);
                            });
                    }
                    break;
                case 'help':
                    resolve(prettyjson.render(help, prettyjsonColors));
                default:
                    resolve(`${chalk.keyword('orange')('unrecognized command:')} ${input}`);
                    break;
            }
        });
    }

    async execShellCommand(shellCommand: string) {
        // console.log(`executing shell command: ${shellCommand}`);
        const { stdout, stderr } = await exec(shellCommand);
        // console.log('stdout:', stdout);
        // console.log('stderr:', stderr);
        return stdout;
    }

    parseSetCommand(command: string, args: string[]): string {
        let result: any = '';
        switch (command) {
            case 'profile':
                var profileId: string = args.join(' ');
                if (profileId) {
                    var activeProfile: Profile | undefined = RobotManager.Instance.profiles.setActiveProfile(profileId);
                    if (activeProfile) {
                        result = `current profile set to: ${activeProfile.id}`;
                    } else {
                        result = `current profile set to: undefined`;
                    }
                    this._appModel.saveConfig();
                } else {
                    let choices: string[] = RobotManager.Instance.profiles.getProfileIds();
                    choices.push(CANCEL_OPTION);
                    result = {
                        type: 'list',
                        name: 'mainInput',
                        message: 'Set which profile?',
                        choices: choices,
                        filter: function (val: any) {
                            if (val === CANCEL_OPTION) {
                                return '';
                            } else {
                                return `set profile ${val}`;
                            }
                        }
                    }
                }
                break;
            case 'group':
                let groupName: string = args.join(' ');
                if (groupName) {
                    RobotManager.Instance.activeGroupName = groupName;
                    result = `current group set to: ${RobotManager.Instance.activeGroupName}`;
                    this._appModel.saveConfig();
                } else {
                    let choices: string[] = RobotManager.Instance.robotGroupNames;
                    choices.push(CANCEL_OPTION);
                    result = {
                        type: 'list',
                        name: 'mainInput',
                        message: 'Set which group?',
                        choices: choices,
                        filter: function (val: any) {
                            if (val === CANCEL_OPTION) {
                                return '';
                            } else {
                                return `set group ${val}`;
                            }
                        }
                    }
                }
                break;
            default:
                break;
        }
        return result;
    }

    parseLoadCommand(command: string, args: string[]): string {
        let result: string = '';
        switch (command) {
            case 'profile':
                const profilePath = args[0];
                result = `loading profile: ${profilePath}`;
                jsonfile.readFile(profilePath, (err: any, obj: any) => {
                    if (err) {
                        console.log(err);
                    } else {
                        this._appModel.saveConfig();
                    }
                });
                break;
        }
        return result;
    }

    parseDeleteCommand(command: string, args: string[]): any {
        let result: any = '';
        switch (command) {
            case 'profile':
                const profileId = args.join(' ');

                if (profileId) {
                    RobotManager.Instance.profiles.deleteProfile(profileId);
                    RobotManager.Instance.profiles.getProfileIds().forEach((profileId: string) => {
                        result += `${chalk.green(profileId)}]\n`;
                    });
                    result += `Remember to ${chalk.green('save profiles')}`;
                } else {
                    let choices: string[] = RobotManager.Instance.profiles.getProfileIds();
                    choices.push(CANCEL_OPTION);
                    result = {
                        type: 'list',
                        name: 'mainInput',
                        message: 'Delete which profile?',
                        choices: choices,
                        filter: function (val: any) {
                            if (val === CANCEL_OPTION) {
                                return '';
                            } else {
                                return `delete profile ${val}`;
                            }
                        }
                    }
                }
                break;
        }
        return result;
    }

    parseShowCommand(command: string, args: string[]): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let result: any = '';
            switch (command) {
                case 'profile':
                    const profileId = args.join(' ');
                    var profile: Profile | undefined;
                    if (profileId) {
                        profile = RobotManager.Instance.profiles.getProfileWithId(profileId);
                    } else {
                        let choices: string[] = RobotManager.Instance.profiles.getProfileIds();
                        choices.push(CANCEL_OPTION);
                        result = {
                            type: 'list',
                            name: 'mainInput',
                            message: 'Show which profile?',
                            choices: choices,
                            filter: function (val: any) {
                                if (val === CANCEL_OPTION) {
                                    return '';
                                } else {
                                    return `show profile ${val}`;
                                }
                            }
                        }
                    }
                    if (profile) {
                        result = prettyjson.render(profile.json, prettyjsonColors);
                    }
                    resolve(result);
                    break;
                case 'robot':
                    const configId = args.join(' ');
                    var config: RobotConfig | undefined;
                    if (configId) {
                        config = RobotManager.Instance.robotConfigs.getRobotConfigWithId(configId);
                    } else {
                        let choices: string[] = RobotManager.Instance.robotConfigs.getRobotConfigIds();
                        choices.push(CANCEL_OPTION);
                        result = {
                            type: 'list',
                            name: 'mainInput',
                            message: 'Show which robot config?',
                            choices: choices,
                            filter: function (val: any) {
                                if (val === CANCEL_OPTION) {
                                    return '';
                                } else {
                                    return `show robot ${val}`;
                                }
                            }
                        }
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
                        filter: function (val: any) {
                            if (val === CANCEL_OPTION) {
                                return '';
                            } else {
                                return `show ${val}`;
                            }
                        }
                    }
                    resolve(result);
                    break;
            }
        });
    }

    parseSaveCommand(command: string, args: string[]): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let result: any = '';
            switch (command) {
                case 'config':
                    this._appModel.saveConfig();
                    result = `${chalk.green('saved')} config`;
                    resolve(result);
                    break;
                default:
                    result = {
                        type: 'list',
                        name: 'mainInput',
                        message: 'Save what?',
                        choices: ['config', CANCEL_OPTION],
                        filter: function (val: any) {
                            if (val === CANCEL_OPTION) {
                                return '';
                            } else {
                                return `save ${val}`;
                            }
                        }
                    }
                    resolve(result);
                    break;
            }
        });
    }

    parseEditCommand(command: string, args: string[]): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            let result: any = '';
            let key: string = '';
            let value: string = '';
            switch (command) {
                case 'profile':
                    key = args[0];
                    value = args.slice(1).join(' ');
                    if (this.profile) {
                        if (key) {
                            if (value) {
                                RobotManager.Instance.profiles.setProfileProperty(key, value);
                                result = prettyjson.render(this.profile.json, prettyjsonColors);
                            } else {
                                result = {
                                    type: 'input',
                                    name: 'mainInput',
                                    message: 'What is the property value?',
                                    default: this.profile.getProperty(key),
                                    filter: function (val: any) {
                                        if (val === CANCEL_OPTION) {
                                            return '';
                                        } else {
                                            return `edit profile ${key} ${val}`;
                                        }
                                    }
                                }
                            }
                        } else {
                            var choices: string[] = Profile.propertyKeys;
                            choices.push(CANCEL_OPTION);
                            result = {
                                type: 'list',
                                name: 'mainInput',
                                message: 'Edit which profile property?',
                                choices: choices,
                                filter: function (val: any) {
                                    if (val === CANCEL_OPTION) {
                                        return '';
                                    } else {
                                        return `edit profile ${val}`;
                                    }
                                }
                            }
                        }
                    } else {
                        result = `no active profile.`
                    }
                    resolve(result);
                    break;
                case 'robot':
                    key = args[0];
                    if (key) {
                        const robotConfig: RobotConfig | undefined = RobotManager.Instance.robotConfigs.getRobotConfigWithId(key);
                        if (robotConfig) {
                            const robotConfigHelper = new RobotConfigHelper(robotConfig);
                            robotConfigHelper.create()
                                .then((newRobotConfigResult: RobotConfig) => {
                                    if (newRobotConfigResult instanceof RobotConfig) {
                                        this._appModel.saveConfig();
                                        result = prettyjson.render(newRobotConfigResult.json, prettyjsonColors);
                                    } else {
                                        result = `${chalk.red(newRobotConfigResult)}`;
                                    }
                                    const cr = new CommandResponse('edit robot', result);
                                    resolve(cr);
                                });
                        } else {
                            const cr = new CommandResponse('edit robot', 'invalid robot config');
                            resolve(cr);
                        }
                    } else {
                        let choices: string[] = RobotManager.Instance.robotConfigs.getRobotConfigIds();
                        choices.push(CANCEL_OPTION);
                        result = {
                            type: 'list',
                            name: 'mainInput',
                            message: 'Edit which robot config?',
                            choices: choices,
                            filter: function (val: any) {
                                if (val === CANCEL_OPTION) {
                                    return '';
                                } else {
                                    return `edit robot ${val}`;
                                }
                            }
                        }
                        resolve(result);
                    }
                    break;
                default:
                    result = {
                        type: 'list',
                        name: 'mainInput',
                        message: 'Edit what?',
                        choices: ['profile', 'robot', CANCEL_OPTION],
                        filter: function (val: any) {
                            if (val === CANCEL_OPTION) {
                                return '';
                            } else {
                                return `edit ${val}`;
                            }
                        }
                    }
                    resolve(result);
                    break;
            }
        });
    }

    parseNewCommand(command: string, args: string[]): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            let result: any = '';
            switch (command) {
                case 'profile':
                    if (this.profile) {
                        const profileId: string = args.join(' ');
                        if (profileId) {
                            const newProfile = RobotManager.Instance.profiles.newProfile(profileId);
                            if (newProfile) {
                                result = prettyjson.render(this.profile.json, prettyjsonColors);
                            } else {
                                result = `${chalk.red('Error making new profile.')}`;
                            }
                            resolve(result);
                        } else {
                            const profileHelper = new ProfileHelper();
                            profileHelper.create()
                                .then((newProfileResult: Profile) => {
                                    if (newProfileResult instanceof Profile) {
                                        this._appModel.saveConfig();
                                        result = prettyjson.render(newProfileResult.json, prettyjsonColors);
                                    } else {
                                        result = `${chalk.red(newProfileResult)}`;
                                    }
                                    const cr = new CommandResponse('new profile', result);
                                    resolve(cr);
                                });
                        }
                    } else {
                        const cr = new CommandResponse('new profile', `no active profile.`);
                        resolve(cr);
                    }
                    break;
                case 'robot':
                    const robotConfigHelper = new RobotConfigHelper();
                    robotConfigHelper.create()
                        .then((newRobotConfigResult: RobotConfig) => {
                            if (newRobotConfigResult instanceof RobotConfig) {
                                this._appModel.saveConfig();
                                result = prettyjson.render(newRobotConfigResult.json, prettyjsonColors);
                            } else {
                                result = `${chalk.red(newRobotConfigResult)}`;
                            }
                            const cr = new CommandResponse('new robot', result);
                            resolve(cr);
                        });
                    break;
                default:
                    resolve(`${chalk.keyword('orange')('incomplete command:')} new ${command}`);
                    break;
            }
        })
    }

    parseListCommand(command: string, args: string[]): string {
        let result: string = '';
        switch (command) {
            case 'profiles':
                RobotManager.Instance.profiles.getProfileIds().forEach((profileId: string) => {
                    result += `${chalk.green(profileId)}\n`;
                });
                break;
            case 'robots':
                RobotManager.Instance.robotConfigs.getRobotConfigIds().forEach((configId: string) => {
                    result += `${chalk.green(configId)}\n`;
                });
                break;
            case 'commands':
                RobotManager.Instance.romCommands.commandNamesWithKeyCodes.forEach((commandName: string) => {
                    result += `${chalk.green(commandName)}\n`;
                });
                break;
            case 'groups':
                RobotManager.Instance.robotGroups.json.forEach((groupData: any) => {
                    const line: string = `${groupData.name} -> [${groupData.robots.join(', ')}]`
                    result += `${chalk.green(line)}\n`;
                });
                break;
            default:
                break;
        }
        return result;
    }

    parseConnectCommand(robotGroupName: string = '', args: string[]): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            RobotManager.Instance.connect(robotGroupName);
            let result: any = '';
            result = `${chalk.green('connect:')} ${robotGroupName}`;
            resolve(result);
        });
    }

    parseDisconnectCommand(robotGroupName: string = '', args: string[]): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            RobotManager.Instance.disconnect(robotGroupName);
            let result: any = '';
            result = `${chalk.green('disconnect:')} ${robotGroupName}`;
            resolve(result);
        });
    }
}