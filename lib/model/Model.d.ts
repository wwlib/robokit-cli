/// <reference types="node" />
import { EventEmitter } from "events";
import Config from "./Config";
import Profiles from './Profiles';
import Profile from './Profile';
import RobotConfig from "./RobotConfig";
import RobotConfigs from "./RobotConfigs";
import { RomCommands } from 'robokit-rom';
export default class Model extends EventEmitter {
    config: Config;
    profiles: Profiles;
    robotConfigs: RobotConfigs;
    romCommands: RomCommands;
    constructor();
    initWithData(data: any): void;
    getActiveProfile(): Profile;
    getActiveRobotConfig(): RobotConfig;
    get json(): any;
    saveConfig(): void;
    reloadConfig(): void;
    connect(robotConfigId?: string): void;
    disconnect(robotConfigId?: string): void;
    say(text: string, robotConfigId?: string): void;
    command(text: string, robotConfigId?: string): void;
    debug(): void;
    getAppVerison(): string;
    dispose(): void;
}
