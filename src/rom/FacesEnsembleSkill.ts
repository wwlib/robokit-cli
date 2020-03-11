import { Robot, RobotIntentData, Hub, EnsembleSkill, EnsembleSkillManager, RobotDataStreamEvent, RomCommand, Logger } from 'robokit-rom';

export default class FacesEnsembleSkill extends EnsembleSkill {

    private _dataStreamEventHandler: any = this.onDataStreamEvent.bind(this);
    private _primaryHub: Hub | undefined = undefined;

    constructor(id: string, launchIntent: string) {
        super(id, launchIntent);
        this.running = true;
    }

    addHub(hub: Hub): void {
        super.addHub(hub);
        hub.on('dataStreamEvent', this._dataStreamEventHandler);
    }

    onDataStreamEvent(event: RobotDataStreamEvent) {
        if (event && event.type === 'faceGained') {
            Logger.info([`FacesEnsembleSkill: onDataStreamEvent: ${event.robotId} -> ${event.type}`]);
            if (!this._primaryHub) {
                const hub: Hub | undefined = this.hubMap.get(event.robotId);
                if (hub) {
                    Logger.info([`FacesEnsembleSkill: primary hub set to: ${event.robotId}`]);
                    this._primaryHub = hub;
                    setTimeout(() => {
                        this._primaryHub = undefined;
                        Logger.info([`FacesEnsembleSkill: primary reset`]);
                        const attentionIdle: RomCommand = new RomCommand('attention-off', 'attention', {
                            state: "IDLE",
                        });
                        this.hubs.forEach((hub: Hub) => {
                            hub.robot.updateRobotStatusMessages(`FacesEnsembleSkill: sending RomCommand: ${attentionIdle.type}`);
                            hub.robot.sendCommand(attentionIdle);
                        });
                    }, 10000); // wait 10 seconds to reset

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
                    const attentionOff: RomCommand = new RomCommand('attention-off', 'attention', {
                        state: "OFF",
                    });
                    this.hubs.forEach((hub: Hub) => {
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

    launch(data: RobotIntentData): void {
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
