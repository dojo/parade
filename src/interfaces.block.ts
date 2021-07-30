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
	ClassDeclaration,
	PropertyAssignment,
	TypeFormatFlags
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
	initializer?: string;
}

function format(prop: MethodSignature | PropertySignature | PropertyAssignment): PropertyInterface {
	return {
		name: prop.getName(),
		type: prop.getType().getText(prop),
		optional: prop.hasQuestionToken() || false,
		description: (prop as PropertySignature).getJsDocs
			? (prop as PropertySignature).getJsDocs()[0] &&
			  (prop as PropertySignature).getJsDocs()[0].getComment()
			: (prop as PropertyAssignment).getInitializerIfKind(SyntaxKind.StringLiteral) &&
			  (prop as PropertyAssignment)
					.getInitializerIfKind(SyntaxKind.StringLiteral)!
					.getLiteralValue()
	};
}

function isSignatureOrAssignment(
	node: any
): node is MethodSignature | PropertySignature | PropertyAssignment {
	return Boolean(node && node.getName && node.getType && node.hasQuestionToken);
}

function getPropertyDetails(propsType: Type): PropertyInterface[] {
	return propsType
		.getProperties()
		.map((symbol) => symbol.getDeclarations()[0])
		.filter(isSignatureOrAssignment)
		.map(format);
}

function getTypeFromFactory(factory: CallExpression, children = false) {
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
						return children ? typeArguments[1] : typeArguments[0];
					}
				}
			}
		}
	}
}

function parseI18n(node: CallExpression) {
	const propertyAccess = node.getChildAtIndex(0);
	const functionSymbol =
		propertyAccess &&
		propertyAccess.getKind() === SyntaxKind.PropertyAccessExpression &&
		propertyAccess.getSymbol();
	const functionType = functionSymbol && functionSymbol.getTypeAtLocation(node);
	const callType = functionType && functionType.getCallSignatures()[0];
	const argument = callType && callType.getParameters()[0];
	const parameterType = argument && argument.getTypeAtLocation(node);
	const parameterSymbol = parameterType && parameterType.getSymbol();
	const parameterSymbolName = parameterSymbol && parameterSymbol.getName();
	const returnType = callType && callType.getReturnType();
	const returnAliasSymbol = returnType && returnType.getAliasSymbol();
	const returnAliasName = returnAliasSymbol && returnAliasSymbol.getName();
	if (
		parameterType &&
		parameterSymbolName === 'Bundle' &&
		returnAliasName === 'LocalizedMessages'
	) {
		const argument = node.getArguments()[0];
		const argumentType = argument && argument.getType();
		const messages = argumentType && argumentType.getProperty('messages');
		const locales = argumentType && argumentType.getProperty('locales');
		const messageProps = messages && messages.getTypeAtLocation(node);
		const localeProps = locales && locales.getTypeAtLocation(node);
		return {
			messages: messageProps && getPropertyDetails(messageProps),
			locales: localeProps && getPropertyDetails(localeProps)
		};
	}

	return { messages: undefined, locales: undefined };
}

export default function(config: { [index: string]: string }) {
	const project = new Project({
		tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json')
	});

	return Object.keys(config).reduce((props, widgetName): {
		[index: string]: PropertyInterface[];
	} => {
		let propsType: Type | undefined = undefined;
		let childrenType: Type | undefined = undefined;
		let messages: PropertyInterface[] = [];
		let locales: PropertyInterface[] = [];

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

		let initializer: any;
		sourceFile.forEachDescendant((node) => {
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
							const widgetChildrenSymbol =
								typeArguments[1] && typeArguments[1].getChildAtIndex(0).getSymbol();

							if (widgetSymbol) {
								propsType = widgetSymbol.getDeclaredType();
							}

							if (widgetChildrenSymbol) {
								childrenType = widgetChildrenSymbol.getDeclaredType();
							}
						}
					}
				}
			} else if (node.getKind() === SyntaxKind.ExportAssignment) {
				initializer = (node as ExportAssignment).getExpression();
			} else if (node.getKind() === SyntaxKind.CallExpression) {
				const parsedI18n = parseI18n(node as CallExpression);
				if (parsedI18n.messages) {
					messages.push(...parsedI18n.messages);
				}

				if (parsedI18n.locales) {
					locales = parsedI18n.locales;
				}
			}

			if (initializer && initializer.getKind() === SyntaxKind.CallExpression) {
				propsType = getTypeFromFactory(initializer);
				childrenType = getTypeFromFactory(initializer, true);
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

		if (!childrenType) {
			const childrenInterfaceTypeName = getInterfaceName(widgetName, 'Children');
			const childrenInterface =
				sourceFile.getInterface(childrenInterfaceTypeName) ||
				sourceFile.getTypeAlias(childrenInterfaceTypeName);
			if (childrenInterface) {
				childrenType = childrenInterface.getType();
			}
		}

		let properties = getPropertyDetails(propsType);
		const children: PropertyInterface[] = [];
		const unionTypes = propsType.getUnionTypes();

		const childUnionTypes = childrenType ? childrenType.getUnionTypes() : [];
		if (childrenType && !childUnionTypes.length) {
			childUnionTypes.push(childrenType);
		}

		function parseUnionType(unionProperty: PropertyInterface, props: any[]) {
			const property = props.find((prop) => prop.name === unionProperty.name);
			if (property) {
				const types = unionProperty.type.split('|');
				types.forEach((type) => {
					if (property.type.indexOf(type) === -1) {
						property.type = `${type} | ${property.type}`;
					}
				});
			} else {
				props.push(unionProperty);
			}
		}

		if (unionTypes && unionTypes.length) {
			unionTypes.forEach((unionType) => {
				const unionProperties = getPropertyDetails(unionType);
				unionProperties.forEach((type) => parseUnionType(type, properties));
			});
		}
		childUnionTypes.forEach((unionType) => {
			const text = unionType.getText(undefined, TypeFormatFlags.None);
			if (
				unionType.isArray() ||
				!unionType.isObject() ||
				(text &&
					(text.startsWith('WNode') ||
						text.startsWith('VNode') ||
						text.startsWith('DNode')))
			) {
				children.push({
					name: '----',
					type: text,
					optional: false
				});
			} else {
				const callSignatures = unionType.getCallSignatures();
				callSignatures.forEach((signature) => {
					children.push({
						name: '----',
						type: signature.getDeclaration().getFullText(),
						optional: false
					});
				});
				const unionProperties = getPropertyDetails(unionType);
				unionProperties.forEach((type) => parseUnionType(type, children));
			}
		});

		function compareProperties(a: PropertyInterface, b: PropertyInterface) {
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
		}
		properties.sort(compareProperties);
		messages.sort(compareProperties);
		locales.sort(compareProperties);
		children.sort(compareProperties);

		return { ...props, [widgetName]: { properties, children, messages, locales } };
	}, {});
}
