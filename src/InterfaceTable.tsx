import { create, tsx } from '@dojo/framework/core/vdom';
import HorizontalRule from './HorizontalRule';
import RoundedBox from './RoundedBox';
import { PropertyInterface } from './interfaces.block';

interface InterfaceTableProperties {
	props?: PropertyInterface[];
	tableName?: string;
	descriptionLabel?: string;
	showTypes?: boolean;
	showComments?: boolean;
}

const factory = create().properties<InterfaceTableProperties>();

export default factory(function InterfaceTable({ properties }) {
	const {
		props,
		tableName = 'Properties',
		descriptionLabel = 'Description',
		showTypes = true,
		showComments = true
	} = properties();
	if (!props) {
		return null;
	}
	return (
		<virtual>
			<HorizontalRule />
			<h2 classes="text-2xl mb-4">{tableName}</h2>
			<RoundedBox>
				<table classes="table">
					<thead>
						<tr>
							<th classes="px-4 py-2 border-r border-b border-gray-400 text-sm font-semibold text-gray-700 p-2 bg-gray-100 rounded-tl-lg">
								Name
							</th>
							{showTypes && (
								<th classes="px-4 py-2 border-r border-b border-gray-400 text-sm font-semibold text-gray-700 p-2 bg-gray-100">
									Type
								</th>
							)}
							{showComments && (
								<th classes="px-4 py-2 border-b border-gray-400 text-sm font-semibold text-gray-700 p-2 bg-gray-100 rounded-tr-lg">
									{descriptionLabel}
								</th>
							)}
						</tr>
					</thead>
					<tbody>
						{props.map((prop) => {
							return (
								<tr>
									<td classes="px-4 py-2 text-sm">{`${prop.name}${
										prop.optional ? '?' : ''
									}`}</td>
									{showTypes && <td classes="px-4 py-2 text-sm">{prop.type}</td>}
									{showComments && (
										<td classes="px-4 py-2 text-sm">{prop.description}</td>
									)}
								</tr>
							);
						})}
					</tbody>
				</table>
			</RoundedBox>
		</virtual>
	);
});
