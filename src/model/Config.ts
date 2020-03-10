const path = require('path');
import { EventEmitter } from "events";
const fs = require('fs-extra');
const osenv = require('osenv');
const jsonfile = require('jsonfile');

export default class Config extends EventEmitter {

    private _configDir: string = path.resolve(osenv.home(), ".robokit-cli");
    private _configFile: string = path.resolve(this._configDir, "config.json");
    private _data: any;
    private _timestamp: number = 0;

    constructor() {
        super();
        this._data = {};    
    }

    get configDirectory(): string {
        return this._configDir;
    }

    get configFile(): string {
        return this._configFile;
    }

    get data(): any {
        return this._data;
    }

    set data(obj: any) {
        this._data = obj;
    }

    get timestamp(): number {
        return this._timestamp;
    }

    load(cb: any){
        fs.ensureDir(path.resolve(this._configDir), 0o755, (err: any) => {
            if (err) {
                console.log(`Config: error: ${this._configDir} cannot be found`)
            } else {
                jsonfile.readFile(this._configFile, (err: any, obj: any) => {
                    if (err) {
                        cb(err);
                    } else {
                        this._data = obj;
                        this._timestamp = this._data.timestamp;
                        cb(err, obj);
                    }
                });
            }
        });
    }

    save(cb: any){
        this._timestamp = new Date().getTime();
        this._data.timestamp = this._timestamp;
        fs.ensureDir(path.resolve(this._configDir), 0o755, (err: any) => {
            if (err) {
                console.log(`Config: error: ${this._configDir} cannot be found`)
            } else {
                jsonfile.writeFile(this._configFile, this._data, {spaces: 2}, (err: any) => {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null);
                    }
                });
            }
        });
    }
}