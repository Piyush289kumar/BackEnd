import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [apiRes, setApiRes] = useState([]);

  useEffect(() => {
    axios
      .get("/api/items")
      .then((Response) => setApiRes(Response.data))
      .catch((error) => console.log(error));
  });

  return (
    <>
      <div>
        <h1>Array Element Length: {apiRes.length}</h1>

        {apiRes.map((item, idx) => (
          <div key={idx}>
            <span>{item.id}</span> --// <span>{item.itemName}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
