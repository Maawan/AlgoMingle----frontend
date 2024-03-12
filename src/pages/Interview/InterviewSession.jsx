import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import SmallHeader from "../../components/SmallHeader";
import IconSwitch from "../../components/IconSwitch";
import GroupRadioButton from "../../components/GroupRadioButton";
import ReactPlayer from "react-player";
import toast from "react-hot-toast";
import { SyncLoader } from "react-spinners";
import peer from "../../services/peer"
import { useSocket } from "../../context/SocketProvider";

let count = 0;
const InterviewSession = () => {
  const { roomId } = useParams();
  const [search] = useSearchParams();
  const socket = useSocket();
  const navigate = useNavigate();
  
  const [camera, setCamera] = useState(
    search.get("camera") === "true" ? true : false
  );
  const [mic, setMic] = useState(search.get("mic") === "true" ? true : false);
  const [myStream, setMyStream] = useState(null);
  const [videoInteractionBtn, setVideoInteractionBtn] = useState(true);
  const [codeItBtn, setCodeItBtn] = useState(false);
  const [canvasBtn, setCanvasBtn] = useState(false);
  const [remoteStream , setRemoteStream] = useState(null);
  // const [remoteSocketId , setRemoteSocketId] = useState(null);

  
  const handleUserJoined = useCallback(({ message }) => {
    console.log(`Email ${message} joined room`);
    setRemoteSocketId(null);
  }, []);
  
  
  
  
  
  
  
  
  
  useEffect(() => {
    // initalizeStream(mic, camera);
    // console.log("Mic Status : " + mic);
  }, [camera, mic]);

  useEffect(() => {
    if (!camera) {
      closeVideo();
    }
  }, [camera]);

  const initalizeStream = async (mic, camera) => {
    if (!camera) {
      closeVideo();
    }
    if (!mic) {
      closeAudio();
    }
    setMyStream(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: mic,
        video: camera,
      });
      setMyStream(stream);
    } catch (error) {
      if (mic || camera) {
        toast.error("Please Allow Camera and Mic access");
        closeAudio();
        closeVideo();
        setMic(false);
        setCamera(false);
      }
    }
  };

  const closeAudio = () => {
    if (myStream !== null) {
      myStream.getTracks().forEach((track) => {
        if (track.kind === "audio") {
          track.stop();
        }
      });
    }
  };
  const closeVideo = () => {
    if (myStream != null) {
      myStream.getTracks().forEach((track) => {
        if (track.kind === "video") {
          track.stop();
        }
      });
    }
  };
  const couldNotJoin = ({message}) => {
    toast.error("Oops ! At max 2 persons are allowed in an interview");
    navigate("/")
  }

  const handleCallUser = useCallback(async (oponentSocketId) => {
    const offer = await peer.getOffer();
    
    socket.emit("incomming_call", { to: oponentSocketId, offer });
  }, [remoteSocketId, socket]);

  const sendStreams = useCallback(async() => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });
          setMyStream(stream);
  }, [myStream]);

  useEffect(()=>{
    
    if(myStream !== null && peer !== null){
      for (const track of myStream.getTracks()) {
        if(track.kind === "video"){
          console.log("Yup, we are sending from here");
        }
        peer.peer.addTrack(track, myStream);
      }
    }
    
  },[myStream , peer])

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      //peer = new Peer();
      setRemoteSocketId(from);
    
      console.log(`Incoming Call`, from, offer);
      console.log(peer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    //   sendStreams();
      
    },
    [socket]
  );


  const startTheProcess = ({oponentSocketId})=>{
    console.log("Start the Process Please, your oponent is " , oponentSocketId);
    //peer = new Peer();
    setRemoteSocketId(oponentSocketId);
    handleCallUser(oponentSocketId);
  }

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      socket.emit("share-data" , {roomId});
    },
    [sendStreams]
  );

  useEffect(() => {
    
      peer.peer.addEventListener("track", async (ev) => {
        
        
          const remoteStreamTemp = ev.streams[0];
          console.log("GOT TRACKS!!");
          console.log(remoteStreamTemp+ " is this video");
          setRemoteStream(null);
          setRemoteStream(remoteStreamTemp); 
          remoteVideoRef.current.srcObject = new MediaStream();
          remoteStreamTemp.getTracks().forEach((track) => {
            if (track.kind === "video") {
              //remoteVideoRef.current = new MediaStream();
              remoteVideoRef.current.srcObject.addTrack(track)
              // remoteVideoRef.current.play();
              console.log("Got Video");
            }else if(track.kind === "audio"){
              console.log("Got Audio");
              remoteVideoRef.current.srcObject.addTrack(track)
              
            }
            videoSetVideo();
          });
        
      });
    
    
    return () => {

    }
  }, [socket , peer]);

  const videoSetVideo = async() => {
    
    await remoteVideoRef.current.play();
  }

  useEffect(()=>{
    if(remoteVideoRef.current){
      remoteVideoRef.current.play();
      console.log("Playing ... ");
    }
  },[remoteVideoRef])

  const handleNegoNeeded = useCallback(async () => {
    //peer = new Peer();
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    if(peer !== null){
      peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    }
    
    return () => {
      
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      //peer = new Peer();
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );
  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    try {
      
      await peer.peer.setLocalDescription(ans);
    } catch (error) {
     // startTheProcess({oponentSocketId : remoteSocketId})
    }
  }, []);

  const send = () => {
    sendStreams();
  }

  useEffect(()=>{
    socket.on("user:joined" , handleUserJoined);
    socket.on("401-restricted" , couldNotJoin);
    socket.on("start_the_connection_process" , startTheProcess);
    socket.on("incomming_call" , handleIncommingCall);
    socket.on("call:accepted" , handleCallAccepted);
    socket.on("share_streams" , send)
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    return ()=>{

        socket.off("user:joined" , handleUserJoined);
        socket.off("401-restricted" , couldNotJoin);
        socket.off("start_the_connection_process" , startTheProcess);
        socket.off("incomming_call" , handleIncommingCall);
        socket.off("call:accepted" , handleCallAccepted);
        socket.off("peer:nego:needed", handleNegoNeedIncomming);
        socket.off("peer:nego:final", handleNegoNeedFinal);
        socket.off("share_streams" , send)
    }
  },[socket,
    handleUserJoined,
    couldNotJoin,
    startTheProcess,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal]);

    useEffect(()=>{
        socket.emit("interview_init" , {from : socket.id , roomId})
    },[])

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
              {!camera ? (
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
