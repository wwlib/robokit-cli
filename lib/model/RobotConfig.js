"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RobotConfigProperties;
(function (RobotConfigProperties) {
    RobotConfigProperties["configId"] = "configId";
    RobotConfigProperties["type"] = "type";
    RobotConfigProperties["ip"] = "ip";
    RobotConfigProperties["serialName"] = "serialName";
    RobotConfigProperties["email"] = "email";
    RobotConfigProperties["password"] = "password";
})(RobotConfigProperties = exports.RobotConfigProperties || (exports.RobotConfigProperties = {}));
class RobotConfig {
    constructor(data) {
        if (data) {
            this.data = data;
        }
        else {
            this.data = {};
            RobotConfig.propertyKeys.forEach(propertyKey => {
                this.data[propertyKey] = '';
            });
        }
    }
    static get propertyKeys() {
        return Object.keys(RobotConfigProperties);
    }
    get id() {
        return this.data.configId;
    }
    set id(configId) {
        if (configId) {
            this.data.configId = configId;
        }
    }
    get name() {
        return this.data.configId;
    }
    get type() {
        return this.data.type;
    }
    get ip() {
        return this.data.ip;
    }
    get serialName() {
        return this.data.serialName;
    }
    get email() {
        return this.data.email;
    }
    get password() {
        return this.data.password;
    }
    // getProperty(key: string): string {
    //     return this.data[key];
    // }
    setProperty(key, value) {
        let isValidProperty = RobotConfig.propertyKeys.indexOf(key) != -1;
        if (key && value && isValidProperty) {
            this.data[key] = value;
        }
    }
    get json() {
        return this.data;
    }
}
exports.default = RobotConfig;
RobotConfig.ID_KEY = RobotConfigProperties.configId;
//# sourceMappingURL=RobotConfig.js.map