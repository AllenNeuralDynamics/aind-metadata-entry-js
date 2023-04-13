const DataDescriptionUISchema = {
    "modality": {
        "items": {
            "ui:title": "modality 2",
            "ui:widget": "radio",
            "ui:options": {
                "enum_titles": [
                            {
                                "value": {
                                    "name": "Extracellular electrophysiology",
                                    "abbreviation": "ecephys" 
                                },
                                "label": "ecephys"
                            },
                            {
                                "value": {
                                    "name": "Selective plane illumination microscopy",
                                    "abbreviation": "SPIM"
                                },
                                "label": "SPIM"
                            },
                            {
                                "value": {
                                    "name": "Frame-projected independent-fiber photometry",
                                    "abbreviation": "FIP"
                                },
                                "label": "FIP"
                            },
                            {
                                "value": {
                                    "name": "Fluorescence micro-optical sectioning tomography",
                                    "abbreviation": "fMOST"
                                },
                                "label": "fMOST"
                            },
                            {
                                "value": {
                                    "name": "Hyperspectral fiber photometry",
                                    "abbreviation": "HSFP"
                                },
                                "label": "HSFP"
                            },
                            {
                                "value": {
                                    "name": "Magnetic resonance imaging",
                                    "abbreviation": "MRI"
                                },
                                "label": "MRI"
                            },
                            {
                                "value": {
                                    "name": "Optical physiology",
                                    "abbreviation": "ophys"
                                },
                                "label": "ophys"
                            }
                        ],
                    }
                }
            }
        }

        
    

export default DataDescriptionUISchema;