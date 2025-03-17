import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import { auth } from "../config/firebaseconfig";
import InputBox from "./InputBox";
import useLangs from "../hooks/useLangs";
import translateText from "../service/translate";
import { ContentPaste, Done } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
// import axios from "axios";
import Recorder from "./Recorder";

function Home() {
  const [user, setUser] = useState({});

  const [fromLang, setFromLang] = useState("auto");
  const [toLang, setToLang] = useState("en");

  const [input, setInput] = useState("");

  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const [detectedLang, setDetectedLang] = useState("");

  const languages = useLangs();

  const submitButton = useRef(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      // const res = await translateText(input, toLang, fromLang);
      // setOutput(res.translations[0].text);
      // if (fromLang == "auto")
      //   setDetectedLang(res.detectedLanguage.language.split("-")[0]);
    }
  };

  const uploadAudio = (blob) => {
    // const formData = new FormData();
    // formData.append("audio", blob);

    // axios
    //   .post("http://localhost:3000/transcribe", formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   })
    //   .then((res) => setInput(res.data.text))
    //   .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (!input.trim()) return;

    const debounceSubmit = setTimeout(() => {
      submitButton.current.click();
    }, 500);

    return () => clearTimeout(debounceSubmit);
  }, [input]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(
        authUser || {
          photoURL: "",
          displayName: "Guest",
          email: "",
        }
      );
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Header user={user} />
      <Recorder uploadAudio={uploadAudio} />
      <InputBox
        languages={languages}
        isFromBox
        lang={fromLang}
        setSelectedLang={setFromLang}
        setInput={setInput}
        detectLang={detectedLang}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
      />
      <InputBox
        languages={languages}
        lang={toLang}
        setSelectedLang={setToLang}
        output={output}
      />

      <Tooltip title={!copied ? "Copy" : "Copied!"} arrow>
        <IconButton onClick={handleCopy}>
          {!copied ? (
            <ContentPaste sx={{ transition: "all 300ms ease-in-out" }} />
          ) : (
            <Done sx={{ transition: "all 300ms ease-in-out" }} />
          )}
        </IconButton>
      </Tooltip>

      <Button
        type="submit"
        variant="contained"
        onClick={(e) => handleSubmit(e)}
        ref={submitButton}
      >
        Translate
      </Button>
    </div>
  );
}

export default Home;
