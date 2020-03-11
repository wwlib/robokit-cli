"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const robokit_rom_1 = require("robokit-rom");
class FacesEnsembleSkill extends robokit_rom_1.EnsembleSkill {
    constructor(id, launchIntent) {
        super(id, launchIntent);
        this._dataStreamEventHandler = this.onDataStreamEvent.bind(this);
        this._primaryHub = undefined;
        this.running = true;
    }
    addHub(hub) {
        super.addHub(hub);
        hub.on('dataStreamEvent', this._dataStreamEventHandler);
    }
    onDataStreamEvent(event) {
        if (event && event.type === 'faceGained') {
            robokit_rom_1.Logger.info([`FacesEnsembleSkill: onDataStreamEvent: ${event.robotId} -> ${event.type}`]);
            if (!this._primaryHub) {
                const hub = this.hubMap.get(event.robotId);
                if (hub) {
                    robokit_rom_1.Logger.info([`FacesEnsembleSkill: primary hub set to: ${event.robotId}`]);
                    this._primaryHub = hub;
                    setTimeout(() => {
                        this._primaryHub = undefined;
                        robokit_rom_1.Logger.info([`FacesEnsembleSkill: primary reset`]);
                        const attentionIdle = new robokit_rom_1.RomCommand('attention-off', 'attention', {
                            state: "IDLE",
                        });
                        this.hubs.forEach((hub) => {
                            hub.robot.updateRobotStatusMessages(`FacesEnsembleSkill: sending RomCommand: ${attentionIdle.type}`);
                            hub.robot.sendCommand(attentionIdle);
                        });
                    }, 10000); // wait 10 seconds to reset
                    const entities = event.data;
                    const entity = entities[0];
                    const worldCoords = entity.WorldCoords;
                    const command = new robokit_rom_1.RomCommand('lookAt', 'lookAt', {
                        vector: [
                            worldCoords[0],
                            worldCoords[1],
                            worldCoords[2]
                        ]
                    });
                    const attentionOff = new robokit_rom_1.RomCommand('attention-off', 'attention', {
                        state: "OFF",
                    });
                    this.hubs.forEach((hub) => {
                        hub.robot.updateRobotStatusMessages(`FacesEnsembleSkill: sending RomCommand: ${command.type}`);
                        hub.robot.sendCommand(command);
                        setImmediate(() => {
                            hub.robot.updateRobotStatusMessages(`FacesEnsembleSkill: sending RomCommand: ${attentionOff.type}`);
                            hub.robot.sendCommand(attentionOff);
                        });
                    });
                }
            }
        }
    }
    launch(data) {
    }
    tick(frameTime, elapsedTime) {
    }
    dispose() {
        const hubs = Array.from(this.hubMap.values());
        hubs.forEach((hub) => {
            hub.removeListener('dataStreamEvent', this._dataStreamEventHandler);
        });
    }
}
exports.default = FacesEnsembleSkill;
//# sourceMappingURL=FacesEnsembleSkill.js.map