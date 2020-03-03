// Generated by dts-bundle v0.7.3
// Dependencies for this module:
//   ../events

declare module 'node-cli' {
    import Model from 'node-cli/model/Model';
    import CommandParser, { help } from 'node-cli/CommandParser';
    import CommandResponse, { CommandState } from 'node-cli/CommandResponse';
    import Profiles from 'node-cli/model/Profiles';
    import Profile from 'node-cli/model/Profile';
    import Config from 'node-cli/model/Config';
    import { moveFileIfItExists, moveFilesThatExist } from 'node-cli/utils/MoveFilesThatExist';
    export { Model, CommandParser, help, CommandResponse, CommandState, Profiles, Profile, Config, moveFileIfItExists, moveFilesThatExist, };
}

declare module 'node-cli/model/Model' {
    import { EventEmitter } from "events";
    import Config from "node-cli/model/Config";
    import Profiles from 'node-cli/model/Profiles';
    import Profile from 'node-cli/model/Profile';
    import RobotConfig from "node-cli/model/RobotConfig";
    import RobotConfigs from "node-cli/model/RobotConfigs";
    export default class Model extends EventEmitter {
        config: Config;
        profiles: Profiles;
        robotConfigs: RobotConfigs;
        constructor();
        initWithData(data: any): void;
        getActiveProfile(): Profile;
        getActiveRobotConfig(): RobotConfig;
        get json(): any;
        saveConfig(): void;
        reloadConfig(): void;
        getAppVerison(): string;
        dispose(): void;
    }
}

declare module 'node-cli/CommandParser' {
    import { EventEmitter } from 'events';
    import Model from 'node-cli/model/Model';
    import Profile from 'node-cli/model/Profile';
    import RobotConfig from 'node-cli/model/RobotConfig';
    export const help: any;
    export default class CommandParser extends EventEmitter {
        constructor(appModel: Model);
        get profile(): Profile;
        get robotConfig(): RobotConfig;
        getConfig(): string;
        parseCommand(input: string): Promise<any>;
        execShellCommand(shellCommand: string): Promise<any>;
        parseSetCommand(command: string, args: string[]): string;
        parseLoadCommand(command: string, args: string[]): string;
        parseDeleteCommand(command: string, args: string[]): any;
        parseShowCommand(command: string, args: string[]): Promise<any>;
        parseSaveCommand(command: string, args: string[]): Promise<any>;
        parseEditCommand(command: string, args: string[]): any;
        parseNewCommand(command: string, args: string[]): Promise<any>;
        parseListCommand(command: string, args: string[]): string;
    }
}

declare module 'node-cli/CommandResponse' {
    export enum CommandState {
        OK = "OK",
        NOK = "NOK",
        PENDING = "PENDING",
        INCOMPLETE = "INCOMPLETE",
        UNDEFINED = "UNDEFINED"
    }
    export interface InquirerPrompt {
        type: string;
        name: string;
        message: string;
        choices?: string[];
        filter?: any;
    }
    export default class CommandResponse {
        input: string;
        state: CommandState;
        output: string;
        inquirerPrompt: InquirerPrompt | InquirerPrompt[] | undefined;
        constructor(input: string, output?: string, state?: CommandState, inquirerPrompt?: InquirerPrompt);
        get json(): any;
    }
}

declare module 'node-cli/model/Profiles' {
    import Profile from 'node-cli/model/Profile';
    export default class Profiles {
        static DEFAULT_ID: string;
        profileMap: any;
        activeProfileId: string;
        constructor(data: any);
        getProfileWithId(id: string): Profile | undefined;
        getActiveProfile(): Profile;
        getDefaultProfile(): Profile;
        getProfileIds(): string[];
        setActiveProfile(id: string): Profile;
        setProfileProperty(key: string, value: string): void;
        addProfile(data: any): Profile;
        newProfile(profileId: string, makeActiveProfile?: boolean): Profile | undefined;
        deleteProfile(id: string): Profile;
        get json(): any;
    }
}

declare module 'node-cli/model/Profile' {
    export enum ProfileProperties {
        profileId = "profileId",
        romPort = "romPort",
        clientId = "clientId",
        clientSecret = "clientSecret",
        nluDefault = "nluDefault",
        nluLUISEndpoint = "nluLUISEndpoint",
        nluLUISAppId = "nluLUISAppId",
        nluLUISSubscriptionKey = "nluLUISSubscriptionKey",
        nluDialogflowClientToken = "nluDialogflowClientToken",
        nluDialogflowProjectId = "nluDialogflowProjectId",
        nluDialogflowPrivateKey = "nluDialogflowPrivateKey",
        nluDialogflowClientEmail = "nluDialogflowClientEmail",
        neo4jUrl = "neo4jUrl",
        neo4jUser = "neo4jUser",
        neo4jPassword = "neo4jPassword"
    }
    export default class Profile {
        static ID_KEY: string;
        data: any;
        constructor(data?: any);
        static get propertyKeys(): string[];
        get id(): string;
        set id(profileId: string);
        setProperty(key: string, value: string): void;
        get json(): any;
    }
}

declare module 'node-cli/model/Config' {
    import { EventEmitter } from "events";
    export default class Config extends EventEmitter {
        constructor();
        get configFile(): any;
        get data(): any;
        set data(obj: any);
        get timestamp(): number;
        load(cb: any): void;
        save(cb: any): void;
    }
}

declare module 'node-cli/utils/MoveFilesThatExist' {
    export function moveFileIfItExists(filePath: string): Promise<void>;
    export function moveFilesThatExist(filePaths: string[]): Promise<void>;
}

declare module 'node-cli/model/RobotConfig' {
    export enum RobotConfigProperties {
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
}

declare module 'node-cli/model/RobotConfigs' {
    import RobotConfig from 'node-cli/model/RobotConfig';
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
}

