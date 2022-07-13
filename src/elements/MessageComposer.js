import { useRef } from 'react';
import {RiSendPlaneLine, RiAttachment2} from 'react-icons/ri';
import Channels from '../Channels';
import * as AuthManager from '../AuthManager';
import eventBus from '../EventBus';
import { useEffect } from 'react';
export default function MessageComposer(props) {
    let currentChannel = props.currentChannel;
    let messageBox = useRef();
     
    function sendMsgCheck(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            sendMsg();
        }
    }
    function sendMsg() {
        if (messageBox.current.value.length >= 1) {
            AuthManager.sendMessage(messageBox.current.value, currentChannel)
            .then((data) => {
                console.log(data);
                messageBox.current.value = "";
                eventBus.dispatch("newMessage", { message: data});
            })
            
        } else {
            eventBus.dispatch("error", { message: "Not Enough characters"});
        }
        

    }
    function attachmentUpload() {

    }
    if (props.loggedIn) {
        return (
            <div id="Composer">
                <div className="blendedComposer">
                    <button onClick={attachmentUpload}><RiAttachment2 size={18} color="white"/></button>
                    <input type="text" name="message" ref={messageBox} onKeyDown={sendMsgCheck} placeholder={"Message #" + Channels[currentChannel]} className="textInput"></input>
                    <button onClick={sendMsg}><RiSendPlaneLine size={18} color="white"/> </button>
                </div>
                
     
    
            </div>
        );
    } else {
        return (
            <div id="Composer">
                <div className="blendedComposer">
                    <div>To chat, please log in first. #NoMoreIPLeaks</div>
                </div>
                
     
    
            </div>
        );
    }

}