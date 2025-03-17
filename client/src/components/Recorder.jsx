import React, { useEffect, useState, useRef } from "react";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import StopOutlinedIcon from "@mui/icons-material/StopOutlined";
import { Button } from "@mui/material";

function Recorder({ uploadAudio }) {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    getAudioPermission();
  }, []);

  const getAudioPermission = () => {
    if (!permission) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((strm) => {
          setStream(strm);
          setPermission(true);
        })
        .catch((err) => console.error(err));
    }
  };

  const startRecording = () => {
    if (permission && stream) {
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();

      mediaRecorderRef.current.ondataavailable = (e) => {
        setAudioChunks((prevChunks) => [...prevChunks, e.data]);
      };

      setRecording(true);
    } else {
      getAudioPermission();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();

      mediaRecorderRef.current.onstop = () => {
        const audioToBlob = new Blob(audioChunks, { type: "audio/webm" });
        uploadAudio(audioToBlob);
        setAudioChunks([]);
        setRecording(false);
      };
    }
  };

  return (
    <div>
      {!recording ? (
        <Button onClick={startRecording} variant="contained">
          <MicNoneOutlinedIcon />
          <div>Start</div>
        </Button>
      ) : (
        <Button onClick={stopRecording} variant="contained">
          <StopOutlinedIcon />
          <div>Stop</div>
        </Button>
      )}
    </div>
  );
}

export default Recorder;
