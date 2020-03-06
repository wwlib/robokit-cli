import { RobotIntentData, Hub, EnsembleSkill, RobotDataStreamEvent } from 'robokit-rom';
export default class FacesEnsembleSkill extends EnsembleSkill {
    private _dataStreamEventHandler;
    constructor(id: string, launchIntent: string);
    addHub(hub: Hub): void;
    onDataStreamEvent(event: RobotDataStreamEvent): void;
    launch(data: RobotIntentData): void;
    tick(frameTime: number, elapsedTime: number): void;
}
