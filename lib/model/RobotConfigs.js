"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RobotConfig_1 = require("./RobotConfig");
class RobotConfigs {
    constructor(data) {
        this.configMap = {};
        this.activeRobotConfigID = data.activeRobotConfigID;
        data.robotConfigs.forEach((configData) => {
            this.configMap[configData.configId] = new RobotConfig_1.default(configData);
        });
    }
    getRobotConfigWithId(id) {
        return this.configMap[id];
    }
    getActiveRobotConfig() {
        return this.configMap[this.activeRobotConfigID];
    }
    getDefaultRobotConfig() {
        this.activeRobotConfigID = RobotConfigs.DEFAULT_ID;
        return this.configMap[RobotConfigs.DEFAULT_ID];
    }
    getRobotConfigIds() {
        const configKeys = Object.keys(this.configMap).sort();
        return configKeys;
    }
    setActiveRobotConfig(id) {
        if (this.configMap[id]) {
            this.activeRobotConfigID = id;
        }
        return this.getActiveRobotConfig();
    }
    setRobotConfigProperty(key, value) {
        let config = this.getActiveRobotConfig();
        if (config) {
            if (key === RobotConfig_1.default.ID_KEY && !this.configMap[value]) {
                let oldId = config.id;
                let newId = value;
                delete (this.configMap[oldId]);
                config.setProperty(key, newId);
                this.configMap[newId] = config;
                this.activeRobotConfigID = newId;
            }
            else {
                config.setProperty(key, value);
            }
        }
    }
    addRobotConfig(data) {
        let result = this.getActiveRobotConfig();
        let config = new RobotConfig_1.default(data);
        if (config.id) {
            this.configMap[config.id] = config;
            result = this.setActiveRobotConfig(config.id);
        }
        return result;
    }
    newRobotConfig(configId, makeActiveRobotConfig = true) {
        let result = undefined;
        let config = new RobotConfig_1.default();
        if (configId && !this.configMap[configId]) {
            config.id = configId;
            this.configMap[config.id] = config;
            result = config;
            if (makeActiveRobotConfig) {
                this.setActiveRobotConfig(config.id);
            }
        }
        return result;
    }
    deleteRobotConfig(id) {
        let result = this.getActiveRobotConfig();
        if (id == RobotConfigs.DEFAULT_ID || !this.getRobotConfigWithId(id)) {
            // noop
        }
        else {
            delete this.configMap[id];
            if (id === this.activeRobotConfigID) {
                this.activeRobotConfigID = '';
                const configKeys = Object.keys(this.configMap).sort();
                configKeys.forEach(key => {
                    if (this.configMap[key] && !this.activeRobotConfigID) {
                        this.activeRobotConfigID = key;
                        result = this.setActiveRobotConfig(this.activeRobotConfigID);
                    }
                });
                if (!result) {
                    result = this.getDefaultRobotConfig();
                }
            }
        }
        return result;
    }
    get json() {
        let result = {};
        result.activeRobotConfigID = this.activeRobotConfigID;
        result.robotConfigs = [];
        const configKeys = Object.keys(this.configMap).sort();
        configKeys.forEach(key => {
            result.robotConfigs.push(this.configMap[key].json);
        });
        return result;
    }
}
exports.default = RobotConfigs;
RobotConfigs.DEFAULT_ID = 'Default';
//# sourceMappingURL=RobotConfigs.js.map