import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import SmallHeader from "../../components/SmallHeader";
import IconSwitch from "../../components/IconSwitch";
import GroupRadioButton from "../../components/GroupRadioButton";
import ReactPlayer from "react-player";
import toast from "react-hot-toast";
import { SyncLoader } from "react-spinners";
import { useSocket } from "../../context/SocketProvider";
import peer from "../../services/peer";


const InterviewSession = () => {
  const socket = useSocket();
  const {roomId} = useParams();
  const [camera , setCamera] = useState(true);
  const [mic , setMic] = useState(useSearchParams("mic") === true ? true : false);
  const [videoInteractionBtn,setVideoInteractionBtn] = useState(true);
  const [codeItBtn , setCodeItBtn] = useState(false);
  const [canvasBtn , setCanvasBtn] = useState(false);
  const [remoteStream , setRemoteStream] = useState();
  const [remoteSocketId , setRemoteSocketId] = useState();
  const [myStream , setMyStream] = useState();
  
  const openCameraAndMic = useCallback(async()=> {
    const stream = await navigator.mediaDevices.getUserMedia({audio : true , video : true})
    setMyStream(stream);
  } , []);

  useEffect(() => {
    console.log("Camera value is changed " , camera);
  } , [camera])

  useEffect(() => {
    console.log(roomId , "this is the roomId");
    socket.emit("interview_init" , {roomId});
    openCameraAndMic();
  } , [socket])
  
  const startTheProcess = useCallback(async({oponentSocketId}) => {
    console.log("Yup ! I have got reqest to start the connection",oponentSocketId);
    setRemoteSocketId(oponentSocketId);
    console.log("Oponent Socker id " , oponentSocketId);
    initiateTheCall(oponentSocketId);
  },[remoteSocketId]);

  const sendStreams = useCallback(async()=>{
    
    const stream = await navigator.mediaDevices.getUserMedia({audio : true , video : true});
    
    console.log("Trying to send the streams " , stream);
    
    for(const track of stream.getTracks()){
        peer.peer.addTrack(track , stream);
    }
},[myStream])

useEffect(() => {
  peer.peer.addEventListener('track' , async ev => {
      const remoteSteam = ev.streams;
      console.log("Got trancks ");
      setRemoteStream(remoteSteam[0]);
  })
} , [])

  const initiateTheCall = useCallback(async (oponentSocketId) => {
    const stream = await navigator.mediaDevices.getUserMedia({audio : true , video : true});
    setMyStream(stream);
    const offer = await peer.getOffer();
    socket.emit("user:call" , {to : oponentSocketId , offer});
  } , [])


  const handleIncommingCall = useCallback(async({from , offer})=>{
    console.log("I am getting a call ...");
    setRemoteSocketId(from);
    const stream = await navigator.mediaDevices.getUserMedia({audio : true , video : true})
    setMyStream(stream);
    const ans = await peer.getAnswer(offer);
    socket.emit("call:accepted" , {to : from , ans});
  },[])

  const handleCallAccepted = useCallback(async({from , ans}) => {
    console.log("Yes !!! Call is accepted");
    await peer.setLocalDescription(ans);
    //sendStreams();
    setTimeout(() => {
      sendStreams();
    },1000);
    setTimeout(() => {
      socket.emit("send_stream_please" , {to : from});

    },2000);


  } , [sendStreams])

  const handleSendStreams = useCallback(() => {
    sendStreams();
  },[])

  const handleNegoNeededServer = useCallback(async({from , offer}) => {
    const ans = await peer.getAnswer(offer);
    socket.emit("peer:nego:done" , {to : from , ans});
  } , []);

  const handleNegoDone = useCallback(async({ans}) => {
    await peer.setLocalDescription(ans);  
  } , []);

  const handleUserDisconnected = useCallback(async () => {
    setRemoteSocketId(null);
    setRemoteStream(null);
    //await peer.reInit();
  },[])

  const handleUserJoined = useCallback(() => {
    // window.location.reload();
  }, []);

  useEffect(() => {
    socket.on("start_the_connection_process" , startTheProcess);
    socket.on("incommming:call" , handleIncommingCall);
    socket.on("server:call_accepted" , handleCallAccepted)
    socket.on("send_streams_server" , handleSendStreams)
    socket.on("peer:nego:needed_server" , handleNegoNeededServer);
    socket.on("peer:nego:final_server" , handleNegoDone);
    socket.on("user:disconnected" , handleUserDisconnected);
    socket.on("user:joined" , handleUserJoined);

    return () => {
      socket.off("start_the_connection_process" , startTheProcess);
      socket.off("incommming:call" , handleIncommingCall);
      socket.off("user:joined" , handleUserJoined);
      socket.off("send_streams_server" , handleSendStreams)
      socket.off("server:call_accepted" , handleCallAccepted)
      socket.off("peer:nego:needed_server" , handleNegoNeededServer);
      socket.off("peer:nego:final_server" , handleNegoDone);
      socket.off("user:disconnected" , handleUserDisconnected);

      
    }
  } , [socket , startTheProcess , handleCallAccepted , handleIncommingCall , handleUserJoined])

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed" , {offer , to:remoteSocketId})
  },[remoteSocketId , socket])

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded" , handleNegoNeeded);
    return () => {
        peer.peer.removeEventListener("negotiationneeded" , handleNegoNeeded);
    }
} , [handleNegoNeeded])

  return (
    <>
      <div className="h-screen flex flex-col w-full">
        <SmallHeader
          heading=""
          height="70px"
        />
        <div className="h-[100%] flex-col flex w-full bg-[url('/wal/wal1.png')]">
          <GroupRadioButton
            first={videoInteractionBtn}
            second={codeItBtn}
            third={canvasBtn}
            setFirst={setVideoInteractionBtn}
            setSecond={setCodeItBtn}
            setThird={setCanvasBtn}
          />
          <div
            className={`${
              videoInteractionBtn ? "h-[100%]" : "h-[0px]"
            }  overflow-hidden py-2 max-h-[700px] mb-[70px] mt-[10px]  w-full flex justify-center items-end  transition-all duration-1000`}
          >
            <div
              className={`w-[700px] h-[100%] transition-all duration-1000 flex  justify-center items-center rounded-3xl bg-[#2c2c2c]  
            ${videoInteractionBtn ? "ring-4" : ""}
             ring-[#563F15] overflow-hidden`}
            >
              {!remoteSocketId ? (
                <p className="text-white font-semibold">Video is unavailable</p>
              ) : remoteStream == null ? (
                <SyncLoader color="#FBCB6B" />
              ) : (
                <ReactPlayer
                  playing
                  height={"100%"}
                  width={"100%"}
                  url={remoteStream}
                />
              )}
            </div>
            <div
              className={`w-[200px] ml-4 h-[100%] max-h-[150px]  flex justify-center items-center rounded-2xl bg-[#2c2c2c] ${
                videoInteractionBtn ? "ring-1" : ""
              } ring-[#563F15] overflow-hidden `}
            >
              {!camera ? (
                <p className="text-white font-semibold">Camera is off</p>
              ) : myStream == null ? (
                <SyncLoader color="#FBCB6B" />
              ) : (
                <ReactPlayer
                  playing
                  height={"100%"}
                  width={"100%"}
                  url={myStream}
                  muted
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-3 left-0 right-0 w-full flex justify-center items-center h-[50px] border-blue-500 ">
        <div className="p-4 h-full rounded-xl bg-[#FFCE6D] shadow-[#563F15] shadow-sm hover:shadow-md hover:shadow-[#563F15]  duration-500 transition-all flex justify-center items-center">
          <IconSwitch
            enable={camera}
            className={"mx-2"}
            onClick={(e) => {
              console.log("frf");
              setCamera((prev) => !prev);
            }}
            onImage={"/interview/camera_on.png"}
            offImage={"/interview/camera_off.png"}
          />
          <IconSwitch
            enable={mic}
            className={"mx-2"}
            onClick={(e) => {
              console.log("frf");
              setMic((prev) => !prev);
            }}
            onImage={"/interview/mic_on.png"}
            offImage={"/interview/min_off.png"}
          />
        </div>
      </div>
      <div
        className={`${
          !videoInteractionBtn ? "h-[150px] ring-4" : "h-[0px]"
        } w-[200px]  transition-all mr-2 mt-2 rounded-md shadow-orange-500 shadow-lg duration-1000 ring-[#563F15] flex overflow-hidden justify-center items-center fixed top-0 right-0 bg-[#1e1e1e]`}
      >
        {!camera ? (
          <p className="text-white font-semibold">Camera is off</p>
        ) : myStream == null ? (
          <SyncLoader color="#FBCB6B" />
        ) : (
          <ReactPlayer playing height={"100%"} width={"100%"} url={myStream} muted />
        )}
      </div>
      
    </>
  );
};

export default InterviewSession;
