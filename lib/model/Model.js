"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const Config_1 = require("./Config");
const AppVersion_1 = require("./AppVersion");
const Profiles_1 = require("./Profiles");
const RobotConfigs_1 = require("./RobotConfigs");
let configDataTemplate = require('../../data/config-template.json');
class Model extends events_1.EventEmitter {
    constructor() {
        super();
        this.profiles = new Profiles_1.default(configDataTemplate);
        this.robotConfigs = new RobotConfigs_1.default(configDataTemplate);
        this.config = new Config_1.default();
        this.config.load((err, obj) => {
            if (err || !this.config.data) {
                console.log(`Model: Config not found. Using template.`);
                // this.config.data = configDataTemplate;
                // this.initWithData(this.config.data);
                // this.saveConfig();
                this.profiles = new Profiles_1.default(configDataTemplate);
                this.robotConfigs = new RobotConfigs_1.default(configDataTemplate);
            }
            else {
                // this.initWithData(this.config.data);
                this.profiles = new Profiles_1.default(this.config.data);
                this.robotConfigs = new RobotConfigs_1.default(this.config.data);
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
        this.config.data = Object.assign(Object.assign({}, this.profiles.json), this.robotConfigs.json);
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