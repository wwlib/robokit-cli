import Model from './model/Model';
export default class ProfileHelper {
    private _appModel;
    constructor(appModel: Model);
    create(): Promise<any>;
    dispose(): void;
}
