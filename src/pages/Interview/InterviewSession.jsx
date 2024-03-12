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
