import RobotConfig from './RobotConfig';
import { isArray } from 'util';

export default class RobotConfigs {

    static DEFAULT_ID = 'Default';

    private _configMap: Map<string, RobotConfig>;

    constructor() {
        this._configMap = new Map<string, RobotConfig>();
    }

    initWithData(data: any[]) {
        if (data && Array.isArray(data)) {
            data.forEach((configData: any) => {
                const config: RobotConfig = new RobotConfig(configData);
                this._configMap.set(configData.configId, config);
            });
        } else {
            console.log('RobotConfigs: initWithData: invalid data.');
        }
    }

    get configList(): RobotConfig[] {
        return Array.from(this._configMap.values());
    }

    getRobotConfigWithId(id: string): RobotConfig | undefined {
        return this._configMap.get(id);
    }

    getDefaultRobotConfig(): RobotConfig | undefined {
        return this._configMap.get(RobotConfigs.DEFAULT_ID);
    }

    getRobotConfigIds(): string[] {
        const configKeys: string[] = Array.from(this._configMap.keys()).sort();
        return configKeys;
    }

    setRobotConfigProperty(configId: string, key: string, value: string) {
        let config: RobotConfig | undefined = this.getRobotConfigWithId(configId);
        if (config) {
            if (key === RobotConfig.ID_KEY && !this._configMap.get(value)) {
                let oldId: string = config.id;
                let newId: string = value;
                this._configMap.delete(oldId);
                config.setProperty(key, newId);
                this._configMap.set(newId, config);
            } else {
                config.setProperty(key, value);
            }
        }
    }

    addRobotConfigWithData(data: any) {
        if (data) {
            let config: RobotConfig = new RobotConfig(data);
            if (config.id) {
                this._configMap.set(config.id, config);
            }
        }
    }

    addRobotConfig(config: RobotConfig) {
        if (config && config.id) {
            this._configMap.set(config.id, config);
        }
    }

    newRobotConfig(configId: string): RobotConfig | undefined {
        let result: RobotConfig | undefined = undefined;
        let config: RobotConfig = new RobotConfig();
        if (configId && !this._configMap.get(configId)) {
            config.id = configId
            this._configMap.set(config.id, config);
            result = config;
        }
        return result;
    }

    deleteRobotConfig(id: string) {
        if (id == RobotConfigs.DEFAULT_ID || !this.getRobotConfigWithId(id)) {
            // noop
        } else {
            this._configMap.delete(id);
        }
    }

    get json(): any {
        let result: any = [];
        const configKeys: string[] = Array.from(this._configMap.keys()).sort();
        configKeys.forEach(key => {
            const config: RobotConfig | undefined = this._configMap.get(key);
            if (config) {
                result.push(config.json);
            }
        });
        return result;
    }

}