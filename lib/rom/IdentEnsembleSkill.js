"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const robokit_rom_1 = require("robokit-rom");
class IdentEnsembleSkill extends robokit_rom_1.EnsembleSkill {
    constructor(id, launchIntent) {
        super(id, launchIntent);
        this._dataStreamEventHandler = this.onDataStreamEvent.bind(this);
        this.running = false;
    }
    addHub(hub) {
        super.addHub(hub);
        hub.on('dataStreamEvent', this._dataStreamEventHandler);
    }
    onDataStreamEvent(event) {
        if (event && event.type === 'faceGained') {
            console.log(`${this.id}: onDataStreamEvent: ${event.robotId} -> ${event.type}`);
            console.log(JSON.stringify(event, null, 2));
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
            const command2 = new robokit_rom_1.RomCommand('emoji', 'tts', {
                text: "<anim name='emoji-clock-hf-01' nonBlocking='true'/>.",
            });
            console.log(command.json);
            this.hubs.forEach((hub) => {
                console.log(`sending command to: ${hub.robot.name}`);
                hub.robot.sendCommand(command);
                // hub.robot.sendCommand(command2);
            });
        }
    }
    launch(data) {
        let dataString = '';
        try {
            dataString = JSON.stringify(data, null, 2);
        }
        catch (err) {
            //
        }
        robokit_rom_1.Logger.info([`IdentEnsembleSkill: launch:\n${dataString}`]);
        if (!this.running) {
            this.running = true;
            setTimeout(() => { this.running = false; }, 10000); // wait 10 seconds to reset
            let hubArray = this.getShuffledArrayOfHubs();
            if (hubArray && hubArray.length > 0) {
                let robotIndex = 0;
                hubArray.forEach((hub) => {
                    if (hub && hub.robot) {
                        hub.robot.updateRobotStatusMessages(`IdentEnsembleSkill: robot: ${hub.robot.name}`);
                        try {
                            let robot = hub.robot;
                            let delay = 3.0 * robotIndex;
                            robotIndex += 1;
                            if (robot.requester) {
                                let prompt = `<break size='${delay}'/><anim cat='shift' layers='body' nonBlocking='true'/><anim cat='happy' layers='screen' filter='&(eye-only)' nonBlocking='true' />.My name is ${robot.name}.`;
                                // let p = robot.requester.play.say(`<break size='3.0'/><anim cat='shift' layers='body' nonBlocking='true'/><anim cat='happy' layers='screen' filter='&(eye-only)' nonBlocking='true' />.Yeah, that's right.`).complete;
                                robot.updateRobotStatusMessages(`IdentEnsembleSkill: saying: ${prompt}`);
                                let p = robot.requester.expression.say(prompt).complete;
                                p.then(() => {
                                    // console.log(`IdentEnsembleSkill: launch: done`);
                                })
                                    .catch((result) => {
                                    robot.updateRobotStatusMessages(`IdentEnsembleSkill: error:`);
                                    robot.updateRobotStatusMessages(JSON.stringify(result, null, 2));
                                });
                            }
                        }
                        catch (err) {
                            robokit_rom_1.Logger.info([`IdentEnsembleSkill: launch: error:`]);
                            robokit_rom_1.Logger.info([err]);
                        }
                    }
                });
            }
            else {
                robokit_rom_1.Logger.info([`IdentEnsembleSkill: launch: error: hubAarray length: ${hubArray.length}`]);
            }
        }
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
exports.default = IdentEnsembleSkill;
//# sourceMappingURL=IdentEnsembleSkill.js.map