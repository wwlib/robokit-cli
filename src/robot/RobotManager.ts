import { Robot, Robots, RomCommand, EnsembleSkill, EnsembleSkillManager } from 'robokit-rom';
import Profile from '../model/Profile';
import RobotConfig from '../model/RobotConfig';
import FacesEnsembleSkill from '../rom/FacesEnsembleSkill';

export default class RobotManager {

    private static _instance: RobotManager;

    private _robots: Robots;

    private constructor() {
        this._robots = new Robots();
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    get robots(): Robots {
        return this._robots;
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