import Helmet from "react-helmet";
import * as React from "react";
import { useParams } from "react-router-dom";
import Channels, { Descriptions } from "../Channels";
import ChannelView from "../elements/ChannelView";
import ChatView from "../elements/ChatView";
import MessageComposer from "../elements/MessageComposer";
import OnlineUsers from "../elements/OnlineUsers";
import {VscMenu, VscClose, VscSearch} from 'react-icons/vsc';
import * as AuthManager from '../AuthManager';
import AccountStateView from "../elements/AccountStateView";
export default function ChatMain() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { id } = useParams();
  const [channelVisibility, setChannelVisibility] = React.useState(true);
  const [loggedIn, setLoggedIn] = React.useState(false);
  let channelList = [];
  function forceUpdaterCurrent() {

  }
  React.useEffect(() => {
    AuthManager.isAutenticated()
    .then((data) => {
      setLoggedIn(data);
    })
 
  }, []);
 
  for (let i = 0; i < Channels.length; i++) {
    channelList.push(<ChannelView channelId={i} key={i} currentRoute={parseInt(id)} />)
  }
  function toggleChannelVisibility() {
      setChannelVisibility(!channelVisibility);
  }
  let BtnChanState;
  let leftState = "";
  if (channelVisibility) {
    BtnChanState = <VscClose size={20}/>
    leftState="showPanel";
  } else {
    BtnChanState = <VscMenu size={16}/>
    leftState="hidePanel";
  }
  return (
    <>
      <Helmet>
        <title>#{Channels[id]} - Minechat</title>
      </Helmet>
      <div id="chatview">
        <div id="left" className={leftState}>
          <div className="header">
            <div className="padding">Minechat</div>
            </div>
          <div className="fullSizer">
            <div className="ssp padding">CHANNELS</div>
            <div id="channels">
              
              {channelList}
            </div>
          </div>
          <div>
            <AccountStateView loggedIn={loggedIn}/>
          </div>
          
        </div>
        <div id="right">
          <div className="header float">
            <button onClick={toggleChannelVisibility}>{BtnChanState}</button>
            <div className="channelName">{Channels[id]}</div>
            <div className="channelDescription">{Descriptions[id]}</div>
            <button><VscSearch size={16}/> </button>
           
          </div>
          <ChatView currentChannel={id}></ChatView>
          <MessageComposer  currentChannel={id} loggedIn={loggedIn}></MessageComposer>
        </div>
        <div id="users">
          Online<br/>
          <OnlineUsers/>
        </div>
      </div>
    </>
  );
}
