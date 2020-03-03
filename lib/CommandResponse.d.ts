export declare enum CommandState {
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
    private static _responseId;
    input: string;
    state: CommandState;
    output: string;
    inquirerPrompt: InquirerPrompt | InquirerPrompt[] | undefined;
    private _id;
    constructor(input: string, output?: string, state?: CommandState, inquirerPrompt?: InquirerPrompt);
    get json(): any;
}
