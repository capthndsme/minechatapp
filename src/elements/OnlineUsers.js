import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function OnlineUsers() {
  let list = [];;
  const [online, setOnline] = useState([]);
  const [updateId, setUpdateId] = useState(0);
  useEffect(() => {
    setUpdateId((prevUpdate) => prevUpdate + 1);
  }, []);
  useEffect(() => {
    axios
      .get("/queryUsers/")
      .then((data) => {
        setOnline(data.data);
        setTimeout(() => {
          setUpdateId((prevUpdate) => prevUpdate + 1);
        }, 3000);
      })
      .catch((err) => {
        console.warn("[OnlineUpdater] error:", err);
        setTimeout(() => {
          setUpdateId((prevUpdate) => prevUpdate + 1);
        }, 30000);
      });
  }, [updateId]);
 
  if (online.length === 0) {
    list = <div>No online players.</div>;
  } else {
    for (let i = 0; i < online.length; i++) {
      list.push(<div key={i}>
          <img align="center" className="displayPic" src={"https://map.rphvccraft.capthndsme.xyz/tiles/faces/32x32/" + online[i] + ".png"}></img>
          <div style={{lineHeight:"32px",paddingLeft:8, display:"inline-block"}}>{online[i]}</div>
      </div>);
    }
  }
  return <div>{list}</div>;
}
