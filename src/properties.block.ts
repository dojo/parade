import * as path from 'canonical-path';
import { Project, MethodSignature, PropertySignature, Type } from 'ts-morph';

function getPropertyInterfaceName(value: string) {
	const result = value.replace(/-([a-z])/g, function(g) {
		return g[1].toUpperCase();
	});
	return `${result.charAt(0).toUpperCase() + result.slice(1)}Properties`;
}

export interface PropertyInterface {
	name: string;
	type: string;
	optional: boolean;
	description?: string;
}

function format(prop: MethodSignature | PropertySignature): PropertyInterface {
	return {
		name: prop.getName(),
		type: prop.getType().getText(prop),
		optional: prop.hasQuestionToken() || false,
		description: prop.getJsDocs()[0] && prop.getJsDocs()[0].getComment()
	};
}

function isSignature(node: any): node is MethodSignature | PropertySignature {
	return Boolean(node && node.getName && node.getType && node.hasQuestionToken && node.getJsDocs);
}

function getWidgetProperties(propsType: Type): PropertyInterface[] {
	return propsType
		.getProperties()
		.map((symbol) => symbol.getDeclarations()[0])
		.filter(isSignature)
		.map(format);
}

export default function(config: { [index: string]: string }) {
	const project = new Project({
		tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json')
	});

	return Object.keys(config).reduce((props, widgetName): {
		[index: string]: PropertyInterface[];
	} => {
		const filename = config[widgetName];
		const sourceFile = project.getSourceFile(filename);
		if (!sourceFile) {
			return props;
		}
		const propsInterface = sourceFile.getInterface(getPropertyInterfaceName(widgetName));
		if (!propsInterface) {
			console.warn(
				`could not find interface for ${widgetName} ${getPropertyInterfaceName(widgetName)}`
			);
			return props;
		}
		let properties = getWidgetProperties(propsInterface.getType());
		properties.sort((a, b) => {
			if (a.optional && !b.optional) {
				return 1;
			}
			if (!a.optional && b.optional) {
				return -1;
			}
			if (a.name < b.name) {
				return -1;
			}
			if (a.name > b.name) {
				return 1;
			}
			return 0;
		});
		return { ...props, [widgetName]: properties };
	}, {});
}
