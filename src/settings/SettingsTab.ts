import EmotionPickerPlugin from "../../main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class EmotionPickerSettingsTab extends PluginSettingTab {
	plugin: EmotionPickerPlugin;

	constructor(app: App, plugin: EmotionPickerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	refresh(): void {
		this.display();
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Emotion Picker Settings' });

		// TODO: customize modal header

		new Setting(containerEl)
		.setName("Modal header text")
		.setDesc("Customize modal header text")
		.addText((textField) => {
			textField.setValue(this.plugin.settings.modalHeaderText);
			textField.onChange(newValue => {
				this.plugin.settings.modalHeaderText = newValue;
				this.plugin.saveSettings();
			})
		})

		new Setting(containerEl)
			.setName("Add comma after")
			.setDesc("Add a comma after pasted emotion")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.useCommaInSeparator)
					.onChange(async (value) => {
						this.plugin.settings.useCommaInSeparator = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Insert as link")
			.setDesc("Insert emotion as a [[link]]")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.addAsLink)
					.onChange(async (value) => {
						this.plugin.settings.addAsLink = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Insert as tag")
			.setDesc("Insert emotion as a #tag")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.addAsTag)
					.onChange(async (value) => {
						this.plugin.settings.addAsTag = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Capitalize")
			.setDesc("Capitalize (useful if inserting emotion as link or tag)")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.capitalize)
					.onChange(async (value) => {
						this.plugin.settings.capitalize = value;
						await this.plugin.saveSettings();
					})
			);

		containerEl.createEl('h3', { text: 'Emotion groups' });



		// TODO: refresh settings page after saving

		this.plugin.settings.emotions.forEach(es => {

			const setting = new Setting(containerEl);
			setting.setClass("emotion-section-setting");
			
			const groupNameLabel = createEl("span", {text: "Name: "});
			setting.controlEl.appendChild(groupNameLabel);
			
			setting.addText(textField => {
				textField.setValue(es.name)
				.setPlaceholder("group name")
				.onChange(value => {
					es.name = value;
					this.plugin.saveSettings;
				})
			});

			const colorPickerLabel = createEl("span", {text: "Color: "});
			setting.controlEl.appendChild(colorPickerLabel);

			const colorPicker = createEl("input", {
				type: "color",
				cls: "settings-color-picker"
			}, el => {
				el.value = es.color;
				el.onchange = () => {
					es.color = el.value;
					this.plugin.saveSettings();
				}
			})

			setting.controlEl.appendChild(colorPicker);

			const emotionsListLabel = createEl("span", {text: "Emotions:"});
			setting.controlEl.appendChild(emotionsListLabel);

			setting.addTextArea(textArea => {
				textArea.inputEl.setAttribute("rows", es.emotions.length.toString());

				textArea.setPlaceholder("emotions, separated by newline or comma.")
				.setValue(es.emotions.join("\n"))
				.onChange(async (value) => {
					es.emotions = splitByCommaAndNewline(value);
					this.plugin.saveSettings();
				})
			})

			setting.addButton(btn => {
				btn.setButtonText("delete group");
				btn.setClass("settings-delete-btn")
				btn.onClick(() => {
					this.plugin.settings.emotions = this.plugin.settings.emotions.filter(e => e.id !== es.id);
					this.plugin.saveSettings();
					this.refresh();
				});
			})

		})

		new Setting(containerEl)
		.addButton(btn => {
			btn.setButtonText("Add group");
			btn.onClick(() => {
				this.plugin.settings.emotions.push({
					id: Math.max(...this.plugin.settings.emotions.map(e => e.id)) + 1, // id "generation"
					name: "New section",
					emotions: [],
					color: "#000000"
				});
				this.plugin.saveSettings();
				this.refresh();
			});
		})
	}
}

function splitByCommaAndNewline(rawEmotions: string): string[] {
	const splitted: string[] = [];

	rawEmotions.split("\n").forEach(
		s => s.split(",").forEach(
			sp => splitted.push(sp.trim())
			));

	return splitted;
}