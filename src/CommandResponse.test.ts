import CommandResponse, { CommandState } from './CommandResponse';

test('CommandResponse: Instantiate', () => {
    const state: CommandState = CommandState.OK;
    const response: CommandResponse = new CommandResponse('input', 'output', state, undefined);
  expect(response.state).toBe(CommandState.OK);
});