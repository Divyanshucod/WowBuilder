
import { cardClass, inputClass } from "./UIHelper";

export const DividerField = ({ data, id, handleUpdateComponent,handleRowUpdate, handleRowRemoval  }: any) => {
  return (
    <div className={cardClass}>
          <h3>Divider</h3>
       {["id","subType","text"].map(k=>(
              <input key={k} className={inputClass} value={data[k]} onChange={(e)=>handleUpdateComponent({componentId:id,type:"divider",key:k,value:e.target.value})}/>
            ))}
    </div>
  );
};
export default DividerField;
