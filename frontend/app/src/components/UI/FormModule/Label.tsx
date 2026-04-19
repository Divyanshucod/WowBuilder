// @ts-nocheck
import { cardClass, inputClass } from "./UIHelper";

// @ts-nocheck
export const LabelField = ({ data, id, handleUpdateComponent,handleRowUpdate, handleRowRemoval  }: any) => {
  return <div className={cardClass}>
            <h3>Label</h3>
         {["id","subType","text"].map(k=>(
                <input key={k} className={inputClass} value={data[k]} onChange={(e)=>handleUpdateComponent({componentId:id,type:"label",key:k,value:e.target.value})}/>
              ))}
      </div>
};
export default LabelField;