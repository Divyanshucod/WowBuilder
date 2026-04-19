// @ts-nocheck
import { cardClass, inputClass, labelClass, sectionClass } from "./UIHelper";
export const CheckboxField = ({ data, id, handleUpdateComponent }: any) => {
  return (
    <div className={cardClass}>
      <h2>Checkbox</h2>

      <label className={labelClass}>id</label>
      <input className={inputClass} value={data.id} onChange={(e)=>handleUpdateComponent({componentId:id,type:"checkbox",key:"id",value:e.target.value})}/>

      <label className={labelClass}>text</label>
      <input className={inputClass} value={data.text} onChange={(e)=>handleUpdateComponent({componentId:id,type:"checkbox",key:"text",value:e.target.value})}/>

      <label className={labelClass}>required</label>
      <select className={inputClass} value={data.required} onChange={(e)=>handleUpdateComponent({componentId:id,type:"checkbox",key:"required",value:e.target.value})}>
        <option value="yes">yes</option>
        <option value="no">no</option>
      </select>

      <label className={labelClass}>visible</label>
      <select className={inputClass} value={data.visible} onChange={(e)=>handleUpdateComponent({componentId:id,type:"checkbox",key:"visible",value:e.target.value})}>
        <option value="yes">yes</option>
        <option value="no">no</option>
      </select>

      <label className={labelClass}>enabled</label>
      <select className={inputClass} value={data.enabled} onChange={(e)=>handleUpdateComponent({componentId:id,type:"checkbox",key:"enabled",value:e.target.value})}>
        <option value="yes">yes</option>
        <option value="no">no</option>
      </select>

      <div className={sectionClass}>
        <p className={labelClass}>onClick.nextStep</p>
        <input
          className={inputClass}
          value={data.onClick.nextStep}
          onChange={(e)=>handleUpdateComponent({
            componentId:id,
            type:"checkbox",
            key:"onClick",
            subKey:"nextStep",
            value:e.target.value
          })}
        />
      </div>
    </div>
  );
};