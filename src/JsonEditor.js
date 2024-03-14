import React, { useState, useRef } from 'react';
import ReactJson from 'react-json-view'



function FileUploader() {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [jsonData, setJsonData] = useState(null);
    const [theme, setTheme] = useState('rjv-default');

    
    const handleJsonChange = (update) => {
      if (!jsonData){
        return
      }
      setJsonData(update.updated_src)
    }

    const handleTheme = (event) => {
      setTheme(event.target.value)
    }

    const saveJsonData = () => {
      if(!jsonData){
        return
      }
      const jsonString =JSON.stringify(jsonData, null, 2)
      const blob = new Blob ([jsonString], {type: 'application/json'});

      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob)

      const fileName = selectedFile.name;

      if (window.confirm(`${fileName} already exists. Do you want to replace it`)){
        a.download = fileName
        document.body.appendChild(a);
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(a.href)
      }
    }

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file){
        setSelectedFile(file);
        console.log(file)
        const reader = new FileReader();
        reader.onload = function(event) {
          try {
            const data = JSON.parse(event.target.result);
            setJsonData(data);
            
          } catch (error) {
            console.error('Error parsing JSON file:', error);
          }
        };
        reader.readAsText(file);
      }
    };
  
    const handleButtonClick = () => {
      fileInputRef.current.click();
    };

    return(
        <div>
            <h2>JSON File Editor</h2>
            {selectedFile && <h2>Selected File: {selectedFile.name}</h2>}
            <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept='.json'
            />
            
            <button onClick={handleButtonClick}>Choose File</button>
            <button onClick={saveJsonData}>Save Changes</button>
            <label for="features">Change Theme: </label>
              <select name="features" onChange={handleTheme}>
                <option value="rjv-default">rjv-default</option>
                <option value="monokai">monokai</option>
                <option value="ocean">ocean</option>
                <option value="paraiso">paraiso</option>
                <option value="pop">pop</option>
                <option value="railscasts">railscasts</option>
              </select>
            {jsonData && (
            <ReactJson src={jsonData} onEdit={handleJsonChange} onAdd={handleJsonChange} onDelete={handleJsonChange} name={false} theme={theme} 
            collapseStringsAfterLength={75} quotesOnKeys={false} iconStyle={"square"}/>
            )
          }
      
        </div>
    );

    }



export default FileUploader;
