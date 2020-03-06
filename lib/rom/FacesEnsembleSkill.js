"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const robokit_rom_1 = require("robokit-rom");
class FacesEnsembleSkill extends robokit_rom_1.EnsembleSkill {
    constructor(id, launchIntent) {
        super(id, launchIntent);
        this._dataStreamEventHandler = this.onDataStreamEvent.bind(this);
        this.running = true;
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
        //     console.log(`FacesEnsembleSkill: launch: running: ${this.running}`);
        //     if (!this.running) {
        //         this.running = true;
        //         let hubArray: Hub[] = this.getShuffledArrayOfHubs();
        //         if (hubArray && hubArray.length > 0) {
        //             let time: Date = new Date();
        //             let hours: number = time.getHours(); //'9';
        //             if (hours > 12) {
        //                 hours -= 12;
        //             }
        //             let minutes: number =  time.getMinutes(); //'35'
        //             let minutesPrefix: string = (minutes < 10) ? 'oh' : '';
        //             let timePrompt: string = `<anim name='emoji-clock-hf-01' nonBlocking='true'/>The current time is ${hours} ${minutesPrefix} ${minutes}`;
        //             let primaryHub: Hub | undefined = hubArray.shift();
        //             if (primaryHub && primaryHub.robot) {
        //                 let robot: Robot = primaryHub.robot;
        //                 if (robot.requester) {
        //                     let p = robot.requester.expression.say(timePrompt).complete;
        //                     p.then( () => {
        //                         // console.log(`FacesEnsembleSkill: launch: done`);
        //                         this.running = false;
        //                     })
        //                     .catch((result: any) => {
        //                         robot.updateRobotStatusMessages(JSON.stringify(result, null, 2))
        //                     })
        //                 }
        //             }
        //             hubArray.forEach((hub: Hub) => {
        //                 if (hub && hub.robot) {
        //                     let robot: Robot = hub.robot;
        //                     if (robot.requester) {
        //                         let prompt: string = `<break size='3.0'/><anim cat='shift' layers='body' nonBlocking='true'/><anim cat='happy' layers='screen' filter='&(eye-only)' nonBlocking='true' />.Yeah, that's right.`;
        //                         // let p = robot.requester.play.say(`<break size='3.0'/><anim cat='shift' layers='body' nonBlocking='true'/><anim cat='happy' layers='screen' filter='&(eye-only)' nonBlocking='true' />.Yeah, that's right.`).complete;
        //                         let p = robot.requester.expression.say(prompt).complete;
        //                         p.then( () => {
        //                             // console.log(`FacesEnsembleSkill: launch: done`);
        //                         })
        //                         .catch((result: any) => {
        //                             robot.updateRobotStatusMessages(JSON.stringify(result, null, 2))
        //                         })
        //                     }
        //                 }
        //             });
        //         }
        //     }
    }
    tick(frameTime, elapsedTime) {
    }
}
exports.default = FacesEnsembleSkill;
//# sourceMappingURL=FacesEnsembleSkill.js.map