import React from 'react'
import { useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom';

const InterviewSession = () => {
    const {roomId} = useSearchParams();
    console.log(roomId);
    const verifyRoomId = () => {

    }



  return (
    <div>InterviewSession {JSON.stringify(roomId)}</div>
  )
}

export default InterviewSession