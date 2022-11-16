const { MonoSchemaParser } = require("../mono-schema-parser");
const _ = require("lodash");

class AnyOfSchemaParser extends MonoSchemaParser {
  parse() {
    const ignoreTypes = [...this.config.jsPrimitiveTypes, this.config.Ts.Keyword.Any];
    const combined = _.map(this.schema.anyOf, (childSchema) =>
      this.schemaParser.getInlineParseContent(this.schemaUtils.makeAddRequiredToChildSchema(this.schema, childSchema)),
    );
    const filtered = this.schemaUtils.filterSchemaContents(combined, (content) => !ignoreTypes.includes(content));

    const type = this.config.Ts.UnionType(
      _.compact([
        ...filtered,
        filtered.length > 1 && this.config.Ts.ExpressionGroup(this.config.Ts.IntersectionType(filtered)),
      ]),
    );

    return this.schemaUtils.safeAddNullToType(this.schema, type);
  }
}

module.exports = { AnyOfSchemaParser };