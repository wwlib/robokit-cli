import { Robots, RomCommand } from 'robokit-rom';
import Profile from '../model/Profile';
import RobotConfig from '../model/RobotConfig';
export default class RobotManager {
    private static _instance;
    private _robots;
    private constructor();
    static get Instance(): RobotManager;
    get robots(): Robots;
    connectWithProfileAndRobotConfig(profile: Profile, robotConfig: RobotConfig): void;
    disconnectWithRobotConfig(robotConfig: RobotConfig): void;
    sayWithRobotConfigAndText(robotConfig: RobotConfig, text: string): void;
    commandWithRobotConfigAndRomCommand(robotConfig: RobotConfig, command: RomCommand): void;
    debug(): void;
}
