import { create, tsx } from '@dojo/framework/core/vdom';

const factory = create().properties<{ widgetReadmes: any; config: any }>();

export default factory(function Landing({ properties }) {
	const { widgetReadmes, config } = properties();
	const readmeContent = widgetReadmes[config.home];
	return <div innerHTML={readmeContent} />;
});
