import {preProcessing} from './schemaHandlers.js';

const testSchema1 = ({
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
    title: "sample schema",
    type: "object",
    properties: {
        name: {
            title: "Full Name",
            type: "string",
        },
        email: {
            title: "Email Address",
            type: "string"
        },
        parameters: {
            title: "parameters",
            type: "strobjecting",
            default: {}
        }
    },
    required: [
        "name"
    ]
});

const testSchema3 = ({
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
        }, 
        resume: {
            title: "Resume",
            type: "object",
            properties: {
                education: {
                    title: "Education",
                    const: "Farmington University",
                    type: "string"
                },
                past_experiences: {
                    title: "Past Experiences",
                    type: "array",
                    items: {
                        $ref: "#/definitions/PastExperience"
                    }
                }
            }
        }
    },
    definitions: {
        PastExperience: {
            title: "PastExperience",
            description: "Description of Past Experience",
            type: "object",
            key_points: {
                title: "Key Points",
                description: "Info about job experience (ex: company name, duration, etc)",
                type: "object",
                default: {}
            }
        }
    },
    required: [
        "name"
    ]
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

test("Checks preProcessing modifies const schema", () => {
    const processedSchema1 = preProcessing(testSchema1);
    expect(processedSchema1.properties.describedBy.default).toBe(testSchema1.properties.describedBy.const);
    expect(processedSchema1.properties.describedBy.readOnly).toBe(true);
})

test("Checks preProcessing modifies dictionary additional properties", () => {
    const processedSchema2 = preProcessing(testSchema2);
    expect(processedSchema2.properties.parameters.additionalProperties).toStrictEqual({"type": "string"})
})

test("Checks preProcessing recurses through nested schema as expected", () => {
    const processedSchema3 = preProcessing(testSchema3);
    expect(processedSchema3.properties.resume.properties.education.readOnly).toBe(true);
    expect(processedSchema3.properties.resume.properties.education.default).toBe(testSchema3.properties.resume.properties.education.const);
    expect(processedSchema3.definitions.PastExperience.key_points.additionalProperties).toStrictEqual({"type": "string"})
})

test("Checks preProcessing does not modify sample schema", () => {
    const processedSchema = preProcessing(testSchema4);
    expect(processedSchema).toEqual(testSchema4);
})
