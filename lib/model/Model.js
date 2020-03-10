"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const events_1 = require("events");
const Config_1 = require("./Config");
const AppVersion_1 = require("./AppVersion");
const RobotManager_1 = require("../robot/RobotManager");
const robokit_rom_1 = require("robokit-rom");
let configDataTemplate = require('../../data/config-template.json');
class Model extends events_1.EventEmitter {
    constructor() {
        super();
        this.config = new Config_1.default();
        const loggerDirectory = path.resolve(this.config.configDirectory, 'logs');
        robokit_rom_1.Logger.setLogDirectory(loggerDirectory);
        this.config.load((err, obj) => {
            if (err || !this.config.data) {
                robokit_rom_1.Logger.info([`Model: Config not found. Using template.`]);
                RobotManager_1.default.Instance.initProfiles(configDataTemplate);
                RobotManager_1.default.Instance.initRobotConfigs(configDataTemplate.robotConfigs);
                RobotManager_1.default.Instance.initRomCommands(configDataTemplate.romCommands);
                RobotManager_1.default.Instance.initRobotGroups(configDataTemplate.robotGroups);
                RobotManager_1.default.Instance.activeGroupName = configDataTemplate.activeGroupName;
            }
            else {
                RobotManager_1.default.Instance.initProfiles(this.config.data);
                RobotManager_1.default.Instance.initRobotConfigs(this.config.data.robotConfigs);
                RobotManager_1.default.Instance.initRomCommands(this.config.data.romCommands);
                RobotManager_1.default.Instance.initRobotGroups(this.config.data.robotGroups);
                RobotManager_1.default.Instance.activeGroupName = this.config.data.activeGroupName;
            }
            this.emit('ready', this);
        });
    }
    initWithData(data) {
    }
    get json() {
        let result = {};
        return result;
    }
    saveConfig() {
        this.config.data = Object.assign(Object.assign({}, RobotManager_1.default.Instance.profiles.json), { robotConfigs: RobotManager_1.default.Instance.robotConfigs.json, robotGroups: RobotManager_1.default.Instance.robotGroups.json, activeGroupName: RobotManager_1.default.Instance.activeGroupName, romCommands: RobotManager_1.default.Instance.romCommands.json });
        this.config.save((err) => {
            if (err) {
                robokit_rom_1.Logger.error([`Model: Error saving config: `, err]);
            }
        });
    }
    reloadConfig() {
        this.config.load((err, obj) => {
            if (err || !this.config.data) {
                robokit_rom_1.Logger.info([`Model: Config not found. Using template.`]);
                RobotManager_1.default.Instance.initProfiles(configDataTemplate);
                RobotManager_1.default.Instance.initRobotConfigs(configDataTemplate.robotConfigs);
                RobotManager_1.default.Instance.initRomCommands(configDataTemplate.romCommands);
                RobotManager_1.default.Instance.initRobotGroups(configDataTemplate.robotGroups);
                RobotManager_1.default.Instance.activeGroupName = configDataTemplate.activeGroupName;
            }
            else {
                RobotManager_1.default.Instance.initProfiles(this.config.data);
                RobotManager_1.default.Instance.initRobotConfigs(this.config.data.robotConfigs);
                RobotManager_1.default.Instance.initRomCommands(this.config.data.romCommands);
                RobotManager_1.default.Instance.initRobotGroups(this.config.data.robotGroups);
                RobotManager_1.default.Instance.activeGroupName = this.config.data.activeGroupName;
            }
            this.emit('updateModel', this);
        });
    }
    start(skillName) {
        RobotManager_1.default.Instance.start(skillName);
    }
    status(robotName) {
        return RobotManager_1.default.Instance.status(robotName);
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