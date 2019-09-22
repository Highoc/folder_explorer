import React from 'react';
import './App.css';

import axios from 'axios';

function App() {
  return (
    <div>
      <form name="test" onSubmit={(event) => {
        const formdata = new FormData(document.forms.test);
        console.log(formdata);
        axios.post('http://localhost:8000/core/image/delete/2afb897730014120901ea89c1453c505/', formdata)
          .then(function (response) {
          alert(response);
        })
          .catch(function (error) {
            console.log(error);
          });
        event.preventDefault();
      }}>
        Имя: <input type="text" name="name" /><br/>
        Описание: <input type="text" name="description" /><br/>
        Контент: <input type="file" name="content" /><br/>
        Папка: <input type="text" name="folder_key" /><br/>
        <input type="submit" value="submit"/><br/>
      </form>
    </div>
  );
}

export default App;
