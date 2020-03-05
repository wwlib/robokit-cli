"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const robokit_rom_1 = require("robokit-rom");
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
    debug() {
        console.log(`robot count: ${this._robots.robotCount}`);
        console.log(`robot names: ${this._robots.robotNames}`);
    }
}
exports.default = RobotManager;
//# sourceMappingURL=RobotManager.js.map