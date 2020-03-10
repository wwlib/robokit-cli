/// <reference types="node" />
import { EventEmitter } from "events";
import Config from "./Config";
export default class Model extends EventEmitter {
    config: Config;
    constructor();
    initWithData(data: any): void;
    get json(): any;
    saveConfig(): void;
    reloadConfig(): void;
    start(skillName: string): void;
    status(robotName?: string): any;
    getAppVerison(): string;
    dispose(): void;
}
