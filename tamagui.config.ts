import { amber, amberDark, cyan, cyanDark } from "@tamagui/colors";
import {
	createV5Theme,
	defaultChildrenThemes,
	defaultConfig,
} from "@tamagui/config/v5";
import { createTamagui } from "tamagui";

const themes = createV5Theme({
	childrenThemes: {
		// include defaults (blue, red, green, yellow, etc.)
		...defaultChildrenThemes,
		// add new colors
		cyan: { light: cyan, dark: cyanDark },
		amber: { light: amber, dark: amberDark },
	},
});

export const config = createTamagui({
	...defaultConfig,
	themes,
});
