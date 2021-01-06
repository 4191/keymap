import { useState, useEffect, Fragment } from 'react';
import './App.css';
const { ipcRenderer } = window.require('electron');

// 刷新数据
const refreshData = () => {
  ipcRenderer.send('getData', 'getData');
};

function App() {
  let [data, setData] = useState([]);
  let [showFn, setShowFn] = useState(false);
  let [editingKey, editingKeyFunc] = useState(null);

  useEffect(() => {
    refreshData();
  }, []);

  ipcRenderer.on('data-reply', (event, data) => {
    setData(JSON.parse(data));
    // refreshData();
  });

  /**
   * 删除当前按键
   * @param {number} index 当前按键在json文件中的index
   */
  const delKey = (index) => {
    data.splice(index, 1); // 删除当前键
    ipcRenderer.send('updateData', data);
  };

  /**
   * 更新当前按键
   * @param {number} index 当前按键在json文件中的index
   */
  const updateKey = (index) => {
    // 位置发生变化
    if (editingKey.newIndex) {
      // 删除原来位置的key
      data.splice(index, 1);
      // 插入到新的位置
      data.splice(editingKey.newIndex, 0, editingKey);
    } else {
      data[index] = editingKey;
    }
    ipcRenderer.send('updateData', data);
  };

  return (
    <div className="App">
      <button onClick={refreshData}>刷新</button>
      <button
        onClick={() => {
          setShowFn(!showFn);
        }}
      >
        {showFn ? 'key' : 'FN'}
      </button>
      <div className="App-div">
        {data.map((key, index) => {
          let { width = 1 } = key;
          return (
            <Fragment>
              <div
                key={index}
                className={showFn ? 'FN' : 'key'}
                style={{ width: 45 * width }}
                title={key.name}
                onClick={() => {
                  editingKeyFunc({ ...key, index });
                }}
              >
                {showFn ? key.FN1 + ' ' + key.FN2 : key.name}
              </div>
              {[14, 28, 41, 54].includes(index) ? <div></div> : ''}
            </Fragment>
          );
        })}

        {/* 编辑组件 */}
        <div
          className="editComp"
          style={{
            display: editingKey ? '' : 'none',
          }}
        >
          <h2>编辑：</h2>
          <span>名称:</span>
          <input
            defaultValue={editingKey?.name}
            onChange={(e) => {
              editingKey.name = e.target.value;
            }}
          ></input>
          <span>位置:</span>
          <input
            defaultValue={editingKey?.index}
            type="number"
            min={0}
            max={118}
            onChange={(e) => {
              editingKey.newIndex = Number(e.target.value);
            }}
          ></input>
          <br />
          <span>FN1:</span>
          <input
            defaultValue={editingKey?.FN1}
            onChange={(e) => {
              editingKey.FN1 = e.target.value;
            }}
          ></input>
          <span>FN2:</span>
          <input
            defaultValue={editingKey?.FN2}
            onChange={(e) => {
              editingKey.FN2 = e.target.value;
            }}
          ></input>
          <br />
          <span>宽度（U）:</span>
          <input
            type="number"
            min={1}
            max={5}
            step={0.1}
            defaultValue={editingKey?.width}
            onChange={(e) => {
              editingKey.width = e.target.value;
            }}
          ></input>
          <span>description:</span>
          <input
            defaultValue={editingKey?.description}
            onChange={(e) => {
              editingKey.description = e.target.value;
            }}
          ></input>
          <br />
          {/* <button
            onDoubleClick={() => {
              delKey(editingKey?.index);
            }}
          >
            删除
          </button> */}
          <button
            onClick={() => {
              updateKey(editingKey?.index);
            }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
