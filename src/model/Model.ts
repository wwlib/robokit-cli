import { EventEmitter } from "events";
import Config from "./Config";
import { appVersion } from './AppVersion';
import Profiles from './Profiles';
import Profile from './Profile';
import RobotManager from '../robot/RobotManager';

let configDataTemplate: any = require('../../data/config-template.json');

export default class Model extends EventEmitter {

    public config: Config;

    constructor() {
        super();
        this.config = new Config();
        this.config.load((err: any, obj: any) => {
            if (err || !this.config.data) {
                console.log(`Model: Config not found. Using template.`);
                // this.config.data = configDataTemplate;
                // this.initWithData(this.config.data);
                // this.saveConfig();
                RobotManager.Instance.initProfiles(configDataTemplate);
                RobotManager.Instance.initRobotConfigs(configDataTemplate.robotConfigs);
                RobotManager.Instance.initRomCommands(configDataTemplate.romCommands)
                RobotManager.Instance.initRobotGroups(configDataTemplate.robotGroups);
                RobotManager.Instance.activeGroupName = configDataTemplate.activeGroupName;
            } else {
                // this.initWithData(this.config.data);
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
                console.log(`Model: Error saving config: `, err);
            }
        });
    }

    reloadConfig(): void {
        this.config.load((err: any, obj: any) => {
            if (err || !this.config.data) {
                console.log(`Model: Config not found. Using template.`);
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

    status() {
        return RobotManager.Instance.status();
    }

    getAppVerison(): string {
        return appVersion;
    }

    dispose(): void {
        configDataTemplate = undefined;
        delete (this.config);// = null;
    }
}