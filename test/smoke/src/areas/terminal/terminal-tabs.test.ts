/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { ParsedArgs } from 'minimist';
import { Application, Terminal, TerminalCommandId, TerminalCommandIdWithValue } from '../../../../automation/out';

export function setup(opts: ParsedArgs) {
	describe('Terminal Tabs', () => {
		// Acquire automation API
		let terminal: Terminal;
		before(function () {
			const app = this.app as Application;
			terminal = app.workbench.terminal;
		});

		it('clicking the plus button should create a terminal and display the tabs view showing no split decorations', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			await terminal.runCommand(TerminalCommandId.CreateNew);
			await terminal.clickPlusButton();
			await terminal.assertTerminalGroups([[{}], [{}]]);
		});

		it('should update color of the single tab', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			const color = 'Cyan';
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.ChangeColor, color);
			await terminal.assertSingleTab({ color });
		});

		it('should update color of the tab in the tabs list', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			await terminal.runCommand(TerminalCommandId.Split);
			const color = 'Cyan';
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.ChangeColor, color);
			await terminal.assertTerminalGroups([[{}, { color }]]);
		});

		it('should update icon of the single tab', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			const icon = 'symbol-method';
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.ChangeIcon, icon);
			await terminal.assertSingleTab({ icon });
		});

		it('should update icon of the tab in the tabs list', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			await terminal.runCommand(TerminalCommandId.Split);
			const icon = 'symbol-method';
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.ChangeIcon, icon);
			await terminal.assertTerminalGroups([[{}, { icon }]]);
		});

		it('should rename the single tab', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			const name = 'my terminal name';
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.Rename, name);
			await terminal.assertSingleTab({ name });
		});

		it('should reset the tab name to the default value when no name is provided', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			const defaultName = await terminal.getSingleTabName();
			const name = 'my terminal name';
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.Rename, name);
			await terminal.assertSingleTab({ name });
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.Rename, undefined);
			await terminal.assertSingleTab({ name: defaultName });
		});

		it('should rename the tab in the tabs list', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			await terminal.runCommand(TerminalCommandId.Split);
			const name = 'my terminal name';
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.Rename, name);
			await terminal.assertTerminalGroups([[{}, { name }]]);
		});

		it('should create a split terminal when single tab is alt clicked', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			const page = await terminal.getPage();
			page.keyboard.down('Alt');
			await terminal.clickSingleTab();
			page.keyboard.up('Alt');
			await terminal.assertTerminalGroups([[{}, {}]]);
		});

		it('should do nothing when join tabs is run with only one terminal', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			await terminal.runCommand(TerminalCommandId.Join);
			await terminal.assertTerminalGroups([[{}]]);
		});

		it('should do nothing when join tabs is run with only split terminals', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			await terminal.runCommand(TerminalCommandId.Split);
			await terminal.runCommand(TerminalCommandId.Join);
			await terminal.assertTerminalGroups([[{}], [{}]]);
		});

		it('should join tabs when more than one non-split terminal', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			await terminal.runCommand(TerminalCommandId.CreateNew);
			await terminal.runCommand(TerminalCommandId.Join);
			await terminal.assertTerminalGroups([[{}, {}]]);
		});

		it('should do nothing when unsplit tabs called with no splits', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			await terminal.runCommand(TerminalCommandId.CreateNew);
			await terminal.assertTerminalGroups([[{}], [{}]]);
			await terminal.runCommand(TerminalCommandId.Unsplit);
			await terminal.assertTerminalGroups([[{}], [{}]]);
		});

		it('should unsplit tabs', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			await terminal.runCommand(TerminalCommandId.Split);
			await terminal.assertTerminalGroups([[{}, {}]]);
			await terminal.runCommand(TerminalCommandId.Unsplit);
			await terminal.assertTerminalGroups([[{}], [{}]]);
		});

		it('should move the terminal to the editor area', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			await terminal.assertSingleTab({});
			await terminal.runCommand(TerminalCommandId.MoveToEditor);
			await terminal.assertEditorGroupCount(1);
		});
	});
}
