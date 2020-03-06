import { EventEmitter } from "events";
import Config from "./Config";
import { appVersion } from './AppVersion';
import Profiles from './Profiles';
import Profile from './Profile';
import RobotConfig from "./RobotConfig";
import RobotConfigs from "./RobotConfigs";
import { RomCommand, RomCommands } from 'robokit-rom';

import RobotManager from '../robot/RobotManager';

let configDataTemplate: any = require('../../data/config-template.json');

export default class Model extends EventEmitter {

    public config: Config;
    public profiles: Profiles = new Profiles(configDataTemplate);
    // public robotConfigs: RobotConfigs = new RobotConfigs(configDataTemplate);
    public romCommands: RomCommands = new RomCommands();

    constructor() {
        super();
        this.config = new Config();
        this.config.load((err: any, obj: any) => {
            if (err || !this.config.data) {
                console.log(`Model: Config not found. Using template.`);
                // this.config.data = configDataTemplate;
                // this.initWithData(this.config.data);
                // this.saveConfig();
                this.profiles = new Profiles(configDataTemplate);
                RobotManager.Instance.initRobotConfigs(configDataTemplate.robotConfigs);
                this.romCommands.initWithData(configDataTemplate.romCommands);
                RobotManager.Instance.initRobotGroups(configDataTemplate.robotGroups);
                RobotManager.Instance.activeGroupName = configDataTemplate.activeGroupName;
            } else {
                // this.initWithData(this.config.data);
                this.profiles = new Profiles(this.config.data);
                RobotManager.Instance.initRobotConfigs(this.config.data.robotConfigs);
                this.romCommands.initWithData(this.config.data.romCommands);
                RobotManager.Instance.initRobotGroups(this.config.data.robotGroups);
                RobotManager.Instance.activeGroupName = this.config.data.activeGroupName;
            }
            this.emit('ready', this);
        });
    }

    initWithData(data: any): void {
    }

    getActiveProfile(): Profile {
        return this.profiles.getActiveProfile();
    }

    get json(): any {
        let result: any = {}
        return result;
    }

    saveConfig(): void {
        // console.log(`saveConfig: `, this.profiles.json);
        this.config.data = {
            ...this.profiles.json,
            robotConfigs: RobotManager.Instance.robotConfigs.json,
            robotGroups: RobotManager.Instance.robotGroups.json,
            activeGroupName: RobotManager.Instance.activeGroupName,
            romCommands: this.romCommands.json,
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
                this.profiles = new Profiles(configDataTemplate);
                RobotManager.Instance.initRobotConfigs(configDataTemplate.robotConfigs);
                this.romCommands.initWithData(configDataTemplate.romCommands);
                RobotManager.Instance.initRobotGroups(configDataTemplate.robotGroups);
                RobotManager.Instance.activeGroupName = configDataTemplate.activeGroupName;

            } else {
                this.profiles = new Profiles(this.config.data);
                RobotManager.Instance.initRobotConfigs(this.config.data.robotConfigs);
                this.romCommands.initWithData(this.config.data.romCommands);
                RobotManager.Instance.initRobotGroups(this.config.data.robotGroups);
                RobotManager.Instance.activeGroupName = this.config.data.activeGroupName;
            }
            this.emit('updateModel', this);
        });
    }

    //// Robot

    connect(robotConfigId: string = '') {
        // let config: RobotConfig | undefined = RobotManager.Instance.robotConfigs.getActiveRobotConfig();
        // if (robotConfigId) {
        //     config = RobotManager.Instance.robotConfigs.getRobotConfigWithId(robotConfigId);
        // }
        // const profile: Profile = this.profiles.getActiveProfile();
        // if (config && profile) {
        //     RobotManager.Instance.connectWithProfileAndRobotConfig(profile, config);
        // } else {
        //     console.log(`Model: connect: invalid profile and/or robot config`);
        // }
    }

    disconnect(robotConfigId: string = '') {
        // let config: RobotConfig | undefined = RobotManager.Instance.robotConfigs.getActiveRobotConfig();
        // if (robotConfigId) {
        //     config = RobotManager.Instance.robotConfigs.getRobotConfigWithId(robotConfigId);
        // }
        // if (config) {
        //     RobotManager.Instance.disconnectWithRobotConfig(config);
        // } else {
        //     console.log(`Model: disconnect: invalid robot config`);
        // }
    }

    say(text: string, robotConfigId: string = '') {
        // if (text.length === 1) {
        //     this.command(text, robotConfigId);
        // } else {
        //     let config: RobotConfig | undefined = RobotManager.Instance.robotConfigs.getActiveRobotConfig();
        //     if (robotConfigId) {
        //         config = RobotManager.Instance.robotConfigs.getRobotConfigWithId(robotConfigId);
        //     }
        //     if (config) {
        //         RobotManager.Instance.sayWithRobotConfigAndText(config, text);
        //     } else {
        //         console.log(`Model: say: invalid robot config`);
        //     }
        // }
    }

    command(text: string, robotConfigId: string = '') {
        // let config: RobotConfig | undefined = RobotManager.Instance.robotConfigs.getActiveRobotConfig();
        // if (robotConfigId) {
        //     config = RobotManager.Instance.robotConfigs.getRobotConfigWithId(robotConfigId);
        // }
        // if (config) {
        //     if (text.length === 1) {
        //         const romCommand: RomCommand | undefined = this.romCommands.getCommandWithKeyCode(text);
        //         if (romCommand) {
        //             RobotManager.Instance.commandWithRobotConfigAndRomCommand(config, romCommand);
        //         }
        //     } else {
        //         const romCommand: RomCommand | undefined = this.romCommands.getCommandWithName(text);
        //         if (romCommand) {
        //             RobotManager.Instance.commandWithRobotConfigAndRomCommand(config, romCommand);
        //         }
        //     }

        // } else {
        //     console.log(`Model: say: invalid robot config`);
        // }
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