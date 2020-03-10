"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const robokit_rom_1 = require("robokit-rom");
const Profiles_1 = require("../model/Profiles");
const RobotConfigs_1 = require("../model/RobotConfigs");
const FacesEnsembleSkill_1 = require("../rom/FacesEnsembleSkill");
class RobotManager {
    constructor() {
        this._romCommands = new robokit_rom_1.RomCommands();
        this._profiles = new Profiles_1.default();
        this._robots = new robokit_rom_1.Robots();
        this._robotConfigs = new RobotConfigs_1.default();
        this._robotGroups = new robokit_rom_1.RobotGroups;
        this._activeGroupName = '';
    }
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    initProfiles(data) {
        this._profiles.initWithData(data);
    }
    initRobotConfigs(data) {
        this._robotConfigs.initWithData(data);
        // create Robot instances and robot groups for individual robots
        const configList = this._robotConfigs.configList;
        configList.forEach((config) => {
            if (config.id !== RobotConfigs_1.default.DEFAULT_ID) {
                const robot = new robokit_rom_1.Robot(config);
                this._robots.addRobot(robot);
                const group = new robokit_rom_1.RobotGroup(`@${config.id}`);
                group.addRobotName(config.id);
                this._robotGroups.addRobotGroup(group);
                this._activeGroupName = group.name;
            }
        });
    }
    initRomCommands(data) {
        this._romCommands.initWithData(data);
    }
    addRobotConfig(config) {
        this._robotConfigs.addRobotConfig(config);
    }
    get profiles() {
        return this._profiles;
    }
    get robots() {
        return this._robots;
    }
    get robotConfigs() {
        return this._robotConfigs;
    }
    get romCommands() {
        return this._romCommands;
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
    start(skillName) {
        // lookup skill [skillName]
        let skill = robokit_rom_1.EnsembleSkillManager.Instance.getEnsembleSkillWithId(skillName);
        if (skill) {
            robokit_rom_1.Logger.info([`RobotManager: start: ${skillName} already started.`]);
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
    connect(robotGroupName = '') {
        const groupName = robotGroupName || this._activeGroupName;
        if (groupName) {
            const group = this._robotGroups.getRobotGroupWithName(groupName);
            if (group && group.robotNames.length > 0) {
                const robots = this._robots.getRobotListWithNames(group.robotNames);
                const profile = this._profiles.getActiveProfile();
                if (robots && profile) {
                    robots.forEach((robot) => {
                        if (!robot.connected) {
                            robokit_rom_1.Logger.info([`RobotManager: connect: robot: ${robot.name}`]);
                            robot.autoReconnect = true;
                            robot.connect(profile);
                        }
                        else {
                            robokit_rom_1.Logger.info([`RobotManager: connect: already connected: ${robot.name}`]);
                        }
                    });
                }
            }
        }
    }
    disconnect(robotGroupName = '') {
        const groupName = robotGroupName || this._activeGroupName;
        if (groupName) {
            const group = this._robotGroups.getRobotGroupWithName(groupName);
            if (group && group.robotNames.length > 0) {
                const robots = this._robots.getRobotListWithNames(group.robotNames);
                if (robots) {
                    robots.forEach((robot) => {
                        robokit_rom_1.Logger.info([`RobotManager: disconnect: robot: ${robot.name}`]);
                        robot.autoReconnect = false;
                        robot.disconnect();
                    });
                }
            }
        }
    }
    sendRomCommand(command, robotGroupName = '') {
        const groupName = robotGroupName || this._activeGroupName;
        if (groupName) {
            const group = this._robotGroups.getRobotGroupWithName(groupName);
            if (group && group.robotNames.length > 0) {
                const robots = this._robots.getRobotListWithNames(group.robotNames);
                if (robots) {
                    robots.forEach((robot) => {
                        robokit_rom_1.Logger.info([`RobotManager: sendRomCommand: [${robot.name}] ${command.type}`]);
                        robot.sendCommand(command);
                    });
                }
            }
        }
    }
    say(text, robotGroupName = '') {
        if (text && text.length === 1) {
            this.command(text, robotGroupName);
        }
        else {
            const ttsCommand = new robokit_rom_1.RomCommand('say', 'tts', { text: text });
            this.sendRomCommand(ttsCommand, robotGroupName);
        }
    }
    command(text, robotGroupName = '') {
        if (text.length === 1) {
            const romCommand = this.romCommands.getCommandWithKeyCode(text);
            if (romCommand) {
                this.sendRomCommand(romCommand, robotGroupName);
            }
        }
        else {
            const romCommand = this.romCommands.getCommandWithName(text);
            if (romCommand) {
                this.sendRomCommand(romCommand, robotGroupName);
            }
        }
    }
    status(robotName) {
        let result = {
            robotStates: this._robots.robotStates,
            ensembleSkills: robokit_rom_1.EnsembleSkillManager.Instance.status(),
        };
        if (robotName) {
            const robot = this._robots.getRobotWithName(robotName);
            if (robot) {
                result = robot.status();
            }
        }
        return result;
    }
}
exports.default = RobotManager;
//# sourceMappingURL=RobotManager.js.map