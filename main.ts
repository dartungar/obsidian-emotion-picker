import { Plugin } from "obsidian";
import { DefaultSettings, EmotionPickerSettings } from "src/settings/PluginSettings";
import { addSmileIcon } from "src/SmileIcon";
import { EmotionPickerModal } from "./src/Modal";
import { EmotionPickerSettingsTab } from "src/settings/SettingsTab";
import { EmotionSection, getDefaultEmotions } from "src/emotions";

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
		const loadedSettings = await this.loadData();
		this.settings = Object.assign(
			{},
			new DefaultSettings(),
			loadedSettings
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	getEmotionsOrDefault(): EmotionSection[] {
		if (this.settings.emotions && this.settings.emotions.length > 0)
			return this.settings.emotions;
		return getDefaultEmotions(this.settings.locale);
	}
}
