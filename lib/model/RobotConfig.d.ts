export declare enum RobotConfigProperties {
    configId = "configId",
    type = "type",
    ip = "ip",
    serialName = "serialName",
    email = "email",
    password = "password"
}
export default class RobotConfig {
    static ID_KEY: string;
    data: any;
    constructor(data?: any);
    static get propertyKeys(): string[];
    get id(): string;
    set id(configId: string);
    setProperty(key: string, value: string): void;
    get json(): any;
}
