export enum RobotConfigProperties {
    configId = 'configId',
    type = 'type',
    ip = 'ip',
    serialName = 'serialName',
    email = 'email',
    password = 'password',
}

export default class RobotConfig {

    static ID_KEY: string = RobotConfigProperties.configId;
    
    public data: any;

    constructor(data?: any) {
        if (data) {
            this.data = data;
        } else {
            this.data = {};
            RobotConfig.propertyKeys.forEach(propertyKey => {
                this.data[propertyKey] = '';
            });
        }
    }

    static get propertyKeys(): string[] {
        return Object.keys(RobotConfigProperties);
    }

    get id(): string {
        return this.data.configId || '';
    }

    set id(configId: string) {
        if (configId) {
            this.data.configId = configId;
        }
    }

    get name(): string {
        return this.data.configId || '';
    }

    get type(): string {
        return this.data.type || '';
    }

    get ip(): string {
        return this.data.ip || '';
    }

    get serialName(): string {
        return this.data.serialName || '';
    }

    get email(): string {
        return this.data.email || '';
    }

    get password(): string {
        return this.data.password || '';
    }


    // getProperty(key: string): string {
    //     return this.data[key];
    // }

    setProperty(key: string, value: string) {
        let isValidProperty: boolean = RobotConfig.propertyKeys.indexOf(key) != -1;
        if (key && value && isValidProperty) {
            this.data[key] = value;
        }
    }

    get json(): any {
        return this.data;
    }
}