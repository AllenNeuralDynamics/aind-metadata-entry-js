import React from "react";
import { render, fireEvent } from "@testing-library/react";
import RenderForm from './RenderForm';

it("submits", () => {
    const onSubmit = jest.fn();
    const { getByLabelText, getByText } = render(<RenderForm schema={'sample'} />);
    fireEvent.change(getByLabelText(/Full Name/i), { target: { name: 'name' } });
    fireEvent.click(getByText("Submit"));
    expect(onSubmit).toHaveBeenCalled();
});
