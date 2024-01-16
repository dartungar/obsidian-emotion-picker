import { DEFAULT_EMOTIONS, getEmotions } from "../emotions/index";
import { EmotionSection } from "../emotions/EmotionSection";

export type EmotionPickerLocaleOverride = "en" | string;

export interface EmotionPickerSettings {
	modalHeaderText: string;
	useCommaInSeparator: boolean;
	addAsLink: boolean;
	addAsTag: boolean;
	capitalize: boolean;
	setEmotions: (locale: string) => EmotionSection[];
	emotions: EmotionSection[];
	locale: EmotionPickerLocaleOverride;
}

export class DefaultSettings implements EmotionPickerSettings {
	modalHeaderText = "What do you feel?";
	useCommaInSeparator = false;
	addAsLink = false;
	addAsTag = false;
	capitalize = false;
	setEmotions = getEmotions;
	emotions = DEFAULT_EMOTIONS;
	locale: "en";
}
