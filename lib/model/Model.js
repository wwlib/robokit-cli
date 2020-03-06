"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const Config_1 = require("./Config");
const AppVersion_1 = require("./AppVersion");
const Profiles_1 = require("./Profiles");
const robokit_rom_1 = require("robokit-rom");
const RobotManager_1 = require("../robot/RobotManager");
let configDataTemplate = require('../../data/config-template.json');
class Model extends events_1.EventEmitter {
    constructor() {
        super();
        this.profiles = new Profiles_1.default(configDataTemplate);
        // public robotConfigs: RobotConfigs = new RobotConfigs(configDataTemplate);
        this.romCommands = new robokit_rom_1.RomCommands();
        this.config = new Config_1.default();
        this.config.load((err, obj) => {
            if (err || !this.config.data) {
                console.log(`Model: Config not found. Using template.`);
                // this.config.data = configDataTemplate;
                // this.initWithData(this.config.data);
                // this.saveConfig();
                this.profiles = new Profiles_1.default(configDataTemplate);
                RobotManager_1.default.Instance.initRobotConfigs(configDataTemplate.robotConfigs);
                this.romCommands.initWithData(configDataTemplate.romCommands);
                RobotManager_1.default.Instance.initRobotGroups(configDataTemplate.robotGroups);
                RobotManager_1.default.Instance.activeGroupName = configDataTemplate.activeGroupName;
            }
            else {
                // this.initWithData(this.config.data);
                this.profiles = new Profiles_1.default(this.config.data);
                RobotManager_1.default.Instance.initRobotConfigs(this.config.data.robotConfigs);
                this.romCommands.initWithData(this.config.data.romCommands);
                RobotManager_1.default.Instance.initRobotGroups(this.config.data.robotGroups);
                RobotManager_1.default.Instance.activeGroupName = this.config.data.activeGroupName;
            }
            this.emit('ready', this);
        });
    }
    initWithData(data) {
    }
    getActiveProfile() {
        return this.profiles.getActiveProfile();
    }
    get json() {
        let result = {};
        return result;
    }
    saveConfig() {
        // console.log(`saveConfig: `, this.profiles.json);
        this.config.data = Object.assign(Object.assign({}, this.profiles.json), { robotConfigs: RobotManager_1.default.Instance.robotConfigs.json, robotGroups: RobotManager_1.default.Instance.robotGroups.json, activeGroupName: RobotManager_1.default.Instance.activeGroupName, romCommands: this.romCommands.json });
        this.config.save((err) => {
            if (err) {
                console.log(`Model: Error saving config: `, err);
            }
        });
    }
    reloadConfig() {
        this.config.load((err, obj) => {
            if (err || !this.config.data) {
                console.log(`Model: Config not found. Using template.`);
                this.profiles = new Profiles_1.default(configDataTemplate);
                RobotManager_1.default.Instance.initRobotConfigs(configDataTemplate.robotConfigs);
                this.romCommands.initWithData(configDataTemplate.romCommands);
                RobotManager_1.default.Instance.initRobotGroups(configDataTemplate.robotGroups);
                RobotManager_1.default.Instance.activeGroupName = configDataTemplate.activeGroupName;
            }
            else {
                this.profiles = new Profiles_1.default(this.config.data);
                RobotManager_1.default.Instance.initRobotConfigs(this.config.data.robotConfigs);
                this.romCommands.initWithData(this.config.data.romCommands);
                RobotManager_1.default.Instance.initRobotGroups(this.config.data.robotGroups);
                RobotManager_1.default.Instance.activeGroupName = this.config.data.activeGroupName;
            }
            this.emit('updateModel', this);
        });
    }
    //// Robot
    connect(robotConfigId = '') {
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
    disconnect(robotConfigId = '') {
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
    say(text, robotConfigId = '') {
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
    command(text, robotConfigId = '') {
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
    start(skillName) {
        RobotManager_1.default.Instance.start(skillName);
    }
    status() {
        return RobotManager_1.default.Instance.status();
    }
    getAppVerison() {
        return AppVersion_1.appVersion;
    }
    dispose() {
        configDataTemplate = undefined;
        delete (this.config); // = null;
    }
}
exports.default = Model;
//# sourceMappingURL=Model.js.map