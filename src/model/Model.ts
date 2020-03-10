const path = require('path');

import { EventEmitter } from "events";
import Config from "./Config";
import { appVersion } from './AppVersion';
import Profiles from './Profiles';
import Profile from './Profile';
import RobotManager from '../robot/RobotManager';
import { Logger } from 'robokit-rom';

let configDataTemplate: any = require('../../data/config-template.json');

export default class Model extends EventEmitter {

    public config: Config;

    constructor() {
        super();
        this.config = new Config();
        const loggerDirectory: string = path.resolve(this.config.configDirectory, 'logs');
        Logger.setLogDirectory(loggerDirectory)
        this.config.load((err: any, obj: any) => {
            if (err || !this.config.data) {
                Logger.info([`Model: Config not found. Using template.`]);
                RobotManager.Instance.initProfiles(configDataTemplate);
                RobotManager.Instance.initRobotConfigs(configDataTemplate.robotConfigs);
                RobotManager.Instance.initRomCommands(configDataTemplate.romCommands)
                RobotManager.Instance.initRobotGroups(configDataTemplate.robotGroups);
                RobotManager.Instance.activeGroupName = configDataTemplate.activeGroupName;
            } else {
                RobotManager.Instance.initProfiles(this.config.data);
                RobotManager.Instance.initRobotConfigs(this.config.data.robotConfigs);
                RobotManager.Instance.initRomCommands(this.config.data.romCommands)
                RobotManager.Instance.initRobotGroups(this.config.data.robotGroups);
                RobotManager.Instance.activeGroupName = this.config.data.activeGroupName;
            }
            this.emit('ready', this);
        });
    }

    initWithData(data: any): void {
    }

    get json(): any {
        let result: any = {}
        return result;
    }

    saveConfig(): void {
        this.config.data = {
            ...RobotManager.Instance.profiles.json,
            robotConfigs: RobotManager.Instance.robotConfigs.json,
            robotGroups: RobotManager.Instance.robotGroups.json,
            activeGroupName: RobotManager.Instance.activeGroupName,
            romCommands: RobotManager.Instance.romCommands.json,
        }
        this.config.save((err: any) => {
            if (err) {
                Logger.error([`Model: Error saving config: `, err]);
            }
        });
    }

    reloadConfig(): void {
        this.config.load((err: any, obj: any) => {
            if (err || !this.config.data) {
                Logger.info([`Model: Config not found. Using template.`]);
                RobotManager.Instance.initProfiles(configDataTemplate);
                RobotManager.Instance.initRobotConfigs(configDataTemplate.robotConfigs);
                RobotManager.Instance.initRomCommands(configDataTemplate.romCommands)
                RobotManager.Instance.initRobotGroups(configDataTemplate.robotGroups);
                RobotManager.Instance.activeGroupName = configDataTemplate.activeGroupName;

            } else {
                RobotManager.Instance.initProfiles(this.config.data);
                RobotManager.Instance.initRobotConfigs(this.config.data.robotConfigs);
                RobotManager.Instance.initRomCommands(this.config.data.romCommands)
                RobotManager.Instance.initRobotGroups(this.config.data.robotGroups);
                RobotManager.Instance.activeGroupName = this.config.data.activeGroupName;
            }
            this.emit('updateModel', this);
        });
    }

    start(skillName: string) {
        RobotManager.Instance.start(skillName);
    }

    status(robotName?: string) {
        return RobotManager.Instance.status(robotName);
    }

    getAppVerison(): string {
        return appVersion;
    }

    dispose(): void {
        configDataTemplate = undefined;
        delete (this.config);// = null;
    }
}