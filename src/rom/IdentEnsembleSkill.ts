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
