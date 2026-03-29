import type { formNodeConfigType } from "./FormModule";
import {ButtonField} from "./FormModule/Button";
import {CheckboxField} from "./FormModule/CheckBox";
import {DividerField} from "./FormModule/Divider";
import {DropdownField} from "./FormModule/Dropdown";
import {FileUploadField} from "./FormModule/File";
import {InputField} from "./FormModule/Input";
import LabelField from "./FormModule/Label";
import LoaderField from "./FormModule/Loader";
type Props = {
  id: string;
  formNodeConfig: formNodeConfigType;
  updateComponentFields: any;
  addMoreFields: any;
  handleRemove: any;
};
 export const RenderComponent = ({
  id,
  formNodeConfig,
  updateComponentFields,
  addMoreFields,
  handleRemove
}: Props) => {
    const comp = formNodeConfig.components.componentMap[id];
    
    switch (comp.type) {
        case "label":
            return <LabelField key={id} id={id} data={comp} handleUpdateComponent={updateComponentFields} handleRowUpdate={addMoreFields} handleRowRemoval={handleRemove} />;
        
        case "text":
            return <InputField key={id} id={id} data={comp} handleUpdateComponent={updateComponentFields} handleRowUpdate={addMoreFields} handleRowRemoval={handleRemove} />;
        
        case "file":
            return <FileUploadField key={id} id={id} data={comp} handleUpdateComponent={updateComponentFields} handleRowUpdate={addMoreFields} handleRowRemoval={handleRemove} />;
        
        case "dropdown":
            return <DropdownField key={id} id={id} data={comp} handleUpdateComponent={updateComponentFields} handleRowUpdate={addMoreFields} handleRowRemoval={handleRemove} />;
        
        case "loader":
            return <LoaderField key={id} id={id} data={comp} handleUpdateComponent={updateComponentFields} handleRowUpdate={addMoreFields} handleRowRemoval={handleRemove} />;
        
        case "divider":
            return <DividerField key={id} id={id} data={comp} handleUpdateComponent={updateComponentFields} handleRowUpdate={addMoreFields} handleRowRemoval={handleRemove} />;
        
        case "button":
            return <ButtonField key={id} id={id} data={comp} handleUpdateComponent={updateComponentFields} handleRowUpdate={addMoreFields} handleRowRemoval={handleRemove} />;
        
        case "checkbox":
            return <CheckboxField key={id} id={id} data={comp} handleUpdateComponent={updateComponentFields} handleRowUpdate={addMoreFields} handleRowRemoval={handleRemove} />;
        
        default:
            return null;
    }
};