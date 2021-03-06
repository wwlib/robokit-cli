/// <reference types="node" />
import { EventEmitter } from "events";
export default class Config extends EventEmitter {
    private _configDir;
    private _configFile;
    private _data;
    private _timestamp;
    constructor();
    get configDirectory(): string;
    get configFile(): string;
    get data(): any;
    set data(obj: any);
    get timestamp(): number;
    load(cb: any): void;
    save(cb: any): void;
}
