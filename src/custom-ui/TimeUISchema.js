import CustomTimeWidget from "./CustomTimeWidget"

export const widgets = {
    time: CustomTimeWidget
};

export const timeUiSchema = {
    "ui:widget": "time",
    "ui:options": {
        timeFormat: "hh:mm:ss",
        "ui:placeholder": "00:00:00"
    }
};
