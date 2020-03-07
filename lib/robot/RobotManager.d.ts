import { Robots, RomCommand, RomCommands, RobotGroups } from 'robokit-rom';
import Profiles from '../model/Profiles';
import RobotConfig from '../model/RobotConfig';
import RobotConfigs from '../model/RobotConfigs';
export default class RobotManager {
    private static _instance;
    private _profiles;
    private _robots;
    private _robotConfigs;
    private _romCommands;
    private _robotGroups;
    private _activeGroupName;
    private constructor();
    static get Instance(): RobotManager;
    initProfiles(data: any): void;
    initRobotConfigs(data: any): void;
    initRomCommands(data: any[]): void;
    addRobotConfig(config: RobotConfig): void;
    get profiles(): Profiles;
    get robots(): Robots;
    get robotConfigs(): RobotConfigs;
    get romCommands(): RomCommands;
    get robotGroups(): RobotGroups;
    get activeGroupName(): string;
    set activeGroupName(name: string);
    get robotGroupNames(): string[];
    initRobotGroups(dataList: any[]): void;
    start(skillName: string): void;
    connect(robotGroupName?: string): void;
    disconnect(robotGroupName?: string): void;
    sendRomCommand(command: RomCommand, robotGroupName?: string): void;
    say(text: string, robotGroupName?: string): void;
    command(text: string, robotGroupName?: string): void;
    status(): {
        robotCount: number;
        robotNames: string[];
        ensembleSkills: any;
    };
}
