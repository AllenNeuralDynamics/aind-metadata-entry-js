import ObjectFieldTemplate from './ObjectFieldTemplate'

const EphysSessionUISchema = {
    "data_streams": {
      "items": {
            "probes": {
              "items": {
                    "targeted_ccf_coordinates": {
                        "ui:ObjectFieldTemplate": ObjectFieldTemplate, 
                    },
                    "targeted_lab_coordinates": {
                        "ui:ObjectFieldTemplate": ObjectFieldTemplate, 
                    },
                    "manipulator_coordinates": {
                        "ui:ObjectFieldTemplate": ObjectFieldTemplate, 
                    }
                }
            },
            "lasers": {
                "items": {
                    "targeted_ccf_coordinates": {
                        "ui:ObjectFieldTemplate": ObjectFieldTemplate, 
                    },
                    "targeted_lab_coordinates": {
                        "ui:ObjectFieldTemplate": ObjectFieldTemplate,
                    },
                    "manipulator_coordinates": {
                        "ui:ObjectFieldTemplate": ObjectFieldTemplate, 
                    }
                }
            }
        }
    }
}

export default EphysSessionUISchema;
