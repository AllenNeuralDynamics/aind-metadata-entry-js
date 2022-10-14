import {checkDraft2020, preProcessing} from './schemaHandlers';

const testSchema1 = ({
    $schema: "https://json-schema.org/draft/2020-12/schema", 
    type: "object",
    properties: {
        describedBy: {
            type: "string",
            const: "https://github.com/AllenNeuralDynamics/data_schema/blob/main/schemas/subject.json",
            description: "The URL reference to the schema.",
            title: "Described by"
        }
    }
});

const testSchema2 = ({
    $schema: "https://json-schema.org/draft/2020-12/schema#"
});

const testSchema3 = ({
    $schema: "http://json-schema.org/draft-07/schema#"
});

const testSchema4 = ({
    title: "sample schema",
    type: "object",
    properties: {
        name: {
            title: "Full Name",
            type: "string"
        },
        email: {
            title: "Email Address",
            type: "string"
        }
    },
    required: [
        "name"
    ]
});

test("Checks checkDraft2020 returns true for test schemas with draft 2020", () => {
    expect(checkDraft2020(testSchema1)).toBe(true);
    expect(checkDraft2020(testSchema2)).toBe(true);
});

test("Checks checkDraft2020 returns false for draft 7 schema", () => {
    expect(checkDraft2020(testSchema3)).toBe(false);
})

test("Checks preProcessing modifies draft 2020 schema", () => {
    const processedSchema1 = preProcessing(testSchema1);
    expect(processedSchema1.$schema).toBe(undefined);
    expect(processedSchema1.properties.describedBy.default).toBe(testSchema1.properties.describedBy.const);
    expect(processedSchema1.properties.describedBy.readOnly).toBe(true);
})

test("Checks preProcessing does not modify sample schema", () => {
    const processedSchema = preProcessing(testSchema4);
    expect(processedSchema).toEqual(testSchema4);
})
