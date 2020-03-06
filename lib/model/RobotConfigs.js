"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RobotConfig_1 = require("./RobotConfig");
class RobotConfigs {
    constructor() {
        this.configMap = {};
    }
    initWithData(data) {
        if (data && Array.isArray(data)) {
            data.forEach((configData) => {
                this.configMap[configData.configId] = new RobotConfig_1.default(configData);
            });
        }
        else {
            console.log('RobotConfigs: initWithData: invalid data.');
        }
    }
    getRobotConfigWithId(id) {
        return this.configMap[id];
    }
    getDefaultRobotConfig() {
        return this.configMap[RobotConfigs.DEFAULT_ID];
    }
    getRobotConfigIds() {
        const configKeys = Object.keys(this.configMap).sort();
        return configKeys;
    }
    setRobotConfigProperty(configId, key, value) {
        let config = this.getRobotConfigWithId(configId);
        if (config) {
            if (key === RobotConfig_1.default.ID_KEY && !this.configMap[value]) {
                let oldId = config.id;
                let newId = value;
                delete (this.configMap[oldId]);
                config.setProperty(key, newId);
                this.configMap[newId] = config;
            }
            else {
                config.setProperty(key, value);
            }
        }
    }
    addRobotConfigWithData(data) {
        if (data) {
            let config = new RobotConfig_1.default(data);
            if (config.id) {
                this.configMap[config.id] = config;
            }
        }
    }
    addRobotConfig(config) {
        if (config && config.id) {
            this.configMap[config.id] = config;
        }
    }
    newRobotConfig(configId) {
        let result = undefined;
        let config = new RobotConfig_1.default();
        if (configId && !this.configMap[configId]) {
            config.id = configId;
            this.configMap[config.id] = config;
            result = config;
        }
        return result;
    }
    deleteRobotConfig(id) {
        if (id == RobotConfigs.DEFAULT_ID || !this.getRobotConfigWithId(id)) {
            // noop
        }
        else {
            delete this.configMap[id];
        }
    }
    get json() {
        let result = [];
        const configKeys = Object.keys(this.configMap).sort();
        configKeys.forEach(key => {
            result.push(this.configMap[key].json);
        });
        return result;
    }
}
exports.default = RobotConfigs;
RobotConfigs.DEFAULT_ID = 'Default';
//# sourceMappingURL=RobotConfigs.js.map