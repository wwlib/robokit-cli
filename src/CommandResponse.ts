export enum CommandState {
  OK = 'OK',
  NOK = 'NOK',
  PENDING = 'PENDING',
  INCOMPLETE = 'INCOMPLETE',
  UNDEFINED = 'UNDEFINED',
}

export interface InquirerPrompt {
    type: string;
    name: string;
    message: string;
    choices?: string[];
    filter?: any;
}

export default class CommandResponse {

  private static _responseId: number = 0;

  public input: string;
  public state: CommandState;
  public output: string;
  public inquirerPrompt: InquirerPrompt | InquirerPrompt[] | undefined;

  private _id: number;

  constructor(input: string, output?: string, state?: CommandState, inquirerPrompt?: InquirerPrompt) {
    this.input = input;
    this.state = state || CommandState.OK;
    this.output = output || '';
    this.inquirerPrompt = inquirerPrompt;
    this._id = CommandResponse._responseId++;
  }

  get json(): any {
    return {
      command: this.input,
      state: CommandState[this.state],
      output: this.output,
      inquirerPrompt: this.inquirerPrompt,
    }
  }
}