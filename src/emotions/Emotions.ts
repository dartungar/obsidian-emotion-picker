import { EmotionSection } from "./EmotionSection";
import { sectionsData } from "./emotionsData";

export class Emotions {
	emotionSections: EmotionSection[] = [];

	constructor() {
		this.populateSections();
	}

	populateSections(): void {
		sectionsData.forEach((s) => {
			const section = new EmotionSection();
			section.name = s.name;
			section.color = s.color;
			section.emotions = s.emotions;
			this.emotionSections.push(section);
		});
	}
}
