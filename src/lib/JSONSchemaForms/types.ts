import type { JSONType } from 'ajv/dist/compile/rules';

export interface BaseJSONSchemaField<T extends JSONType> {
	type: T;
	description?: string;
}

export type StringField = BaseJSONSchemaField<'string'>;
export type NumberField = BaseJSONSchemaField<'number'>;
export type IntegerField = BaseJSONSchemaField<'integer'>;
export type BooleanField = BaseJSONSchemaField<'boolean'>;
export type ObjectField = BaseJSONSchemaField<'object'> & JSONSchema;

export interface ArrayField extends BaseJSONSchemaField<'array'> {
	items: {
		type: JSONSchemaField;
	};
}

export type JSONSchemaField = StringField | NumberField | IntegerField | BooleanField | ObjectField | ArrayField;

export type JSONSchema = {
	properties: Record<string, JSONSchemaField>;
	required?: Array<string>;
};
