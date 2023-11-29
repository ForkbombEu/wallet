import type { JSONType } from 'ajv/dist/compile/rules';

export interface BaseSchema<T extends JSONType> {
	type: T;
	description?: string;
}

export type StringSchema = BaseSchema<'string'>;
export type NumberSchema = BaseSchema<'number'>;
export type IntegerSchema = BaseSchema<'integer'>;
export type BooleanSchema = BaseSchema<'boolean'>;

export type ObjectSchema = BaseSchema<'object'> & {
	properties: Record<string, JSONSchema>;
	required?: Array<string>;
};

export type ArraySchema = BaseSchema<'array'> & {
	items: JSONSchema;
};

export type DateSchema = BaseSchema<'string'> & {
	format: 'date';
};

export type JSONSchema =
	| StringSchema
	| NumberSchema
	| IntegerSchema
	| BooleanSchema
	| ObjectSchema
	| ArraySchema
	| DateSchema;
