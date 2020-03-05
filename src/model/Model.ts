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
    public robotConfigs: RobotConfigs = new RobotConfigs(configDataTemplate);
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
                this.robotConfigs = new RobotConfigs(configDataTemplate);
                this.romCommands.initWithData(configDataTemplate.romCommands);
            } else {
                // this.initWithData(this.config.data);
                this.profiles = new Profiles(this.config.data);
                this.robotConfigs = new RobotConfigs(this.config.data);
                this.romCommands.initWithData(this.config.data.romCommands);
            }
            this.emit('ready', this);
        });
    }

    initWithData(data: any): void {
    }

    getActiveProfile(): Profile {
        return this.profiles.getActiveProfile();
    }

    getActiveRobotConfig(): RobotConfig {
        return this.robotConfigs.getActiveRobotConfig();
    }

    get json(): any {
        let result: any = {}
        return result;
    }

    saveConfig(): void {
        // console.log(`saveConfig: `, this.profiles.json);
        this.config.data = {
            ...this.profiles.json,
            ...this.robotConfigs.json,
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
                // this.config.data = configDataTemplate;
                // this.initWithData(this.config.data);
                this.profiles = new Profiles(configDataTemplate);
                this.robotConfigs = new RobotConfigs(configDataTemplate);
            } else {
                // this.initWithData(this.config.data);
                this.profiles = new Profiles(this.config.data);
                this.robotConfigs = new RobotConfigs(this.config.data);
            }
            this.emit('updateModel', this);
        });
    }

    //// Robot

    connect(robotConfigId: string = '') {
        let config: RobotConfig | undefined = this.robotConfigs.getActiveRobotConfig();
        if (robotConfigId) {
            config = this.robotConfigs.getRobotConfigWithId(robotConfigId);
        }
        const profile: Profile = this.profiles.getActiveProfile();
        if (config && profile) {
            RobotManager.Instance.connectWithProfileAndRobotConfig(profile, config);
        } else {
            console.log(`Model: connect: invalid profile and/or robot config`);
        }
    }

    disconnect(robotConfigId: string = '') {
        let config: RobotConfig | undefined = this.robotConfigs.getActiveRobotConfig();
        if (robotConfigId) {
            config = this.robotConfigs.getRobotConfigWithId(robotConfigId);
        }
        if (config) {
            RobotManager.Instance.disconnectWithRobotConfig(config);
        } else {
            console.log(`Model: disconnect: invalid robot config`);
        }
    }

    say(text: string, robotConfigId: string = '') {
        if (text.length === 1) {
            this.command(text, robotConfigId);
        } else {
            let config: RobotConfig | undefined = this.robotConfigs.getActiveRobotConfig();
            if (robotConfigId) {
                config = this.robotConfigs.getRobotConfigWithId(robotConfigId);
            }
            if (config) {
                RobotManager.Instance.sayWithRobotConfigAndText(config, text);
            } else {
                console.log(`Model: say: invalid robot config`);
            }
        }
    }

    command(text: string, robotConfigId: string = '') {
        let config: RobotConfig | undefined = this.robotConfigs.getActiveRobotConfig();
        if (robotConfigId) {
            config = this.robotConfigs.getRobotConfigWithId(robotConfigId);
        }
        if (config) {
            if (text.length === 1) {
                const romCommand: RomCommand | undefined = this.romCommands.getCommandWithKeyCode(text);
                if (romCommand) {
                    RobotManager.Instance.commandWithRobotConfigAndRomCommand(config, romCommand);
                }
            } else {
                const romCommand: RomCommand | undefined = this.romCommands.getCommandWithName(text);
                if (romCommand) {
                    RobotManager.Instance.commandWithRobotConfigAndRomCommand(config, romCommand);
                }
            }
            
        } else {
            console.log(`Model: say: invalid robot config`);
        }
    }

    debug() {
        RobotManager.Instance.debug();
    }

    getAppVerison(): string {
        return appVersion;
    }

    dispose(): void {
        configDataTemplate = undefined;
        delete(this.config);// = null;
    }
}