import { useState } from "react";
import * as XLSX from 'xlsx';

function App() {

  // onchange states
  const [excelFile, setExcelFile] = useState(null);
  const [error, setError] = useState(null);

  // submit state
  const [excelData, setExcelData] = useState(null);

  // onchange
  const handleFileInput=(e)=>{
    const fileType=['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv','application/vnd.ms-excel'];
    let selecteFile = e.target.files[0];
    if(selecteFile){
      console.log(selecteFile.type);
      if(selecteFile&&fileType.includes(selecteFile.type)){
        let reader = new FileReader();
        reader.readAsArrayBuffer(selecteFile);
        reader.onload=(e)=>{
          setError(null);
          setExcelFile(e.target.result);
        }
      }
      else{
        setError('Please select only excel files');
        setExcelFile(null);
      }
    }
    else{
      console.log('please select your file');
    }
  }

  // submit event
  const handleFileSubmit=(e)=>{
    e.preventDefault();
    if(excelFile!==null){
      const workbook = XLSX.read(excelFile,{type: 'buffer'});
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data.slice(0,10));
    }
  }

  return (
    <div className="wrapper">

      {/* form */}
      <form className="form-group custom-form" onSubmit={handleFileSubmit}>
        <input type="file" className="form-control" required
        onChange={handleFileInput}/>
        <button type="submit" className="btn btn-success btn-md">UPLOAD</button>
        {error&&(
          <div className="alert alert-danger" role="alert">{error}</div>
        )}
      </form>

      {/* view data */}
      <div className="viewer">
        {excelData?(
          <div className="table-responsive">
            <table className="table">
            <thead>
              <tr>
                {Object.keys(excelData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
              <tbody>
              {excelData.map((individualExcelData, index) => (
                <tr key={index}>
                  {Object.keys(individualExcelData).map((key) => (
                    <td key={key}>{individualExcelData[key]}</td>
                  ))}
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        ):(
          <div>No Data is uploaded yet</div>
        )}
      </div>

    </div>
  );
}

export default App;
