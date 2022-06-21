import { useRef, useCallback, useEffect, useState } from "react";
import useWindowResize from "../effects/useWindowResize";

import axios from "axios";
import moment from "moment";
import { SecureLink } from "react-secure-link";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";
import Linkify from "react-linkify/dist/components/Linkify";

export default function ChatView(props) {
  let audioRef = useRef();
  let azRef = useRef();
  let listElement = useRef();
  let listRef = useRef();
  window._list_ref_debug = listRef;
  window._list_element_debug = listElement;
  window._az_ref_debug = azRef;
  const sizeMap = useRef({});
  const setSize = useCallback((index, size) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    listRef.current.resetAfterIndex(index);
  }, []);

  const getSize = (index) => sizeMap.current[index] || 50;
  const [windowWidth] = useWindowResize();
  const [newMessagesCount, setNewMessageCount] = useState(0);
  const API_BASE_URL = "/";
  const GET_MESSAGES = API_BASE_URL + "getMessages";
  const [autoScroll, setAutoScroll] = useState(false);
  const [updater, setUpdater] = useState(0);
  const [currentData, setCurrentData] = useState([]);

  const [isLoaded, setIsLoaded] = useState(false);
  function scrollBottom() {
    setNewMessageCount(0);
    if (listRef.current) {
      listRef.current.scrollToItem(99999999);
    }
  }

  const Row = ({ data, index, setSize, windowWidth }) => {
    const rowRef = useRef();
    useEffect(() => {
      setSize(index, rowRef.current.getBoundingClientRect().height);
    }, [setSize, index, windowWidth]);
    let displayurl = "https://map.rphvccraft.capthndsme.xyz/tiles/faces/32x32/" +
    data[index].Username + ".png";
    if (data[index].Username === "System" || data[index].Username === "CONSOLE") {
      displayurl = "/" + data[index].Username + ".png"
    }
    return (
      <div
        className="messageItem"
        ref={rowRef}
        style={{ paddingTop: 8, paddingBottom: 8 }}
      >
        <img className="displayPic" src={displayurl}></img>
        <div className="msgText">
          <div className="username">{data[index].Username}</div>
          <div className="timestamp">
            {moment(data[index].Timestamp).calendar()}
          </div>
          <div className="message">
            <Linkify
              componentDecorator={(decoratedHref, decoratedText, key) => {
                let hasImage = null;
                if (
                  decoratedHref.toLowerCase().endsWith("jpg") ||
                  decoratedHref.toLowerCase().endsWith("png") ||
                  decoratedHref.toLowerCase().endsWith("jpeg") ||
                  decoratedHref.toLowerCase().endsWith("gif")
                ) {
                  hasImage = <img src={decoratedHref} style={{ height: 250 }}></img>;
                }
                return (
                  <div key={key}>
                    <SecureLink href={decoratedHref}>
                      {decoratedText}
                    </SecureLink>
                    <br />
                    {hasImage}
                  </div>
                );
              }}
            >
              {data[index].Message}
            </Linkify>
          </div>
        </div>
      </div>
    );
  };

  let newMessageBar = null;
  if (newMessagesCount !== 0 && !autoScroll) {
    newMessageBar = (
      <div onClick={scrollBottom} className="newMessages">
        {newMessagesCount} new messages! Click here to show new messages.
      </div>
    );
  } else {
    newMessageBar = null;
  }
  function scrollTest(event) {
    if (listElement.current) {
      if (
        (event.scrollOffset + listElement.current.offsetHeight) ===
        listElement.current.scrollHeight
      ) {
        setAutoScroll(true);
        setNewMessageCount(0);
      } else {
        setAutoScroll(false);
      }
    }
  }
  useEffect(() => {
    let updaterId = 0;
    if (currentData.length !== 0) {
      axios
        .get(
          GET_MESSAGES +
            "/?type=range&from=" +
            currentData[currentData.length - 1].MessageId +
            "&channel=" +
            props.currentChannel
        )
        .then((data) => {
          if (data.data.length !== 0) {
            let copydata = currentData.splice(0);
            setNewMessageCount((count) => count + data.data.length);
            for (let i = 0; i < data.data.length; i++) {
              copydata.push(data.data[i]);
            }
            setCurrentData(copydata);
            if (autoScroll) {
              scrollBottom();
            }
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
            }
          }

          updaterId = setTimeout(() => {
            setUpdater((prevUpdate) => prevUpdate + 1);
          }, 1500);
        })
        .catch((err) => {
          console.log("error", err, "retrying in 30 seconds");
          updaterId = setTimeout(() => {
            setUpdater((prevUpdate) => prevUpdate + 1);
          }, 30000);
        });
    } else {
      updaterId = setTimeout(() => {
        setUpdater((prevUpdate) => prevUpdate + 1);
      }, 1500);
    }

    return function () {
      clearTimeout(updaterId);
    };
  }, [updater, props.currentChannel]);

  useEffect(() => {
    setIsLoaded(false);
    setCurrentData([]);
    axios
      .get(GET_MESSAGES + "/?type=initialSync&channel=" + props.currentChannel)
      .then((data) => {
        setCurrentData(data.data);

        setIsLoaded(true);
        setUpdater((prevUpdate) => prevUpdate + 1);
        setTimeout(() => {
          listRef.current.scrollToItem(999999999);
        }, 100);
      });
  }, [props.currentChannel]);

  if (isLoaded && currentData.length !== 0) {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <audio autoPlay={false} ref={audioRef} src="/ping.m4a"></audio>
        <button
          className="btn"
          style={{
            width: "auto",
            border: "none",
            cursor: "pointer",
            zIndex: 1600,
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
          onClick={scrollBottom}
        >
          Scroll to bottom
        </button>
        {newMessageBar}
        <AutoSizer ref={azRef}>
          {({ height, width }) => (
            <List
              height={height}
              outerRef={listElement}
              itemCount={currentData.length}
              ref={listRef}
              onScroll={scrollTest}
              itemSize={getSize}
              width={width}
              itemData={currentData}
            >
              {({ data, index, style }) => (
                <div style={style}>
                  <Row
                    data={data}
                    index={index}
                    setSize={setSize}
                    windowWidth={windowWidth}
                  />
                </div>
              )}
            </List>
          )}
        </AutoSizer>
      </div>
    );
  } else if (isLoaded && currentData.length === 0) {
    return <div className="loadinfo">No messages on this channel</div>;
  } else {
    return <div className="loadinfo">Loading messages...</div>;
  }
}
