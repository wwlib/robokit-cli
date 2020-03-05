import { Robot, RobotIntentData, Hub, EnsembleSkill, EnsembleSkillManager, RobotDataStreamEvent } from 'robokit-rom';

export default class ReceptionEnsembleSkill extends EnsembleSkill {

    private _dataStreamEventHandler: any = this.onDataStreamEvent.bind(this);

    constructor(id: string, launchIntent: string) {
        super (id, launchIntent);
    }

    addHub(hub: Hub): void {
        super.addHub(hub);
        hub.on('faceGained', this._dataStreamEventHandler);
    }

    onDataStreamEvent(event: RobotDataStreamEvent) {
        console.log(`onDataStreamEvent: ${event.robotId} -> ${event.type}`);
    }

    launch(data: RobotIntentData) :void {
    //     console.log(`ReceptionEnsembleSkill: launch: running: ${this.running}`);
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
    //                         // console.log(`ReceptionEnsembleSkill: launch: done`);
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
    //                             // console.log(`ReceptionEnsembleSkill: launch: done`);
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
