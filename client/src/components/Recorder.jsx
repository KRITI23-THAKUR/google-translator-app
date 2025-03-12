import React, { useEffect } from "react";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import StopOutlinedIcon from "@mui/icons-material/StopOutlined";
import { Button } from "@mui/material";

function Recorder(uploadAudio) {
  const [permission, setPermission] = setState(false);
  const [stream, setStream] = setState(null);
  const [audioChunks, setAudioChunks] = setState([]);
  const [recording, setRecording] = setState(false);

  let mediaRecorder;

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
    if (permission) {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      mediaRecorder.ondataavailable = (e) => {
        setAudioChunks([...audioChunks, e.data]);
      };

      setRecording(true);
    } else getAudioPermission();
  };

  const stopRecording = () => {
    if (mediaRecorder.state === "recording") {
      mediaRecorder.stop();

      mediaRecorder.onstop = () => {
        const audioToBlob = new Blob(audioChunks, { type: "audio/webm" });

        // now since we need access of the output transcription in the main file
        // to be able to put it into the input box
        // hence, we'll called an uploader function from the main file
        // and pass the audioToBlob as an argument to it

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
