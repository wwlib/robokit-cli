import {
    Robot,
    Robots,
    RomCommand,
    EnsembleSkill,
    EnsembleSkillManager,
    RobotGroup,
    RobotGroups
} from 'robokit-rom';
import Profile from '../model/Profile';
import RobotConfig from '../model/RobotConfig';
import RobotConfigs from '../model/RobotConfigs'
import FacesEnsembleSkill from '../rom/FacesEnsembleSkill';

export default class RobotManager {

    private static _instance: RobotManager;

    private _robots: Robots;
    private _robotConfigs: RobotConfigs;

    private _robotGroups: RobotGroups;
    private _activeGroupName: string;

    private constructor() {
        this._robots = new Robots();
        this._robotConfigs = new RobotConfigs();
        this._robotGroups = new RobotGroups;
        this._activeGroupName = '';
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    initRobotConfigs(data: any) {
        this._robotConfigs.initWithData(data);

        // create robot groups
        const configIds: string[]  = this._robotConfigs.getRobotConfigIds();
        configIds.forEach((id: string) => {
            const group: RobotGroup = new RobotGroup(`@${id}`);
            group.addRobotName(id);
            this._robotGroups.addRobotGroup(group);
            this._activeGroupName = group.name;
        });
    }

    get robots(): Robots {
        return this._robots;
    }

    get robotConfigs(): RobotConfigs {
        return this._robotConfigs;
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

    connectWithProfileAndRobotConfig(profile: Profile, robotConfig: RobotConfig) {
        const robot = new Robot(robotConfig);
        robot.connect(profile);

        this._robots.addRobot(robot);
    }

    disconnectWithRobotConfig(robotConfig: RobotConfig) {
        const robot = this._robots.getRobotWithName(robotConfig.name);
        if (robot) {
            this._robots.disconnectRobot(robot);
        }
    }

    sayWithRobotConfigAndText(robotConfig: RobotConfig, text: string) {
        const robot = this._robots.getRobotWithName(robotConfig.name);
        if (robot) {
            const command: RomCommand = new RomCommand('say', 'tts', { text: text });
            robot.sendCommand(command);
        } else {
            console.log(`sayWithRobotConfigAndText: robot not found: ${robotConfig.name}`);
        }
    }

    commandWithRobotConfigAndRomCommand(robotConfig: RobotConfig, command: RomCommand) {
        const robot = this._robots.getRobotWithName(robotConfig.name);
        if (robot) {
            robot.sendCommand(command);
        } else {
            console.log(`commandWithRobotConfigAndRomCommand: robot not found: ${robotConfig.name}`);
        }
    }

    start(skillName: string) {
        // lookup skill [skillName]
        let skill: EnsembleSkill | undefined = EnsembleSkillManager.Instance.getEnsembleSkillWithId(skillName);
        if (skill) {
            console.log(`${skillName} already started.`);
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


    status() {
        return {
            robotCount: this._robots.robotCount,
            robotNames: this._robots.robotNames,
            ensembleSkills: EnsembleSkillManager.Instance.status(),
        }
    }

}