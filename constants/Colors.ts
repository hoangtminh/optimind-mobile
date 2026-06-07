import { Theme } from "./Theme";

const tintColorLight = Theme.primary;
const tintColorDark = '#fff';

export default {
  light: {
    text: Theme.text,
    background: Theme.background,
    tint: tintColorLight,
    tabIconDefault: Theme.textMuted,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};
