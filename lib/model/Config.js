"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const events_1 = require("events");
const fs = require('fs-extra');
const osenv = require('osenv');
const jsonfile = require('jsonfile');
let configPath = path.resolve(osenv.home(), ".robokit-cli");
let configFile = path.resolve(configPath, "config.json");
class Config extends events_1.EventEmitter {
    constructor() {
        super();
        this._timestamp = 0;
        this._data = {};
    }
    get configFile() {
        return configFile;
    }
    get data() {
        return this._data;
    }
    set data(obj) {
        this._data = obj;
    }
    get timestamp() {
        return this._timestamp;
    }
    load(cb) {
        fs.ensureDir(path.resolve(configPath), 0o755, (err) => {
            if (err) {
                console.log(`error: ${configPath} cannot be found`);
            }
            else {
                jsonfile.readFile(configFile, (err, obj) => {
                    if (err) {
                        cb(err);
                    }
                    else {
                        this._data = obj;
                        this._timestamp = this._data.timestamp;
                        cb(err, obj);
                    }
                });
            }
        });
    }
    save(cb) {
        this._timestamp = new Date().getTime();
        this._data.timestamp = this._timestamp;
        fs.ensureDir(path.resolve(configPath), 0o755, (err) => {
            if (err) {
                console.log(`error: ${configPath} cannot be found`);
            }
            else {
                jsonfile.writeFile(configFile, this._data, { spaces: 2 }, (err) => {
                    if (err) {
                        cb(err);
                    }
                    else {
                        cb(null);
                    }
                });
            }
        });
    }
}
exports.default = Config;
//# sourceMappingURL=Config.js.map