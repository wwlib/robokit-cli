import RobotConfig from './RobotConfig';
export default class RobotConfigs {
    static DEFAULT_ID: string;
    configMap: any;
    activeRobotConfigID: string;
    constructor(data: any);
    getRobotConfigWithId(id: string): RobotConfig | undefined;
    getActiveRobotConfig(): RobotConfig;
    getDefaultRobotConfig(): RobotConfig;
    getRobotConfigIds(): string[];
    setActiveRobotConfig(id: string): RobotConfig;
    setRobotConfigProperty(key: string, value: string): void;
    addRobotConfig(data: any): RobotConfig;
    newRobotConfig(configId: string, makeActiveRobotConfig?: boolean): RobotConfig | undefined;
    deleteRobotConfig(id: string): RobotConfig;
    get json(): any;
}
