/// <reference types="node" />
import { EventEmitter } from "events";
import Config from "./Config";
import Profiles from './Profiles';
import Profile from './Profile';
import RobotConfig from "./RobotConfig";
import RobotConfigs from "./RobotConfigs";
export default class Model extends EventEmitter {
    config: Config;
    profiles: Profiles;
    robotConfigs: RobotConfigs;
    constructor();
    initWithData(data: any): void;
    getActiveProfile(): Profile;
    getActiveRobotConfig(): RobotConfig;
    get json(): any;
    saveConfig(): void;
    reloadConfig(): void;
    getAppVerison(): string;
    dispose(): void;
}
