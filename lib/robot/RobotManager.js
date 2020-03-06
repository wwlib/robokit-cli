"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const robokit_rom_1 = require("robokit-rom");
const RobotConfigs_1 = require("../model/RobotConfigs");
const FacesEnsembleSkill_1 = require("../rom/FacesEnsembleSkill");
class RobotManager {
    constructor() {
        this._robots = new robokit_rom_1.Robots();
        this._robotConfigs = new RobotConfigs_1.default();
        this._robotGroups = new robokit_rom_1.RobotGroups;
        this._activeGroupName = '';
    }
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    initRobotConfigs(data) {
        this._robotConfigs.initWithData(data);
        // create robot groups
        const configIds = this._robotConfigs.getRobotConfigIds();
        configIds.forEach((id) => {
            const group = new robokit_rom_1.RobotGroup(`@${id}`);
            group.addRobotName(id);
            this._robotGroups.addRobotGroup(group);
            this._activeGroupName = group.name;
        });
    }
    get robots() {
        return this._robots;
    }
    get robotConfigs() {
        return this._robotConfigs;
    }
    get robotGroups() {
        return this._robotGroups;
    }
    get activeGroupName() {
        return this._activeGroupName;
    }
    set activeGroupName(name) {
        const group = this._robotGroups.getRobotGroupWithName(name);
        if (group) {
            this._activeGroupName = group.name;
        }
    }
    get robotGroupNames() {
        return this._robotGroups.robotGroupNames;
    }
    initRobotGroups(dataList) {
        this._robotGroups.initWithData(dataList);
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