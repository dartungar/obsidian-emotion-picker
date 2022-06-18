import { Plugin } from "obsidian";
import { DefaultSettings, EmotionPickerSettings } from "src/settings/PluginSettings";
import { addSmileIcon } from "src/SmileIcon";
import { EmotionPickerModal } from "./src/Modal";
import { EmotionPickerSettingsTab } from "src/settings/SettingsTab";

export default class EmotionPickerPlugin extends Plugin {
	settings: EmotionPickerSettings;

	async onload() {
		// add new icon for ribbon item
		addSmileIcon();

		this.addRibbonIcon("smile", "Emotions Picker", (evt: MouseEvent) => {
			new EmotionPickerModal(this.app, this).open();
		});

		this.addCommand({
			id: "Open",
			name: "Open",
			callback: () => {
				new EmotionPickerModal(this.app, this).open();
			},
		});

		await this.loadSettings();

		this.addSettingTab(new EmotionPickerSettingsTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			new DefaultSettings(),
			await this.loadData()
		);
	}

	async saveSettings() {
		console.log("saving settings with emotions:", this.settings.emotions);
		await this.saveData(this.settings);
	}
}
