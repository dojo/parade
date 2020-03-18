import * as path from 'canonical-path';
import {
	Project,
	MethodSignature,
	PropertySignature,
	Type,
	SyntaxKind,
	VariableDeclaration,
	ExportAssignment,
	CallExpression,
	ObjectFlags,
	ClassDeclaration
} from 'ts-morph';

function getInterfaceName(value: string, type = 'Properties') {
	const result = value.replace(/-([a-z])/g, function(g) {
		return g[1].toUpperCase();
	});
	return `${result.charAt(0).toUpperCase() + result.slice(1)}${type}`;
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

function getPropertiesOfFactory(factory: CallExpression) {
	const factoryIdentifier = factory.getChildAtIndex(0);
	const symbol = factoryIdentifier.getSymbol();
	if (symbol) {
		const type = symbol.getTypeAtLocation(factoryIdentifier);
		const callSignatures = type.getCallSignatures();
		if (callSignatures.length > 0) {
			const parameters = callSignatures[0].getParameters();

			if (parameters.length) {
				const callback = parameters[0].getTypeAtLocation(factoryIdentifier);
				if (callback && callback.getObjectFlags() & ObjectFlags.Reference) {
					const typeArguments = callback.getTypeArguments();

					if (typeArguments) {
						return typeArguments[0];
					}
				}
			}
		}
	}

	return undefined;
}

export default function(config: { [index: string]: string }) {
	const project = new Project({
		tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json')
	});

	return Object.keys(config).reduce((props, widgetName): {
		[index: string]: PropertyInterface[];
	} => {
		let propsType: Type | undefined = undefined;

		const filename = config[widgetName];
		const sourceFile = project.getSourceFile(filename);
		if (!sourceFile) {
			return props;
		}

		const defaultExport = sourceFile.getDefaultExportSymbol();
		if (!defaultExport) {
			return props;
		}

		const defaultExportType = defaultExport.getTypeAtLocation(sourceFile);
		if (!defaultExportType) {
			return props;
		}

		sourceFile.forEachDescendant((node) => {
			let initializer: any;
			const nodeSymbol = node.getSymbol();

			if (node.getKind() === SyntaxKind.VariableDeclaration && nodeSymbol) {
				if (
					defaultExportType.compilerType ===
					nodeSymbol.getTypeAtLocation(node).compilerType
				) {
					initializer = (node as VariableDeclaration).getInitializer();
				}
			} else if (
				node.getKind() === SyntaxKind.ClassDeclaration &&
				nodeSymbol &&
				defaultExportType.compilerType === nodeSymbol.getTypeAtLocation(node).compilerType
			) {
				const heritageClauses = (node as ClassDeclaration).getHeritageClauses();

				if (heritageClauses.length > 0) {
					const heritageClause = heritageClauses[0];

					const typeNodes = heritageClause.getTypeNodes();

					if (typeNodes.length > 0) {
						const typeArguments = typeNodes[0].getTypeArguments();

						if (typeArguments.length) {
							const widgetSymbol = typeArguments[0].getChildAtIndex(0).getSymbol();

							if (widgetSymbol) {
								propsType = widgetSymbol.getDeclaredType();
							}
						}
					}
				}
			} else if (node.getKind() === SyntaxKind.ExportAssignment) {
				initializer = (node as ExportAssignment).getExpression();
			}

			if (initializer && initializer.getKind() === SyntaxKind.CallExpression) {
				propsType = getPropertiesOfFactory(initializer);
			}
		});

		if (!propsType) {
			const propsInterfaceTypeName = getInterfaceName(widgetName);
			const propsInterface =
				sourceFile.getInterface(propsInterfaceTypeName) ||
				sourceFile.getTypeAlias(propsInterfaceTypeName);

			if (!propsInterface) {
				console.warn(
					`could not find interface for ${widgetName} ${getInterfaceName(widgetName)}`
				);
				return props;
			}

			propsType = propsInterface.getType();
		}

		let properties = getWidgetProperties(propsType);
		const unionTypes = propsType.getUnionTypes();
		if (unionTypes && unionTypes.length) {
			unionTypes.forEach((unionType) => {
				const unionProperties = getWidgetProperties(unionType);
				unionProperties.forEach((unionProperty) => {
					const property = properties.find((prop) => prop.name === unionProperty.name);
					if (property) {
						const types = unionProperty.type.split('|');
						types.forEach((type) => {
							if (property.type.indexOf(type) === -1) {
								property.type = `${type} | ${property.type}`;
							}
						});
					} else {
						properties.push(unionProperty);
					}
				});
			});
		}
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

		const childrenInterfaceTypeName = getInterfaceName(widgetName, 'Children');
		const childrenInterface =
			sourceFile.getInterface(childrenInterfaceTypeName) ||
			sourceFile.getTypeAlias(childrenInterfaceTypeName);
		let children = childrenInterface && getWidgetProperties(childrenInterface.getType());
		return { ...props, [widgetName]: { properties, children } };
	}, {});
}
