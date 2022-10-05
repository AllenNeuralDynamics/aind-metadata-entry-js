import data_description from '../schemas/data-description-schema.json';
import procedures from '../schemas/procedures-schema.json';
import processing from '../schemas/processing-schema.json';
import subject from '../schemas/subject-schema.json';

const schema_map = {
    'data description': data_description,
    'procedures': procedures,
    'processing': processing,
    'subject': subject
}

export default schema_map; 
