import { create, tsx } from '@dojo/framework/core/vdom';

export interface NoLabelInputProperties {
	value: string;
	onValue: (value: string) => void;
	type: 'standard';
}

export interface LabelInputProperties {
	value: string;
	onValue: (value: string) => void;
	label: string;
	type: 'labeled';
}

export type InputProperties = NoLabelInputProperties | LabelInputProperties;

function isLabel(props: any): props is LabelInputProperties {
	return Boolean(props.label);
}

const factory = create().properties<InputProperties>();
export default factory(function Input({ properties }) {
	const props = properties();
	if (isLabel(props)) {
		return (
			<label>
				{props.label}
				<input
					type="text"
					value={props.value}
					oninput={(event) => {
						const target = event.target as HTMLInputElement;
						props.onValue(target.value);
					}}
				/>
			</label>
		);
	}
	return (
		<input
			type="text"
			value={props.value}
			oninput={(event) => {
				const target = event.target as HTMLInputElement;
				props.onValue(target.value);
			}}
		/>
	);
});
