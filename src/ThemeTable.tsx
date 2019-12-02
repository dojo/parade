import { create, tsx } from '@dojo/framework/core/vdom';
import HorizontalRule from './HorizontalRule';
import RoundedBox from './RoundedBox';

interface ThemeTableProperties {
	themes?: { [index: string]: string };
}

const factory = create().properties<ThemeTableProperties>();

export default factory(function ThemeTable({ properties }) {
	const { themes } = properties();
	if (!themes) {
		return null;
	}
	return (
		<virtual>
			<HorizontalRule />
			<h2 classes="text-2xl mb-4">Theme</h2>
			<RoundedBox>
				<table>
					<thead>
						<tr>
							<th classes="px-4 py-2 border-r border-b border-gray-400 text-sm font-semibold text-gray-700 p-2 bg-gray-100 rounded-tl-lg">
								Name
							</th>
							<th classes="px-4 py-2 border-b border-gray-400 text-sm font-semibold text-gray-700 p-2 bg-gray-100 rounded-tr-lg">
								Description
							</th>
						</tr>
					</thead>
					<tbody>
						{Object.keys(themes).map((key) => {
							return (
								<tr>
									<td classes="px-4 py-2 text-sm">{key}</td>
									<td classes="px-4 py-2 text-sm">{themes[key]}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</RoundedBox>
		</virtual>
	);
});
