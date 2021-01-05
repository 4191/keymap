import { useState } from 'react';
import './App.css';
const { ipcRenderer } = window.require('electron');

const refreshData = () => {
  ipcRenderer.send('getData', 'getData');
};

function App() {
  let [data, setData] = useState([]);
  let [editingKey, editingKeyFunc] = useState(null);

  ipcRenderer.on('data-reply', (event, data) => {
    setData(JSON.parse(data));
  });

  const doubleClick = (key = {}, index) => {
    editingKeyFunc({ ...key, index });
  };

  /**
   * 删除当前按键
   * @param {number} index 当前按键在json文件中的index
   */
  const delKey = (index) => {
    data.splice(index, 1); // 删除当前键
    ipcRenderer.sendSync('updateData', data);
    // refreshData(); // 刷新数据
  };

  /**
   * 更新当前按键
   * @param {number} index 当前按键在json文件中的index
   */
  const updateKey = (index) => {
    console.log('🚀 ~ editingKey', editingKey);

    ipcRenderer.sendSync('updateData', data);
  };

  return (
    <div className="App">
      <button onClick={refreshData}>刷新</button>
      <div className="App-div">
        {data.map((key, index) => {
          return (
            <div
              className="key"
              title={key.name}
              onClick={() => {
                editingKeyFunc({ ...key, index });
              }}
            >
              {key.name}
              {[15, 29, 42, 55].includes(index) ? <br></br> : ''}
            </div>
          );
        })}

        {/* 编辑组件 */}
        <div
          style={{
            display: editingKey ? '' : 'none',
          }}
        >
          <h2>编辑：</h2>
          名称： <input placeholder={editingKey?.name}></input>
          FN1:
          <input
            placeholder={editingKey?.FN1}
            onChange={(e) => {
              console.log(e, '=====');
            }}
          ></input>
          FN2: <input placeholder={editingKey?.FN2}></input>
          <button
            onDoubleClick={() => {
              delKey(editingKey?.index);
            }}
          >
            删除
          </button>
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
