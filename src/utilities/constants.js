import data_description from '../schemas/data-description-schema.json';
import procedures from '../schemas/procedures-schema.json';
import processing from '../schemas/processing-schema.json';
import subject from '../schemas/subject-schema.json';
<<<<<<< HEAD
import ephys_session from '../schemas/ephys/ephys-session-schema.json';
import ephys_rig from '../schemas/ephys/ephys-rig-schema.json';
import imaging_instrument from '../schemas/imaging/imaging-instrument-schema.json';
import ophys_rig from '../schemas/ophys/ophys-rig-schema.json';
import ophys_session from '../schemas/ophys/ophys-session-schema.json';
import imaging_acquisition from '../schemas/imaging/imaging-acquisition-schema.json';
import sample from '../schemas/sample-schema.json';
=======
import ephys_session from '../schemas/ephys-session-schema.json';
import ephys_rig from '../schemas/ephys-rig-schema.json';
import imaging_instrument from '../schemas/imaging-instrument-schema.json';
import ophys_rig from '../schemas/ophys-rig-schema.json';
import ophys_session from '../schemas/ophys-session-schema.json';
import imaging_acquisition from '../schemas/imaging-acquisition-schema.json';
>>>>>>> origin/main

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
<<<<<<< HEAD
    'imaging acquisition': imaging_acquisition, 
    'sample': sample
=======
    'imaging acquisition': imaging_acquisition
>>>>>>> origin/main
}

export default schema_map; 
