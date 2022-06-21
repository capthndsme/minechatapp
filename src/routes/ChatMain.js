import Helmet from "react-helmet";
import * as React from "react";
import { useParams } from "react-router-dom";
import Channels from "../Channels";
import ChannelView from "../elements/ChannelView";
import ChatView from "../elements/ChatView";
import MessageComposer from "../elements/MessageComposer";
import OnlineUsers from "../elements/OnlineUsers";

export default function ChatMain() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { id } = useParams();

  let channelList = [];
 

  for (let i = 0; i < Channels.length; i++) {
    channelList.push(<ChannelView channelId={i} key={i} currentRoute={parseInt(id)} />)
  }
  return (
    <>
      <Helmet>
        <title>#{Channels[id]} - Minechat</title>
      </Helmet>
      <div id="chatview">
        <div id="left">
          <div className="header">Minechat</div>
          <div className="ssp padding">CHANNELS</div>
          <div id="channels">
            {channelList}
          </div>
        </div>
        <div id="right">
          <div className="header float">{Channels[id]}</div>
          <ChatView currentChannel={id}></ChatView>
          <MessageComposer currentChannel={id} currentAuthentication={true}></MessageComposer>
        </div>
        <div id="users">
          Online<br/>
          <OnlineUsers/>
        </div>
      </div>
    </>
  );
}
