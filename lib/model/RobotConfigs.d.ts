import RobotConfig from './RobotConfig';
export default class RobotConfigs {
    static DEFAULT_ID: string;
    configMap: any;
    constructor();
    initWithData(data: any[]): void;
    getRobotConfigWithId(id: string): RobotConfig | undefined;
    getDefaultRobotConfig(): RobotConfig;
    getRobotConfigIds(): string[];
    setRobotConfigProperty(configId: string, key: string, value: string): void;
    addRobotConfigWithData(data: any): void;
    addRobotConfig(config: RobotConfig): void;
    newRobotConfig(configId: string): RobotConfig | undefined;
    deleteRobotConfig(id: string): void;
    get json(): any;
}
