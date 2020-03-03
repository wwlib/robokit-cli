import Model from './model/Model';
export default class RobotConfigHelper {
    private _appModel;
    constructor(appModel: Model);
    create(): Promise<any>;
    dispose(): void;
}
