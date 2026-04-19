// @ts-nocheck

import type { formLabelType, formLoaderType } from "../types";
import { cardClass, inputClass } from "./UIHelper";

export const LoaderField = ({ data, id, handleUpdateComponent,handleRowUpdate, handleRowRemoval  }: any) => {
  return (
    <div className={cardClass}>
              <h3>Loader</h3>
           {["id","subType","text"].map(k=>(
                  <input key={k} className={inputClass} value={data[k]} onChange={(e)=>handleUpdateComponent({componentId:id,type:"loader",key:k,value:e.target.value})}/>
                ))}
        </div>
  );
};
export default LoaderField;