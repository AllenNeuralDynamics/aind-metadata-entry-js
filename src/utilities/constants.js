import data_description from '../schemas/data_description_schema.json';
import procedures from '../schemas/procedures_schema.json';
import processing from '../schemas/processing_schema.json';
import subject from '../schemas/subject_schema.json';
import ephys_session from '../schemas/ephys_session_schema.json';
import ephys_rig from '../schemas/ephys_rig_schema.json';
import imaging_instrument from '../schemas/instrument_schema.json';
import ophys_rig from '../schemas/ophys_rig_schema.json';
import ophys_session from '../schemas/ophys_session_schema.json';
import imaging_acquisition from '../schemas/acquisition_schema.json';

const schema_map = {
    'data description': data_description,
    'procedures': procedures,
    'processing': processing,
    'subject': subject,
    'ephys session': ephys_session,
    'ephys rig': ephys_rig,
    'imaging instrument': imaging_instrument,
    'ophys rig': ophys_rig,
    'ophys session': ophys_session,
    'imaging acquisition': imaging_acquisition
}

export default schema_map; 
