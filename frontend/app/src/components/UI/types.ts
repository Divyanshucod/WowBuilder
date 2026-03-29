export type formButtonSubType = "primary" | "secondary";
export type formCommonBoolean = "yes" | "no";
export type formDateFormat = "dd-MM-yyyy" | "MM/dd/yyyy" | "yyyy-MM-dd";
export type formDateSubtype = "default" | "spinner";
export type formInputType = "singleLine" | "paragraph" | "blocks";
export type formInputBoxValidationType = {
    type: "regex" | "rule",
    value: string,
    errorMsg: string
}
export type formDataCommonBooleanType = {
    required: string,
    visible: string,
    enabled: string
}
export type formButton = {
    id: string,
    text: string,
    subType: formButtonSubType,
    visible: string,
    enabled: string,
    type: "button",
    onClick: {
        nextStep: string,
    }
}

export type formCheckBox = {
    id: string,
    text: string,
    required: string,
    visible: string,
    enabled: string,
    type: "checkbox",
    onClick: {
        nextStep: string
    }
}

export type formDate = {
    id: string,
    title: string,
    enabled: string,
    hint: string,
    type: "date",
    format: formDateFormat,
    required: string,
    subType: formDateSubtype,
    visible: string,
    value: string,
    dateRange?: {
        startMonth: number,
        endMonth: number,
        errorMsg: string
    },
    onChange: {
        reloadComponents: string[]
        nextStep: string
    },
    onValidated: {
        nextStep: string,
        reloadComponents: string[]
    }
}

export type formDropDown = {
    id: string,
    title: string,
    hint: string,
    type: "dropdown",
    items: string[],
    labels: {},
    value: string,
    required: string,
    visible: string,
    enabled: string,
    onChange: {
         reloadComponents: string[]
         nextStep: string
    },
    onValidated: {
         reloadComponents: string[]
         nextStep: string
    }
}

export type formInputBoxType = {
    id: string,
    type: "text",
    subType: formInputType,
    title: string,
    hint: string,
    keyboard: string,
    required: string,
    secure: string,
    value: string,
    onValidated: {
 reloadComponents: string[]
        nextStep: string

    },
    onChange: {
         reloadComponents: string[]
        nextStep: string
    },
    validation: formInputBoxValidationType[]
}

export type formFileUpload = {
    id: string,
    type: "file",
    subType: "file",
    title: string,
    subTitle?: string,

    helperTextIdle?: string,
    helperTextActive?: string,

    errorTextFile?: string,
    errorTextSizeMax?: string,

    required: string,
    visible: string,
    enabled?: string,

    maxFileSize: number,

    pickerTitle?: string,
    allowMultipleTypes: formCommonBoolean,

    supportedFiles: {
        type: "documents" | "images",
        title: string,
        extensions: string[]
    }[],

    onValidated?: {
         reloadComponents: string[]
         nextStep: string
    },

    validation?: formInputBoxValidationType[]
}
export type formDividerType = {
    id: string,
    subType: string,
    text: string,
    type: "divider"
}
export type formLoaderType = {
    id: string,
    subType: string,
    text: string,
    type: "loader"
}

export type formLabelType = {
    id: string,
    text: string,
    type: "label",
    subType: string
}



