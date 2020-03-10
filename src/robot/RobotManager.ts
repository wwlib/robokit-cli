import {
    Logger,
    Robot,
    Robots,
    RomCommand,
    RomCommands,
    EnsembleSkill,
    EnsembleSkillManager,
    RobotGroup,
    RobotGroups
} from 'robokit-rom';
import Profile from '../model/Profile';
import Profiles from '../model/Profiles';
import RobotConfig from '../model/RobotConfig';
import RobotConfigs from '../model/RobotConfigs'
import FacesEnsembleSkill from '../rom/FacesEnsembleSkill';

export default class RobotManager {

    private static _instance: RobotManager;

    private _profiles: Profiles;
    private _robots: Robots;
    private _robotConfigs: RobotConfigs;
    private _romCommands: RomCommands = new RomCommands();

    private _robotGroups: RobotGroups;
    private _activeGroupName: string;

    private constructor() {
        this._profiles = new Profiles();
        this._robots = new Robots();
        this._robotConfigs = new RobotConfigs();
        this._robotGroups = new RobotGroups;
        this._activeGroupName = '';
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    initProfiles(data: any) {
        this._profiles.initWithData(data);
    }

    initRobotConfigs(data: any) {
        this._robotConfigs.initWithData(data);

        // create Robot instances and robot groups for individual robots
        const configList: RobotConfig[] = this._robotConfigs.configList;
        configList.forEach((config: RobotConfig) => {
            if (config.id !== RobotConfigs.DEFAULT_ID) {
                const robot: Robot = new Robot(config);
                this._robots.addRobot(robot);
                const group: RobotGroup = new RobotGroup(`@${config.id}`);
                group.addRobotName(config.id);
                this._robotGroups.addRobotGroup(group);
                this._activeGroupName = group.name;
            }
        });
    }

    initRomCommands(data: any[]) {
        this._romCommands.initWithData(data);
    }

    addRobotConfig(config: RobotConfig) {
        this._robotConfigs.addRobotConfig(config);
    }

    get profiles(): Profiles {
        return this._profiles;
    }

    get robots(): Robots {
        return this._robots;
    }

    get robotConfigs(): RobotConfigs {
        return this._robotConfigs;
    }

    get romCommands(): RomCommands {
        return this._romCommands;
    }

    get robotGroups(): RobotGroups {
        return this._robotGroups;
    }

    get activeGroupName(): string {
        return this._activeGroupName;
    }

    set activeGroupName(name: string) {
        const group: RobotGroup | undefined = this._robotGroups.getRobotGroupWithName(name);
        if (group) {
            this._activeGroupName = group.name;
        }
    }

    get robotGroupNames(): string[] {
        return this._robotGroups.robotGroupNames;
    }

    initRobotGroups(dataList: any[]) {
        this._robotGroups.initWithData(dataList);
    }

    start(skillName: string) {
        // lookup skill [skillName]
        let skill: EnsembleSkill | undefined = EnsembleSkillManager.Instance.getEnsembleSkillWithId(skillName);
        if (skill) {
            Logger.info([`RobotManager: start: ${skillName} already started.`]);
        } else {
            switch (skillName) {
                case 'faces':
                    skill = new FacesEnsembleSkill('faces', '');
                    EnsembleSkillManager.Instance.addEnsembleSkill(skill);
                    this._robots.robotList.forEach((robot: Robot) => {
                        if (skill) {
                            skill.addHub(robot.hub);
                        }
                    });
                    break;
                default:
                    break;
            }
        }

    }

    connect(robotGroupName: string = '') {
        const groupName: string = robotGroupName || this._activeGroupName;
        if (groupName) {
            const group: RobotGroup | undefined = this._robotGroups.getRobotGroupWithName(groupName);
            if (group && group.robotNames.length > 0) {
                const robots: Robot[] | undefined = this._robots.getRobotListWithNames(group.robotNames);
                const profile: Profile | undefined = this._profiles.getActiveProfile();
                if (robots && profile) {
                    robots.forEach((robot: Robot) => {
                        if (!robot.connected) {
                            Logger.info([`RobotManager: connect: robot: ${robot.name}`]);
                            robot.autoReconnect = true;
                            robot.connect(profile);
                        } else {
                            Logger.info([`RobotManager: connect: already connected: ${robot.name}`]);
                        }
                    });
                }
            }
        }
    }

    disconnect(robotGroupName: string = '') {
        const groupName: string = robotGroupName || this._activeGroupName;
        if (groupName) {
            const group: RobotGroup | undefined = this._robotGroups.getRobotGroupWithName(groupName);
            if (group && group.robotNames.length > 0) {
                const robots: Robot[] | undefined = this._robots.getRobotListWithNames(group.robotNames);
                if (robots) {
                    robots.forEach((robot: Robot) => {
                        Logger.info([`RobotManager: disconnect: robot: ${robot.name}`]);
                        robot.autoReconnect = false;
                        robot.disconnect();
                    });
                }
            }
        }
    }

    sendRomCommand(command: RomCommand, robotGroupName: string = '') {
        const groupName: string = robotGroupName || this._activeGroupName;
        if (groupName) {
            const group: RobotGroup | undefined = this._robotGroups.getRobotGroupWithName(groupName);
            if (group && group.robotNames.length > 0) {
                const robots: Robot[] | undefined = this._robots.getRobotListWithNames(group.robotNames);
                if (robots) {
                    robots.forEach((robot: Robot) => {
                        Logger.info([`RobotManager: sendRomCommand: [${robot.name}] ${command.type}`]);
                        robot.sendCommand(command);
                    });
                }
            }
        }
    }

    say(text: string, robotGroupName: string = '') {
        if (text && text.length === 1) {
            this.command(text, robotGroupName)
        } else {
            const ttsCommand: RomCommand = new RomCommand('say', 'tts', { text: text });
            this.sendRomCommand(ttsCommand, robotGroupName);
        }
    }

    command(text: string, robotGroupName: string = '') {
        if (text.length === 1) {
            const romCommand: RomCommand | undefined = this.romCommands.getCommandWithKeyCode(text);
            if (romCommand) {
                this.sendRomCommand(romCommand, robotGroupName);
            }
        } else {
            const romCommand: RomCommand | undefined = this.romCommands.getCommandWithName(text);
            if (romCommand) {
                this.sendRomCommand(romCommand, robotGroupName);
            }
        }
    }

    status(robotName?: string) {
        let result: any = {
            robotStates: this._robots.robotStates,
            ensembleSkills: EnsembleSkillManager.Instance.status(),
        }
        if (robotName) {
            const robot: Robot | undefined = this._robots.getRobotWithName(robotName);
            if (robot) {
                result = robot.status()
            }
        }
        return result
    }

}