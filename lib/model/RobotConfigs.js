"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RobotConfig_1 = require("./RobotConfig");
class RobotConfigs {
    constructor() {
        this._configMap = new Map();
    }
    initWithData(data) {
        if (data && Array.isArray(data)) {
            data.forEach((configData) => {
                const config = new RobotConfig_1.default(configData);
                this._configMap.set(configData.configId, config);
            });
        }
        else {
            console.log('RobotConfigs: initWithData: invalid data.');
        }
    }
    get configList() {
        return Array.from(this._configMap.values());
    }
    getRobotConfigWithId(id) {
        return this._configMap.get(id);
    }
    getDefaultRobotConfig() {
        return this._configMap.get(RobotConfigs.DEFAULT_ID);
    }
    getRobotConfigIds() {
        const configKeys = Array.from(this._configMap.keys()).sort();
        return configKeys;
    }
    setRobotConfigProperty(configId, key, value) {
        let config = this.getRobotConfigWithId(configId);
        if (config) {
            if (key === RobotConfig_1.default.ID_KEY && !this._configMap.get(value)) {
                let oldId = config.id;
                let newId = value;
                this._configMap.delete(oldId);
                config.setProperty(key, newId);
                this._configMap.set(newId, config);
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
                this._configMap.set(config.id, config);
            }
        }
    }
    addRobotConfig(config) {
        if (config && config.id) {
            this._configMap.set(config.id, config);
        }
    }
    newRobotConfig(configId) {
        let result = undefined;
        let config = new RobotConfig_1.default();
        if (configId && !this._configMap.get(configId)) {
            config.id = configId;
            this._configMap.set(config.id, config);
            result = config;
        }
        return result;
    }
    deleteRobotConfig(id) {
        if (id == RobotConfigs.DEFAULT_ID || !this.getRobotConfigWithId(id)) {
            // noop
        }
        else {
            this._configMap.delete(id);
        }
    }
    get json() {
        let result = [];
        const configKeys = Array.from(this._configMap.keys()).sort();
        configKeys.forEach(key => {
            const config = this._configMap.get(key);
            if (config) {
                result.push(config.json);
            }
        });
        return result;
    }
}
exports.default = RobotConfigs;
RobotConfigs.DEFAULT_ID = 'Default';
//# sourceMappingURL=RobotConfigs.js.map