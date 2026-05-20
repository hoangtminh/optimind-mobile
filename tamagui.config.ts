import { amber, amberDark, cyan, cyanDark } from "@tamagui/colors";
import {
	createV5Theme,
	defaultChildrenThemes,
	defaultConfig,
} from "@tamagui/config/v5";
import { createFont, createTamagui } from "tamagui";

const robotoFont = createFont({
	family: "Roboto",
	size: defaultConfig.fonts.body.size,
	lineHeight: defaultConfig.fonts.body.lineHeight,
	weight: defaultConfig.fonts.body.weight,
	letterSpacing: defaultConfig.fonts.body.letterSpacing,
	face: {
		400: { normal: "Roboto_400Regular" },
		700: { normal: "Roboto_700Bold" },
		800: { normal: "Roboto_900Black" },
	},
});

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
	fonts: {
		heading: robotoFont,
		body: robotoFont,
	},
	themes,
});
