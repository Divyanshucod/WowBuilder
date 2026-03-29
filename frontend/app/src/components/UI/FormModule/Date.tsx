import { FaPlus, FaWindowClose } from "react-icons/fa";
import { cardClass, inputClass, sectionClass } from "./UIHelper";

export const DateField = ({ data, id, handleUpdateComponent, handleRowUpdate, handleRowRemoval }: any) => {
  return (
    <div className={cardClass}>
      <h2>Date</h2>

      {["id","title","hint","value"].map((k)=>(
        <input key={k} className={inputClass} value={data[k]} onChange={(e)=>handleUpdateComponent({componentId:id,type:"date",key:k,value:e.target.value})}/>
      ))}

      <select className={inputClass} value={data.format} onChange={(e)=>handleUpdateComponent({componentId:id,type:"date",key:"format",value:e.target.value})}>
        <option value="dd-MM-yyyy">dd-MM-yyyy</option>
        <option value="MM/dd/yyyy">MM/dd/yyyy</option>
        <option value="yyyy-MM-dd">yyyy-MM-dd</option>
      </select>

      <select className={inputClass} value={data.subType} onChange={(e)=>handleUpdateComponent({componentId:id,type:"date",key:"subType",value:e.target.value})}>
        <option value="default">default</option>
        <option value="spinner">spinner</option>
      </select>

      {/* dateRange */}
      <div className={sectionClass}>
        <p>DateRange</p>
        <input className={inputClass} value={data.dateRange?.startMonth || ""} onChange={(e)=>handleUpdateComponent({componentId:id,type:"date",key:"dateRange",subKey:"startMonth",value:e.target.value})}/>
        <input className={inputClass} value={data.dateRange?.endMonth || ""} onChange={(e)=>handleUpdateComponent({componentId:id,type:"date",key:"dateRange",subKey:"endMonth",value:e.target.value})}/>
        <input className={inputClass} value={data.dateRange?.errorMsg || ""} onChange={(e)=>handleUpdateComponent({componentId:id,type:"date",key:"dateRange",subKey:"errorMsg",value:e.target.value})}/>
      </div>

      {/* onChange + onValidated (same pattern) */}
      {["onChange","onValidated"].map((k)=>(
        <div key={k} className={sectionClass}>
          <p>{k}</p>

          <input
            className={inputClass}
            value={data[k]?.nextStep || ""}
            onChange={(e)=>handleUpdateComponent({componentId:id,type:"date",key:k,subKey:"nextStep",value:e.target.value})}
          />

          <div className="flex justify-between">
            <span>reloadComponents</span>
            <FaPlus onClick={()=>handleRowUpdate({componentId:id,type:"date",key:k,subKey:"reloadComponents"})}/>
          </div>

          {data[k]?.reloadComponents?.map((val:any,i:number)=>(
            <div key={i} className="flex gap-2">
              <input className={inputClass} value={val} onChange={(e)=>handleUpdateComponent({componentId:id,type:"date",key:k,subKey:"reloadComponents",value:e.target.value,index:i})}/>
              <FaWindowClose onClick={()=>handleRowRemoval({componentId:id,type:"date",key:k,subKey:"reloadComponents",index:i})}/>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};