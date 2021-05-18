import { Config, ConfigThemes } from '.';

export function getThemeFromConfig(config: Config): ConfigThemes {
	const { searchParams } = new URL(window.location.href);
	const themeParam = searchParams.get('theme');
	const theme = config.themes.find((theme) => theme.label === themeParam) || config.themes[0];
	return theme;
}
