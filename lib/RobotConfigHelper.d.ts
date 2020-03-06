import RobotConfig from './model/RobotConfig';
export default class RobotConfigHelper {
    private _config;
    private _editMode;
    constructor(config?: RobotConfig | undefined);
    create(): Promise<any>;
    dispose(): void;
}
