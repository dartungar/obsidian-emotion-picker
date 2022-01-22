import {
	App,
	Modal,
	MarkdownView,
	Notice,
	EditorPosition,
	Editor,
} from "obsidian";
import { Emotions } from "./emotions/Emotions";
import { EmotionSection } from "./emotions/EmotionSection";

export class EmotionPickerModal extends Modal {
	app: App;
	content: HTMLElement;
	emotions: Emotions;
	useCommaInSeparator = false;
	addAsLink = false;
	addAsTag = false;
	editor: Editor;
	initialCursorPosition: EditorPosition;

	constructor(app: App) {
		super(app);
		this.app = app;
		this.emotions = new Emotions();
	}

	onOpen() {
		const { contentEl } = this;
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
		headingEl.innerText = "How do you feel?";
	}

	generateToggles(): void {
		const togglesEl = this.contentEl.createDiv();

		const useCommaToggleEl = this.generateToggleElement(
			togglesEl,
			"add comma after"
		);
		useCommaToggleEl.onClickEvent(() => {
			this.useCommaInSeparator = !this.useCommaInSeparator;
		});

		const addAsLinkToggleEl = this.generateToggleElement(
			togglesEl,
			"add as [[link]]"
		);
		addAsLinkToggleEl.onClickEvent(() => {
			this.addAsLink = !this.addAsLink;
		});

		const addAsTagToggleEl = this.generateToggleElement(
			togglesEl,
			"add as #tag"
		);
		addAsTagToggleEl.onClickEvent(() => {
			this.addAsTag = !this.addAsTag;
		});
	}

	generateContentFromEmotions(): void {
		const contentEl = this.contentEl.createDiv();

		this.emotions.emotionSections.forEach((section) => {
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
			console.log(this.initialCursorPosition.ch);
		}

		new Notice(`Inserted '${text}'.`);
	}

	generateToggleElement(baseEl: HTMLElement, text: string): HTMLDivElement {
		const toggleContainerEl = baseEl.createDiv();
		const toggleEl = toggleContainerEl.createDiv();
		toggleEl.classList.add("checkbox-container");
		toggleEl.onClickEvent(() => toggleEl.classList.toggle("is-enabled"));

		const labelEl = toggleContainerEl.createEl("span");
		labelEl.classList.add("emotion-toggle-label");
		labelEl.textContent = text;

		return toggleContainerEl;
	}

	getFinalText(text: string): string {
		text = " " + text;
		// TODO: various options like [[text]], #text
		if (this.addAsTag) text = `#${text}`;
		if (this.addAsLink) text = `[[${text}]]`;
		if (this.useCommaInSeparator) text = text + ", ";
		return text;
	}
}
