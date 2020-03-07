import RobotConfig from './RobotConfig';
export default class RobotConfigs {
    static DEFAULT_ID: string;
    private _configMap;
    constructor();
    initWithData(data: any[]): void;
    get configList(): RobotConfig[];
    getRobotConfigWithId(id: string): RobotConfig | undefined;
    getDefaultRobotConfig(): RobotConfig | undefined;
    getRobotConfigIds(): string[];
    setRobotConfigProperty(configId: string, key: string, value: string): void;
    addRobotConfigWithData(data: any): void;
    addRobotConfig(config: RobotConfig): void;
    newRobotConfig(configId: string): RobotConfig | undefined;
    deleteRobotConfig(id: string): void;
    get json(): any;
}
