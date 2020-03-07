export default class SayHelper {
    constructor();
    sayPrompt(): {
        type: string;
        name: string;
        message: string;
    };
    loop(): Promise<any>;
    dispose(): void;
}
