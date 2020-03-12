import { Robot, RobotIntentData, Hub, EnsembleSkill, EnsembleSkillManager, RobotDataStreamEvent, RomCommand, Logger } from 'robokit-rom';

export default class IdentEnsembleSkill extends EnsembleSkill {

    private _dataStreamEventHandler: any = this.onDataStreamEvent.bind(this);

    constructor(id: string, launchIntent: string) {
        super(id, launchIntent);
        this.running = false;
    }

    addHub(hub: Hub): void {
        super.addHub(hub);
        hub.on('dataStreamEvent', this._dataStreamEventHandler);
    }

    onDataStreamEvent(event: RobotDataStreamEvent) {
    }

    launch(data: RobotIntentData): void {
        let dataString: string = '';
        try {
            dataString = JSON.stringify(data, null, 2);
        } catch (err) {
            //
        }
        Logger.info([`IdentEnsembleSkill: launch:\n${dataString}`]);
        if (!this.running) {
            this.running = true;
            setTimeout(() => { this.running = false}, 10000); // wait 10 seconds to reset

            let hubArray: Hub[] = this.getShuffledArrayOfHubs();
            if (hubArray && hubArray.length > 0) {
                let robotIndex: number = 0;
                hubArray.forEach((hub: Hub) => {
                    if (hub && hub.robot) {
                        hub.robot.updateRobotStatusMessages(`IdentEnsembleSkill: robot: ${hub.robot.name}`);
                        try {
                            let robot: Robot = hub.robot;
                            let delay: number = 3.0 * robotIndex;
                            robotIndex += 1;
                            if (robot.requester) {
                                let prompt: string = `<break size='${delay}'/><anim cat='shift' layers='body' nonBlocking='true'/><anim cat='happy' layers='screen' filter='&(eye-only)' nonBlocking='true' />.My name is ${robot.name}.`;
                                // let p = robot.requester.play.say(`<break size='3.0'/><anim cat='shift' layers='body' nonBlocking='true'/><anim cat='happy' layers='screen' filter='&(eye-only)' nonBlocking='true' />.Yeah, that's right.`).complete;
                                robot.updateRobotStatusMessages(`IdentEnsembleSkill: saying: ${prompt}`);
                                let p = robot.requester.expression.say(prompt).complete;
                                p.then(() => {
                                    // console.log(`IdentEnsembleSkill: launch: done`);
                                })
                                    .catch((result: any) => {
                                        robot.updateRobotStatusMessages(`IdentEnsembleSkill: error:`);
                                        robot.updateRobotStatusMessages(JSON.stringify(result, null, 2))
                                    })
                            }
                        } catch (err) {
                            Logger.info([`IdentEnsembleSkill: launch: error:`]);
                            Logger.info([err]);
                        }
                    }
                });
            } else {
                Logger.info([`IdentEnsembleSkill: launch: error: hubAarray length: ${hubArray.length}`]);
            }
        }
    }

    tick(frameTime: number, elapsedTime: number): void {

    }

    dispose() {
        const hubs: Hub[] = Array.from(this.hubMap.values());
        hubs.forEach((hub: Hub) => {
            hub.removeListener('dataStreamEvent', this._dataStreamEventHandler);
        });
    }
}
