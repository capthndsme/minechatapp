import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import Channels from '../Channels';
export default function ChannelView(props) {
    const [currentClass, setCurrentClass] = useState("");
    useEffect(() => {
        if (props.currentRoute === props.channelId) {
            setCurrentClass("channel active");
        } else {
            setCurrentClass("channel");
        }
    }, [props.currentRoute, props.channelId])
    return (
        <Link to={"/chat/" + props.channelId} className={currentClass}>
            {Channels[props.channelId]}
        </Link>
    )
}