import { FaPlus, FaWindowClose } from "react-icons/fa";

export const DropdownField = ({
  data,
  id,
  handleUpdateComponent,
  handleRowUpdate,
  handleRowRemoval
}: any) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-4 space-y-3">
      <h3 className="font-semibold text-sm">Dropdown</h3>


      {["id", "title", "hint", "value"].map((k) => (
        <input
          key={k}
          className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
          placeholder={k}
          value={data[k] || ""}
          onChange={(e) =>
            handleUpdateComponent({
              componentId: id,
              type: "dropdown",
              key: k,
              value: e.target.value
            })
          }
        />
      ))}

  
      <select
        className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
        value={data.required}
        onChange={(e) =>
          handleUpdateComponent({
            componentId: id,
            type: "dropdown",
            key: "required",
            value: e.target.value
          })
        }
      >
        <option value="yes">yes</option>
        <option value="no">no</option>
      </select>


      <select
        className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
        value={data.visible}
        onChange={(e) =>
          handleUpdateComponent({
            componentId: id,
            type: "dropdown",
            key: "visible",
            value: e.target.value
          })
        }
      >
        <option value="yes">yes</option>
        <option value="no">no</option>
      </select>

     
      <select
        className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
        value={data.enabled}
        onChange={(e) =>
          handleUpdateComponent({
            componentId: id,
            type: "dropdown",
            key: "enabled",
            value: e.target.value
          })
        }
      >
        <option value="yes">yes</option>
        <option value="no">no</option>
      </select>

    
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm">Items</span>
          <FaPlus
            className="cursor-pointer text-blue-500"
            onClick={() =>
              handleRowUpdate({
                componentId: id,
                type: "dropdown",
                key: "items"
              })
            }
          />
        </div>

        {data.items?.map((item: string, i: number) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              className="flex-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              value={item}
              onChange={(e) =>
                handleUpdateComponent({
                  componentId: id,
                  type: "dropdown",
                  key: "items",
                  value: e.target.value,
                  index: i
                })
              }
            />

            <FaWindowClose
              className="text-red-500 cursor-pointer"
              onClick={() =>
                handleRowRemoval({
                  componentId: id,
                  type: "dropdown",
                  key: "items",
                  index: i
                })
              }
            />
          </div>
        ))}
      </div>

      <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-3 space-y-2">
        <span className="text-sm">Labels</span>

        {data.items?.map((item: string) => (
          <div key={item} className="flex gap-2 items-center">
            <span className="text-xs text-gray-500 w-32 truncate">
              {item}
            </span>

            <input
              className="flex-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              value={data.labels?.[item] || ""}
              onChange={(e) =>
                handleUpdateComponent({
                  componentId: id,
                  type: "dropdown",
                  key: "labels",
                  subKey: item,
                  value: e.target.value
                })
              }
            />
          </div>
        ))}
      </div>


      {["onChange", "onValidated"].map((k) => (
        <div
          key={k}
          className="border border-gray-300 dark:border-gray-700 rounded-lg p-3 space-y-2"
        >
          <p className="text-sm">{k}</p>


          <input
            className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            value={data[k]?.nextStep || ""}
            onChange={(e) =>
              handleUpdateComponent({
                componentId: id,
                type: "dropdown",
                key: k,
                subKey: "nextStep",
                value: e.target.value
              })
            }
          />


          <div className="flex justify-between items-center">
            <span className="text-xs">reloadComponents</span>
            <FaPlus
              onClick={() =>
                handleRowUpdate({
                  componentId: id,
                  type: "dropdown",
                  key: k,
                  subKey: "reloadComponents"
                })
              }
            />
          </div>

          {data[k]?.reloadComponents?.map((val: string, i: number) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                className="flex-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                value={val}
                onChange={(e) =>
                  handleUpdateComponent({
                    componentId: id,
                    type: "dropdown",
                    key: k,
                    subKey: "reloadComponents",
                    value: e.target.value,
                    index: i
                  })
                }
              />

              <FaWindowClose
                className="text-red-500 cursor-pointer"
                onClick={() =>
                  handleRowRemoval({
                    componentId: id,
                    type: "dropdown",
                    key: k,
                    subKey: "reloadComponents",
                    index: i
                  })
                }
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};