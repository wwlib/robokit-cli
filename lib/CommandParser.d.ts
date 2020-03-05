/// <reference types="node" />
import { EventEmitter } from 'events';
import Model from './model/Model';
import Profile from './model/Profile';
import RobotConfig from './model/RobotConfig';
export declare const help: any;
export default class CommandParser extends EventEmitter {
    private _appModel;
    constructor(appModel: Model);
    get profile(): Profile;
    get robotConfig(): RobotConfig;
    getConfig(): string;
    parseCommand(input: string): Promise<any>;
    execShellCommand(shellCommand: string): Promise<any>;
    parseSetCommand(command: string, args: string[]): string;
    parseLoadCommand(command: string, args: string[]): string;
    parseDeleteCommand(command: string, args: string[]): any;
    parseShowCommand(command: string, args: string[]): Promise<any>;
    parseSaveCommand(command: string, args: string[]): Promise<any>;
    parseEditCommand(command: string, args: string[]): any;
    parseNewCommand(command: string, args: string[]): Promise<any>;
    parseListCommand(command: string, args: string[]): string;
    parseConnectCommand(robotConfigId: string, args: string[]): Promise<any>;
    parseDisconnectCommand(robotConfigId: string, args: string[]): Promise<any>;
}
