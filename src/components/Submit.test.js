import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Form from '@rjsf/core';
import RenderForm from './RenderForm';

const schema = RenderForm.preProcessing('sample')

it("submits", () => {
  const onSubmit = jest.fn();
  const { getByText } = render(<Form schema={schema} onSubmit={onSubmit} />);
  fireEvent.click(getByText("Add"));
  expect(onSubmit).toHaveBeenCalled();
});
