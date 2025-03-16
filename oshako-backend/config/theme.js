// File: config/theme.js
import { DefaultTheme } from 'react-native-paper';
import { THEME_COLORS } from './constants';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: THEME_COLORS.primary,
    accent: THEME_COLORS.secondary,
    background: THEME_COLORS.background,
    surface: THEME_COLORS.surface,
    error: THEME_COLORS.error,
    text: THEME_COLORS.text,
    disabled: THEME_COLORS.disabled,
    placeholder: THEME_COLORS.placeholder,
    backdrop: THEME_COLORS.backdrop,
  },
  roundness: 4,
  animation: {
    scale: 1.0,
  },
  fonts: {
    ...DefaultTheme.fonts,
    // You can customize fonts here if needed
  },
};

export default theme;
