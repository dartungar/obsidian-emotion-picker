import { Plugin } from "obsidian";
import { addSmileIcon } from "src/SmileIcon";
import { EmotionPickerModal } from "./src/Modal";

export default class MyPlugin extends Plugin {
	async onload() {
		// add new icon for ribbon item
		addSmileIcon();

		this.addRibbonIcon("smile", "Emotions Picker", (evt: MouseEvent) => {
			new EmotionPickerModal(this.app).open();
		});

		this.addCommand({
			id: "Open",
			name: "Open",
			callback: () => {
				new EmotionPickerModal(this.app).open();
			},
		});
	}

	onunload() {}
}
