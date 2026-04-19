// @ts-nocheck
import { FaPlus, FaWindowClose } from "react-icons/fa";

export const FileUploadField = ({
  data,
  id,
  handleUpdateComponent,
  handleRowUpdate,
  handleRowRemoval
}: any) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-4 space-y-3">
      <h3 className="font-semibold text-sm">File Upload</h3>

      {[
        "id",
        "title",
        "subTitle",
        "helperTextIdle",
        "helperTextActive",
        "errorTextFile",
        "errorTextSizeMax",
        "pickerTitle"
      ].map((k) => (
        <input
          key={k}
          className="input"
          placeholder={k}
          value={data[k] || ""}
          onChange={(e) =>
            handleUpdateComponent({
              componentId: id,
              type: "file",
              key: k,
              value: e.target.value
            })
          }
        />
      ))}

      <select
        className="input"
        value={data.required}
        onChange={(e) =>
          handleUpdateComponent({
            componentId: id,
            type: "file",
            key: "required",
            value: e.target.value
          })
        }
      >
        <option value="yes">yes</option>
        <option value="no">no</option>
      </select>

      <select
        className="input"
        value={data.visible}
        onChange={(e) =>
          handleUpdateComponent({
            componentId: id,
            type: "file",
            key: "visible",
            value: e.target.value
          })
        }
      >
        <option value="yes">yes</option>
        <option value="no">no</option>
      </select>

      <select
        className="input"
        value={data.allowMultipleTypes}
        onChange={(e) =>
          handleUpdateComponent({
            componentId: id,
            type: "file",
            key: "allowMultipleTypes",
            value: e.target.value
          })
        }
      >
        <option value="yes">yes</option>
        <option value="no">no</option>
      </select>

      <input
        className="input"
        type="number"
        value={data.maxFileSize}
        onChange={(e) =>
          handleUpdateComponent({
            componentId: id,
            type: "file",
            key: "maxFileSize",
            value: e.target.value
          })
        }
      />

      <div className="section">
        <div className="flex justify-between items-center">
          <span className="text-sm">Supported Files</span>
          <FaPlus
            className="cursor-pointer text-blue-500"
            onClick={() =>
              handleRowUpdate({
                componentId: id,
                type: "file",
                key: "supportedFiles"
              })
            }
          />
        </div>

        {data.supportedFiles?.map((file: any, i: number) => (
          <div key={i} className="border rounded-lg p-3 space-y-2">

  
            <select
              className="input"
              value={file.type}
              onChange={(e) =>
                handleUpdateComponent({
                  componentId: id,
                  type: "file",
                  key: "supportedFiles",
                  subKey: "type",
                  value: e.target.value,
                  index: i
                })
              }
            >
              <option value="documents">documents</option>
              <option value="images">images</option>
            </select>


            <input
              className="input"
              value={file.title}
              onChange={(e) =>
                handleUpdateComponent({
                  componentId: id,
                  type: "file",
                  key: "supportedFiles",
                  subKey: "title",
                  value: e.target.value,
                  index: i
                })
              }
            />

            <div className="pl-2">
              <div className="flex justify-between items-center">
                <span className="text-xs">Extensions</span>
                <FaPlus
                  onClick={() =>
                    handleRowUpdate({
                      componentId: id,
                      type: "file",
                      key: "extensions",
                      subKey: i
                    })
                  }
                />
              </div>

              {file.extensions.map((ext: string, j: number) => (
                <div key={j} className="flex gap-2 items-center">
                  <input
                    className="input flex-1"
                    value={ext}
                    onChange={(e) =>
                      handleUpdateComponent({
                        componentId: id,
                        type: "file",
                        key: "extensions",
                        subKey: j,
                        value: e.target.value,
                        index: i
                      })
                    }
                  />
                  <FaWindowClose
                    className="cursor-pointer text-red-500"
                    onClick={() =>
                      handleRowRemoval({
                        componentId: id,
                        type: "file",
                        key: "extensions",
                        subKey: i,
                        index: j
                      })
                    }
                  />
                </div>
              ))}
            </div>

            <FaWindowClose
              className="text-red-500 cursor-pointer"
              onClick={() =>
                handleRowRemoval({
                  componentId: id,
                  type: "file",
                  key: "supportedFiles",
                  index: i
                })
              }
            />
          </div>
        ))}
      </div>

      <div className="section">
        <div className="flex justify-between">
          <span>Validation</span>
          <FaPlus
            onClick={() =>
              handleRowUpdate({
                componentId: id,
                type: "file",
                key: "validation"
              })
            }
          />
        </div>

        {data.validation?.map((v: any, i: number) => (
          <div key={i} className="flex gap-2">
            <input
              className="input"
              value={v.value}
              onChange={(e) =>
                handleUpdateComponent({
                  componentId: id,
                  type: "file",
                  key: "validation",
                  subKey: "value",
                  value: e.target.value,
                  index: i
                })
              }
            />
            <FaWindowClose
              onClick={() =>
                handleRowRemoval({
                  componentId: id,
                  type: "file",
                  key: "validation",
                  index: i
                })
              }
            />
          </div>
        ))}
      </div>

      <div className="section">
        <span>onValidated.nextStep</span>
        <input
          className="input"
          value={data.onValidated?.nextStep || ""}
          onChange={(e) =>
            handleUpdateComponent({
              componentId: id,
              type: "file",
              key: "onValidated",
              subKey: "nextStep",
              value: e.target.value
            })
          }
        />
      </div>
    </div>
  );
};