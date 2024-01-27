import { render, screen, fireEvent } from "@testing-library/react";
import Dropdowns from "./Dropdowns";
import sampleSchemaList from '../testing/sample-schema-list.json';
import sampleSortedVersionListInstrument from '../testing/sample-sorted-version-list-instrument.json';

const nullCallback = () => { }

describe("Dropdowns component", () => {
  it("renders only schema type selection dropdown on default", () => {
    render(<Dropdowns
      schemaList={sampleSchemaList}
    />);
    expect(screen.getByTitle('Select a schema')).toBeInTheDocument();
    expect(screen.queryByTitle('Select a version')).toBeNull();
  })

  it("renders schema version selection dropdown when a schema type is chosen", () => {
    render(<Dropdowns
      ParentTypeCallback={nullCallback}
      schemaList={sampleSchemaList}
    />);
    fireEvent.change(screen.getByTitle('Select a schema'), { target: { value: 'instrument' } });
    expect(screen.getByTitle('Select a version')).toBeInTheDocument();
  })

  it("has schema versions sorted by latest-first semantic version", () => {
    render(<Dropdowns
      ParentTypeCallback={nullCallback}
      schemaList={sampleSchemaList}
    />);
    fireEvent.change(screen.getByTitle('Select a schema'), { target: { value: 'instrument' } });

    const schemaVersionsList = [...screen.getByTitle('Select a version').options].map((option) => option.text);
    expect(schemaVersionsList).toStrictEqual(sampleSortedVersionListInstrument);
  })
})
