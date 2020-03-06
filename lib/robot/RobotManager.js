"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const robokit_rom_1 = require("robokit-rom");
const FacesEnsembleSkill_1 = require("../rom/FacesEnsembleSkill");
class RobotManager {
    constructor() {
        this._robots = new robokit_rom_1.Robots();
    }
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    get robots() {
        return this._robots;
    }
    connectWithProfileAndRobotConfig(profile, robotConfig) {
        const robot = new robokit_rom_1.Robot(robotConfig);
        robot.connect(profile);
        this._robots.addRobot(robot);
    }
    disconnectWithRobotConfig(robotConfig) {
        const robot = this._robots.getRobotWithName(robotConfig.name);
        if (robot) {
            this._robots.disconnectRobot(robot);
        }
    }
    sayWithRobotConfigAndText(robotConfig, text) {
        const robot = this._robots.getRobotWithName(robotConfig.name);
        if (robot) {
            const command = new robokit_rom_1.RomCommand('say', 'tts', { text: text });
            robot.sendCommand(command);
        }
        else {
            console.log(`sayWithRobotConfigAndText: robot not found: ${robotConfig.name}`);
        }
    }
    commandWithRobotConfigAndRomCommand(robotConfig, command) {
        const robot = this._robots.getRobotWithName(robotConfig.name);
        if (robot) {
            robot.sendCommand(command);
        }
        else {
            console.log(`commandWithRobotConfigAndRomCommand: robot not found: ${robotConfig.name}`);
        }
    }
    start(skillName) {
        // lookup skill [skillName]
        let skill = robokit_rom_1.EnsembleSkillManager.Instance.getEnsembleSkillWithId(skillName);
        if (skill) {
            console.log(`${skillName} already started.`);
        }
        else {
            switch (skillName) {
                case 'faces':
                    skill = new FacesEnsembleSkill_1.default('faces', '');
                    robokit_rom_1.EnsembleSkillManager.Instance.addEnsembleSkill(skill);
                    this._robots.robotList.forEach((robot) => {
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
            ensembleSkills: robokit_rom_1.EnsembleSkillManager.Instance.status(),
        };
    }
}
exports.default = RobotManager;
//# sourceMappingURL=RobotManager.js.map