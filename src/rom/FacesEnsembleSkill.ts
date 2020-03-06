import { Robot, RobotIntentData, Hub, EnsembleSkill, EnsembleSkillManager, RobotDataStreamEvent, RomCommand } from 'robokit-rom';

export default class FacesEnsembleSkill extends EnsembleSkill {

    private _dataStreamEventHandler: any = this.onDataStreamEvent.bind(this);

    constructor(id: string, launchIntent: string) {
        super (id, launchIntent);
        this.running = true;
    }

    addHub(hub: Hub): void {
        super.addHub(hub);
        hub.on('dataStreamEvent', this._dataStreamEventHandler);
    }

    onDataStreamEvent(event: RobotDataStreamEvent) {
        if (event && event.type === 'faceGained') {
            console.log(`${this.id}: onDataStreamEvent: ${event.robotId} -> ${event.type}`);
            console.log(JSON.stringify(event, null, 2));
            const entities: any = event.data;
            const entity: any = entities[0];
            const worldCoords = entity.WorldCoords
            const command: RomCommand = new RomCommand('lookAt', 'lookAt', {
                vector: [
                    worldCoords[0],
                    worldCoords[1],
                    worldCoords[2]
                  ]
            });
            const command2: RomCommand = new RomCommand('emoji', 'tts', {
                text: "<anim name='emoji-clock-hf-01' nonBlocking='true'/>.",
            });
            console.log(command.json);
            this.hubs.forEach((hub: Hub) => {
                console.log(`sending command to: ${hub.robot.name}`);
                hub.robot.sendCommand(command);
                // hub.robot.sendCommand(command2);
            });
        }
    }

    launch(data: RobotIntentData) :void {
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

    tick(frameTime: number, elapsedTime: number): void {

    }

}
