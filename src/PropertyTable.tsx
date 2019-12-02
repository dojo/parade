import { create, tsx } from '@dojo/framework/core/vdom';
import HorizontalRule from './HorizontalRule';
import RoundedBox from './RoundedBox';
import { PropertyInterface } from './properties.block';

interface PropertyTableProperties {
	props?: PropertyInterface[];
}

const factory = create().properties<PropertyTableProperties>();

export default factory(function PropertyTable({ properties }) {
	const { props } = properties();
	if (!props) {
		return null;
	}
	return (
		<virtual>
			<HorizontalRule />
			<h2 classes="text-2xl mb-4">Properties</h2>
			<RoundedBox>
				<table>
					<thead>
						<tr>
							<th classes="px-4 py-2 border-r border-b border-gray-400 text-sm font-semibold text-gray-700 p-2 bg-gray-100 rounded-tl-lg">
								Name
							</th>
							<th classes="px-4 py-2 border-r border-b border-gray-400 text-sm font-semibold text-gray-700 p-2 bg-gray-100">
								Type
							</th>
							<th classes="px-4 py-2 border-b border-gray-400 text-sm font-semibold text-gray-700 p-2 bg-gray-100 rounded-tr-lg">
								Description
							</th>
						</tr>
					</thead>
					<tbody>
						{props.map((prop) => {
							return (
								<tr>
									<td classes="px-4 py-2 text-sm">{`${prop.name}${
										prop.optional ? '?' : ''
									}`}</td>
									<td classes="px-4 py-2 text-sm">{prop.type}</td>
									<td classes="px-4 py-2 text-sm">{prop.description}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</RoundedBox>
		</virtual>
	);
});
