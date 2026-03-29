import { cardClass, inputClass, sectionClass } from "./UIHelper";

export const ButtonField = ({ data, id, handleUpdateComponent }: any) => {
  return (
    <div className={cardClass}>
      <h2>Button</h2>

      <input className={inputClass} value={data.id} onChange={(e)=>handleUpdateComponent({componentId:id,type:"button",key:"id",value:e.target.value})}/>
      
      <input className={inputClass} value={data.text} onChange={(e)=>handleUpdateComponent({componentId:id,type:"button",key:"text",value:e.target.value})}/>

      <select className={inputClass} value={data.subType} onChange={(e)=>handleUpdateComponent({componentId:id,type:"button",key:"subType",value:e.target.value})}>
        <option value="primary">primary</option>
        <option value="secondary">secondary</option>
      </select>

      <select className={inputClass} value={data.visible} onChange={(e)=>handleUpdateComponent({componentId:id,type:"button",key:"visible",value:e.target.value})}>
        <option value="yes">yes</option>
        <option value="no">no</option>
      </select>

      <select className={inputClass} value={data.enabled} onChange={(e)=>handleUpdateComponent({componentId:id,type:"button",key:"enabled",value:e.target.value})}>
        <option value="yes">yes</option>
        <option value="no">no</option>
      </select>

      <div className={sectionClass}>
        <p>onClick.nextStep</p>
        <input
          className={inputClass}
          value={data.onClick.nextStep}
          onChange={(e)=>handleUpdateComponent({
            componentId:id,
            type:"button",
            key:"onClick",
            subKey:"nextStep",
            value:e.target.value
          })}
        />
      </div>
    </div>
  );
};