import React, {useState} from 'react';
import VisualiseData from './pages/InteractionPage';
import UploadData from './pages/ProcessData';

const App = () => {
  const [showData, setShowData] = useState(true);
  const [text, setText] = useState("Show Page to Upload Data")

  return (
    <div>
      <button onClick={() => {setShowData(!showData); text=="Show Page to Upload Data" ? setText("Show Page of the Plot Data") : setText("Show Page to Upload Data")}}>{text}</button>
      <br></br>
      {showData && <VisualiseData></VisualiseData>}
      <br></br>
      
    {!showData && <UploadData></UploadData>}
    </div>
  )
}

export default App;