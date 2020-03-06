"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const Config_1 = require("./Config");
const AppVersion_1 = require("./AppVersion");
const Profiles_1 = require("./Profiles");
const RobotConfigs_1 = require("./RobotConfigs");
const robokit_rom_1 = require("robokit-rom");
const RobotManager_1 = require("../robot/RobotManager");
let configDataTemplate = require('../../data/config-template.json');
class Model extends events_1.EventEmitter {
    constructor() {
        super();
        this.profiles = new Profiles_1.default(configDataTemplate);
        this.robotConfigs = new RobotConfigs_1.default(configDataTemplate);
        this.romCommands = new robokit_rom_1.RomCommands();
        this.config = new Config_1.default();
        this.config.load((err, obj) => {
            if (err || !this.config.data) {
                console.log(`Model: Config not found. Using template.`);
                // this.config.data = configDataTemplate;
                // this.initWithData(this.config.data);
                // this.saveConfig();
                this.profiles = new Profiles_1.default(configDataTemplate);
                this.robotConfigs = new RobotConfigs_1.default(configDataTemplate);
                this.romCommands.initWithData(configDataTemplate.romCommands);
            }
            else {
                // this.initWithData(this.config.data);
                this.profiles = new Profiles_1.default(this.config.data);
                this.robotConfigs = new RobotConfigs_1.default(this.config.data);
                this.romCommands.initWithData(this.config.data.romCommands);
            }
            this.emit('ready', this);
        });
    }
    initWithData(data) {
    }
    getActiveProfile() {
        return this.profiles.getActiveProfile();
    }
    getActiveRobotConfig() {
        return this.robotConfigs.getActiveRobotConfig();
    }
    get json() {
        let result = {};
        return result;
    }
    saveConfig() {
        // console.log(`saveConfig: `, this.profiles.json);
        this.config.data = Object.assign(Object.assign(Object.assign({}, this.profiles.json), this.robotConfigs.json), { romCommands: this.romCommands.json });
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
                // this.config.data = configDataTemplate;
                // this.initWithData(this.config.data);
                this.profiles = new Profiles_1.default(configDataTemplate);
                this.robotConfigs = new RobotConfigs_1.default(configDataTemplate);
            }
            else {
                // this.initWithData(this.config.data);
                this.profiles = new Profiles_1.default(this.config.data);
                this.robotConfigs = new RobotConfigs_1.default(this.config.data);
            }
            this.emit('updateModel', this);
        });
    }
    //// Robot
    connect(robotConfigId = '') {
        let config = this.robotConfigs.getActiveRobotConfig();
        if (robotConfigId) {
            config = this.robotConfigs.getRobotConfigWithId(robotConfigId);
        }
        const profile = this.profiles.getActiveProfile();
        if (config && profile) {
            RobotManager_1.default.Instance.connectWithProfileAndRobotConfig(profile, config);
        }
        else {
            console.log(`Model: connect: invalid profile and/or robot config`);
        }
    }
    disconnect(robotConfigId = '') {
        let config = this.robotConfigs.getActiveRobotConfig();
        if (robotConfigId) {
            config = this.robotConfigs.getRobotConfigWithId(robotConfigId);
        }
        if (config) {
            RobotManager_1.default.Instance.disconnectWithRobotConfig(config);
        }
        else {
            console.log(`Model: disconnect: invalid robot config`);
        }
    }
    say(text, robotConfigId = '') {
        if (text.length === 1) {
            this.command(text, robotConfigId);
        }
        else {
            let config = this.robotConfigs.getActiveRobotConfig();
            if (robotConfigId) {
                config = this.robotConfigs.getRobotConfigWithId(robotConfigId);
            }
            if (config) {
                RobotManager_1.default.Instance.sayWithRobotConfigAndText(config, text);
            }
            else {
                console.log(`Model: say: invalid robot config`);
            }
        }
    }
    command(text, robotConfigId = '') {
        let config = this.robotConfigs.getActiveRobotConfig();
        if (robotConfigId) {
            config = this.robotConfigs.getRobotConfigWithId(robotConfigId);
        }
        if (config) {
            if (text.length === 1) {
                const romCommand = this.romCommands.getCommandWithKeyCode(text);
                if (romCommand) {
                    RobotManager_1.default.Instance.commandWithRobotConfigAndRomCommand(config, romCommand);
                }
            }
            else {
                const romCommand = this.romCommands.getCommandWithName(text);
                if (romCommand) {
                    RobotManager_1.default.Instance.commandWithRobotConfigAndRomCommand(config, romCommand);
                }
            }
        }
        else {
            console.log(`Model: say: invalid robot config`);
        }
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