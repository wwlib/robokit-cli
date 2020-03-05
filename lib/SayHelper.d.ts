import Model from './model/Model';
export default class SayHelper {
    private _appModel;
    constructor(appModel: Model);
    sayPrompt(): {
        type: string;
        name: string;
        message: string;
    };
    loop(): Promise<any>;
    dispose(): void;
}
