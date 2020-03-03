import RobotConfig from './RobotConfig';

export default class RobotConfigs {

    static DEFAULT_ID = 'Default';

    public configMap: any = {};
    public activeRobotConfigID: string

    constructor(data: any) {
        this.activeRobotConfigID = data.activeRobotConfigID;
        data.robotConfigs.forEach((configData: any) => {
            this.configMap[configData.configId] = new RobotConfig(configData);
        });
    }

    getRobotConfigWithId(id: string): RobotConfig | undefined {
        return this.configMap[id];
    }

    getActiveRobotConfig(): RobotConfig {
        return this.configMap[this.activeRobotConfigID];
    }

    getDefaultRobotConfig(): RobotConfig {
        this.activeRobotConfigID = RobotConfigs.DEFAULT_ID;
        return this.configMap[RobotConfigs.DEFAULT_ID];
    }

    getRobotConfigIds(): string[] {
        const configKeys: string[] = Object.keys(this.configMap).sort();
        return configKeys;
    }

    setActiveRobotConfig(id: string): RobotConfig {
        if (this.configMap[id]) {
            this.activeRobotConfigID = id;
        }
        return this.getActiveRobotConfig();
    }

    setRobotConfigProperty(key: string, value: string) {
        let config: RobotConfig = this.getActiveRobotConfig();
        if (config) {
            if (key === RobotConfig.ID_KEY && !this.configMap[value]) {
                let oldId: string = config.id;
                let newId: string = value;
                delete(this.configMap[oldId]);
                config.setProperty(key, newId);
                this.configMap[newId] = config;
                this.activeRobotConfigID = newId;
            } else {
                config.setProperty(key, value);
            }
        }
    }

    addRobotConfig(data: any): RobotConfig {
        let result: RobotConfig = this.getActiveRobotConfig();
        let config: RobotConfig = new RobotConfig(data);
        if (config.id) {
            this.configMap[config.id] = config;
            result = this.setActiveRobotConfig(config.id)
        }
        return result;
    }

    newRobotConfig(configId: string, makeActiveRobotConfig: boolean = true): RobotConfig | undefined {
        let result: RobotConfig | undefined = undefined;
        let config: RobotConfig = new RobotConfig();
        if (configId && !this.configMap[configId]) {
            config.id = configId
            this.configMap[config.id] = config;
            result = config;
            if (makeActiveRobotConfig) {
              this.setActiveRobotConfig(config.id);
            }
        }
        return result;
    }

    deleteRobotConfig(id: string): RobotConfig {
        let result: RobotConfig = this.getActiveRobotConfig();
        if (id == RobotConfigs.DEFAULT_ID || !this.getRobotConfigWithId(id)) {
            // noop
        } else {
            delete this.configMap[id]
            if (id === this.activeRobotConfigID) {
                this.activeRobotConfigID = '';
                const configKeys: string[] = Object.keys(this.configMap).sort();
                configKeys.forEach(key => {
                    if (this.configMap[key] && !this.activeRobotConfigID) {
                        this.activeRobotConfigID = key;
                        result = this.setActiveRobotConfig(this.activeRobotConfigID);
                    }
                });
                if (!result) {
                    result = this.getDefaultRobotConfig();
                }
            }
        }
        return result;
    }

    get json(): any {
        let result: any = {}
        result.activeRobotConfigID = this.activeRobotConfigID;
        result.robotConfigs = [];
        const configKeys: string[] = Object.keys(this.configMap).sort();
        configKeys.forEach(key => {
            result.robotConfigs.push(this.configMap[key].json);
        });
        return result;
    }

}