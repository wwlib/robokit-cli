import RobotConfig from './RobotConfig';
import { isArray } from 'util';

export default class RobotConfigs {

    static DEFAULT_ID = 'Default';

    public configMap: any = {};

    constructor() {
    }

    initWithData(data: any[]) {
        if (data && Array.isArray(data)) {
            data.forEach((configData: any) => {
                this.configMap[configData.configId] = new RobotConfig(configData);
            });
        } else {
            console.log('RobotConfigs: initWithData: invalid data.');
        }
    }

    getRobotConfigWithId(id: string): RobotConfig | undefined {
        return this.configMap[id];
    }

    getDefaultRobotConfig(): RobotConfig {
        return this.configMap[RobotConfigs.DEFAULT_ID];
    }

    getRobotConfigIds(): string[] {
        const configKeys: string[] = Object.keys(this.configMap).sort();
        return configKeys;
    }

    setRobotConfigProperty(configId: string, key: string, value: string) {
        let config: RobotConfig | undefined = this.getRobotConfigWithId(configId);
        if (config) {
            if (key === RobotConfig.ID_KEY && !this.configMap[value]) {
                let oldId: string = config.id;
                let newId: string = value;
                delete (this.configMap[oldId]);
                config.setProperty(key, newId);
                this.configMap[newId] = config;
            } else {
                config.setProperty(key, value);
            }
        }
    }

    addRobotConfigWithData(data: any) {
        if (data) {
            let config: RobotConfig = new RobotConfig(data);
            if (config.id) {
                this.configMap[config.id] = config;
            }
        }
    }

    addRobotConfig(config: RobotConfig) {
        if (config && config.id) {
            this.configMap[config.id] = config;
        }
    }

    newRobotConfig(configId: string): RobotConfig | undefined {
        let result: RobotConfig | undefined = undefined;
        let config: RobotConfig = new RobotConfig();
        if (configId && !this.configMap[configId]) {
            config.id = configId
            this.configMap[config.id] = config;
            result = config;
        }
        return result;
    }

    deleteRobotConfig(id: string) {
        if (id == RobotConfigs.DEFAULT_ID || !this.getRobotConfigWithId(id)) {
            // noop
        } else {
            delete this.configMap[id]
        }
    }

    get json(): any {
        let result: any = [];
        const configKeys: string[] = Object.keys(this.configMap).sort();
        configKeys.forEach(key => {
            result.push(this.configMap[key].json);
        });
        return result;
    }

}