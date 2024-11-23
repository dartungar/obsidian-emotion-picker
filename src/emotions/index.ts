import { EmotionSection } from "./EmotionSection";
import { DEFAULT_EMOTIONS } from "./DefaultEmotions";
import { DEFAULT_SWEDISH_EMOTIONS } from "./locale/sv/DefaultEmotions";
import { DEFAULT_SPANISH_EMOTIONS } from "./locale/es/DefaultEmotions";

const getEmotions = (locale: string): EmotionSection[] => {
	switch (locale) {
		case "sv":
			return DEFAULT_SWEDISH_EMOTIONS;
		case "es":
			return DEFAULT_SPANISH_EMOTIONS;
		default:
			return DEFAULT_EMOTIONS;
	}
};

export {
	DEFAULT_EMOTIONS,
	DEFAULT_SWEDISH_EMOTIONS,
	DEFAULT_SPANISH_EMOTIONS,
	EmotionSection,
	getEmotions,
};
