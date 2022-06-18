import { DEFAULT_EMOTIONS } from "../emotions/DefaultEmotions";
import { EmotionSection } from "../emotions/EmotionSection";

export interface EmotionPickerSettings {
	modalHeaderText: string;
	useCommaInSeparator: boolean;
	addAsLink: boolean;
	addAsTag: boolean;
	capitalize: boolean;
	emotions: EmotionSection[]
}

export class DefaultSettings implements EmotionPickerSettings {
	modalHeaderText = "What do you feel?";
	useCommaInSeparator = false;
	addAsLink = false;
	addAsTag = false;
	capitalize = false;
	emotions = DEFAULT_EMOTIONS;
}
