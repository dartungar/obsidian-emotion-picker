import EmotionPickerPlugin from "main";
import {
	App,
	Modal,
	MarkdownView,
	Notice,
	EditorPosition,
	Editor,
} from "obsidian";
import { EmotionSection } from "./emotions/EmotionSection";
import { EmotionPickerSettings } from "./settings/PluginSettings";

export class EmotionPickerModal extends Modal {
	app: App;
	plugin: EmotionPickerPlugin;
	content: HTMLElement;
	emotions: EmotionSection[];
	editor: Editor;
	initialCursorPosition: EditorPosition;
	locale: string;
	// current settings
	state: EmotionPickerSettings;

	constructor(app: App, plugin: EmotionPickerPlugin) {
		super(app);
		this.app = app;
		this.plugin = plugin;
		this.locale = this.plugin.settings.locale;
		this.emotions = plugin.getEmotionsOrDefault();
	}

	onOpen() {
		const { contentEl } = this;
		this.state = this.plugin.settings;
		contentEl.classList.add("modal-body");

		this.generateHeading();
		this.generateToggles();
		this.generateContentFromEmotions();

		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (view) {
			this.editor = view.editor;
			this.initialCursorPosition = this.editor.getCursor();
		} else {
			new Notice(`Error getting cursor position.`);
			this.close();
		}
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
		this.initialCursorPosition = undefined;
	}

	generateHeading(): void {
		const headingEl = this.contentEl.createEl("h3");
		headingEl.innerText = this.plugin.settings.modalHeaderText;
	}

	generateToggles(): void {
		const togglesEl = this.contentEl.createDiv();
		togglesEl.addClass("toggles-section");

		const useCommaToggleEl = this.generateToggleElement(
			togglesEl,
			"add comma after",
			this.state.useCommaInSeparator
		);
		useCommaToggleEl.onClickEvent(() => {
			this.state.useCommaInSeparator = !this.state.useCommaInSeparator;
		});

		const addAsLinkToggleEl = this.generateToggleElement(
			togglesEl,
			"add as [[link]]",
			this.state.addAsLink
		);
		addAsLinkToggleEl.onClickEvent(() => {
			this.state.addAsLink = !this.state.addAsLink;
		});

		const addAsTagToggleEl = this.generateToggleElement(
			togglesEl,
			"add as #tag",
			this.state.addAsTag
		);
		addAsTagToggleEl.onClickEvent(() => {
			this.state.addAsTag = !this.state.addAsTag;
		});
	}

	generateContentFromEmotions(): void {
		const contentEl = this.contentEl.createDiv();

		this.emotions.forEach((section) => {
			this.generateElementFromEmotionSection(section, contentEl);
		});
	}

	generateElementFromEmotionSection(
		section: EmotionSection,
		baseEl: HTMLElement
	): void {
		const sectionEl = baseEl.createDiv();
		sectionEl.classList.add("emotion-section");

		const heading = sectionEl.createEl("h4");
		heading.innerText = section.name;
		heading.style.color = section.color;
		heading.style.fontWeight = "bold";

		section.emotions.forEach((emotionString) => {
			const emotionEl = sectionEl.createDiv();
			emotionEl.innerHTML = emotionString;
			emotionEl.style.textDecorationColor = section.color;
			emotionEl.classList.add("emotion-element");
			emotionEl.onClickEvent(() => {
				this.insertText(this.getFinalText(emotionString));
			});
		});
	}

	insertText(text: string): void {
		if (this.editor) {
			this.editor.replaceRange(text, this.initialCursorPosition);
			this.initialCursorPosition.ch += text.length;
		}

		new Notice(`Inserted '${text}'.`);
	}

	generateToggleElement(
		baseEl: HTMLElement,
		text: string,
		initialState = false
	): HTMLDivElement {
		const toggleContainerEl = baseEl.createDiv();

		const toggleEl = toggleContainerEl.createDiv();
		toggleEl.classList.add("checkbox-container");
		toggleEl.onClickEvent(() => toggleEl.classList.toggle("is-enabled"));

		if (initialState == true) {
			toggleEl.classList.add("is-enabled");
		}

		const labelEl = toggleContainerEl.createEl("span");
		labelEl.classList.add("emotion-toggle-label");
		labelEl.textContent = text;

		return toggleContainerEl;
	}

	getFinalText(text: string): string {
		if (this.state.capitalize) text = this.capitalize(text);
		if (this.state.addAsTag) text = `#${text}`;
		if (this.state.addAsLink) text = `[[${text}]]`;
		if (this.state.useCommaInSeparator) text = text + ", ";
		text = " " + text;
		return text;
	}

	capitalize(text: string): string {
		return text.charAt(0).toUpperCase() + text.slice(1);
	}
}
