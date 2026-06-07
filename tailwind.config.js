/** @type {import('tailwindcss').Config} */
module.exports = {
	// NOTE: Update this to include the paths to all files that contain Nativewind classes.
	content: [
		"./App.tsx",
		"./components/**/*.{js,jsx,ts,tsx}",
		"./app/**/*.{js,jsx,ts,tsx}",
	],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				app: {
					background: "#F7F6F3",
					surface: "#FFFFFF",
					surfaceMuted: "#F9F9F8",
					border: "#EAEAEA",
					text: "#111111",
					textMuted: "#787774",
					primary: "#4F378A",
					primaryPastel: "#F2EDFA",
					primaryPastelText: "#5C4596",
					accentBlue: "#E1F3FE",
					accentBlueText: "#1F6C9F",
					accentGreen: "#EDF3EC",
					accentGreenText: "#346538",
					accentRed: "#FDEBEC",
					accentRedText: "#9F2F2D",
					accentYellow: "#FBF3DB",
					accentYellowText: "#956400",
				},
			},
		},
	},
	plugins: [],
};
