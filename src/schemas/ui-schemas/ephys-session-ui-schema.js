import ObjectFieldTemplate from './ObjectFieldTemplate'

const uiSchema = {
    "probe_streams": {
      "items": {
            "probes": {
              "items": {
                    "targeted_ccf_coordinates": {
                        "ui:options": {
                            "orderable": false,
                            "removable": false,
                            "addable": false
                        },
                        "items": {
                            "ui:ObjectFieldTemplate": ObjectFieldTemplate, 
                            "value": {
                             "ui:placeholder": "0"
                            }
                        }
                    },
                    "targeted_lab_coordinates": {
                        "ui:options": {
                            "orderable": false,
                            "removable": false,
                            "addable": false
                        },
                        "items": {
                            "value": {
                             "ui:placeholder": "0"
                            }
                        }
                    }
                }
            }
        }
    }
}

export default uiSchema;
