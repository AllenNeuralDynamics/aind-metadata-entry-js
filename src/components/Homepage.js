import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; 

const Homepage = () => {
  /* Renders the Metadata Entry Home App and links the schema forms */
  return (
    <div>
      <h1>AIND MetaData Entry </h1>
      <Link to='/procedures'>Procedures Form</Link> | {" "}
      <Link to='/subject'>Subject Form</Link> | {" "}
      <Link to='/data_description'>Data Description Form</Link> | {" "}
      <Link to='/test'>Test Form</Link>

      </div>
  )
};

export default Homepage;
