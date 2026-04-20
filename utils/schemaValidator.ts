import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

/**
 * Schema Validator - wraps Ajv for contract testing.
 *
 * Validates API responses against JSON schemas to catch breaking changes
 * to response structure automatically.
 */
class SchemaValidator {
  private readonly ajv: Ajv;
  private readonly validators: Map<string, ValidateFunction> = new Map();

  constructor() {
    this.ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(this.ajv);
  }

  /**
   * Validates data against a schema. Caches compiled validators for reuse.
   *
   * @param schemaName - Identifier for caching
   * @param schema - JSON schema object
   * @param data - Response data to validate
   * @throws Error with details if validation fails
   */
  validate(schemaName: string, schema: object, data: unknown): void {
    let validator = this.validators.get(schemaName);
    if (!validator) {
      validator = this.ajv.compile(schema);
      this.validators.set(schemaName, validator);
    }

    const isValid = validator(data);
    if (!isValid) {
      const errors = validator.errors
        ?.map(e => `  - ${e.instancePath || 'root'}: ${e.message}`)
        .join('\n');
      throw new Error(`Schema validation failed for '${schemaName}':\n${errors}`);
    }
  }
}

export const schemaValidator = new SchemaValidator();
