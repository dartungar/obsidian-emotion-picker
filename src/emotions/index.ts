import { EmotionSection } from "./EmotionSection";
import { DEFAULT_EMOTIONS } from "./DefaultEmotions";
import { DEFAULT_SWEDISH_EMOTIONS } from "./locale/sv/DefaultEmotions";

const getEmotions = (locale: string): EmotionSection[] => {
	switch (locale) {
		case "sv":
			return DEFAULT_SWEDISH_EMOTIONS;
		default:
			return DEFAULT_EMOTIONS;
	}
};

export {
	DEFAULT_EMOTIONS,
	DEFAULT_SWEDISH_EMOTIONS,
	EmotionSection,
	getEmotions,
};
