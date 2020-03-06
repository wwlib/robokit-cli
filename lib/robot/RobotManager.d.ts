import { Robots, RomCommand, RobotGroups } from 'robokit-rom';
import Profile from '../model/Profile';
import RobotConfig from '../model/RobotConfig';
import RobotConfigs from '../model/RobotConfigs';
export default class RobotManager {
    private static _instance;
    private _robots;
    private _robotConfigs;
    private _robotGroups;
    private _activeGroupName;
    private constructor();
    static get Instance(): RobotManager;
    initRobotConfigs(data: any): void;
    get robots(): Robots;
    get robotConfigs(): RobotConfigs;
    get robotGroups(): RobotGroups;
    get activeGroupName(): string;
    set activeGroupName(name: string);
    get robotGroupNames(): string[];
    initRobotGroups(dataList: any[]): void;
    connectWithProfileAndRobotConfig(profile: Profile, robotConfig: RobotConfig): void;
    disconnectWithRobotConfig(robotConfig: RobotConfig): void;
    sayWithRobotConfigAndText(robotConfig: RobotConfig, text: string): void;
    commandWithRobotConfigAndRomCommand(robotConfig: RobotConfig, command: RomCommand): void;
    start(skillName: string): void;
    status(): {
        robotCount: number;
        robotNames: string[];
        ensembleSkills: any;
    };
}
