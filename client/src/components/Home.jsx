import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import { auth } from "../config/firebaseconfig";
import InputBox from "./InputBox";
import useLangs from "../hooks/useLangs";
import translateText from "../service/translate";
import { ContentPaste, Done } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
import axios from "axios";
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

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 500);
  };

  // this way of calling the translate function is not good, as it will make a lot of redundant calls to the Azure API
  // which will then increase the cost of the service.
  // instead we'll use a submit button to trigger translation and then to also make it more intuitive for the user
  // we'll do a debouncer function which will make sure that the Translator API is automatically called ONLY after the user
  // pauses typing for a certain amt of time
  // useEffect(() => {
  //   const trans = async () => {
  //     if (!input.trim()) {
  //       setDetectedLang(""); // Reset when input is empty
  //       setOutput(""); // Also reset output
  //       return;
  //     }
  //     const res = await translateText(input, toLang, fromLang);
  //     setOutput(res.translations[0].text);
  //     if (fromLang == "auto") setDetectedLang(res.detectedLanguage.language);
  //   };
  //   trans();
  // }, [input, toLang, fromLang]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const res = await translateText(input, toLang, fromLang);
      setOutput(res.translations[0].text);
      if (fromLang == "auto")
        setDetectedLang(res.detectedLanguage.language.split("-")[0]); // only get the first part of the language code to match with the available languages list
    }
  };

  const uploadAudio = (blob) => {
    axios
      .post("http://localhost:3000/transcribe", blob, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => setInput(res.data.text))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (!input.trim()) return;

    const debounceSubmit = setTimeout(() => {
      submitButton.current.click();
      // this is done because i can't call the handleSubmit function directly without an event object
      // so i'm just clicking the submit button to trigger the translation
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceSubmit);
    // if i hadn't written the above line, the function would no longer be debounce as it would be called on every input change
    // so i needed to make sure that i only call this when there is truly a pause in the typing
    // it clears the previous timeout whenever a new input is detected or when the component is unmounted
  }, [input]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser({
          photoURL: "",
          displayName: "Guest",
          email: "",
        });
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
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
        onKeyDown={(e) => e.Key === "Enter" && handleSubmit(e)}
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
