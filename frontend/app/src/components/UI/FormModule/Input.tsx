import { FaPlus, FaWindowClose } from "react-icons/fa";
import { cardClass, inputClass, sectionClass } from "./UIHelper";

export const InputField = ({ data, id, handleUpdateComponent, handleRowUpdate, handleRowRemoval }: any) => {
  return (
    <div className={cardClass}>
      <h3>Text Input</h3>

      {["id","title","hint","keyboard","value"].map(k=>(
        <input key={k} className={inputClass} value={data[k]} onChange={(e)=>handleUpdateComponent({componentId:id,type:"text",key:k,value:e.target.value})}/>
      ))}

      <select className={inputClass} value={data.subType} onChange={(e)=>handleUpdateComponent({componentId:id,type:"text",key:"subType",value:e.target.value})}>
        <option value="singleLine">singleLine</option>
        <option value="paragraph">paragraph</option>
        <option value="blocks">blocks</option>
      </select>

      <select className={inputClass} value={data.required} onChange={(e)=>handleUpdateComponent({componentId:id,type:"text",key:"required",value:e.target.value})}>
        <option value="yes">yes</option>
        <option value="no">no</option>
      </select>

      <select className={inputClass} value={data.secure} onChange={(e)=>handleUpdateComponent({componentId:id,type:"text",key:"secure",value:e.target.value})}>
        <option value="yes">yes</option>
        <option value="no">no</option>
      </select>

      {/* validation */}
      <div className={sectionClass}>
        <div className="flex justify-between">
          <span>Validation</span>
          <FaPlus onClick={()=>handleRowUpdate({componentId:id,type:"text",key:"validation"})}/>
        </div>

        {data.validation.map((v:any,i:number)=>(
          <div key={i} className="flex gap-2">
            <input className={inputClass} value={v.value} onChange={(e)=>handleUpdateComponent({componentId:id,type:"text",key:"validation",subKey:"value",value:e.target.value,index:i})}/>
            <FaWindowClose onClick={()=>handleRowRemoval({componentId:id,type:"text",key:"validation",index:i})}/>
          </div>
        ))}
      </div>
    </div>
  );
};