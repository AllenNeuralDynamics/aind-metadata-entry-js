import React from "react";
import { render, fireEvent } from "@testing-library/react";
import RenderForm from './RenderForm';
import schema_map from '../utilities/constants';

const sample = schema_map['sample']

it("submits", () => {
  const { getByText } = render(<RenderForm schema={sample} />);
  fireEvent.click(getByText("Add"));
  expect(onSubmit).toHaveBeenCalled();
});
