import React, { useEffect, useState } from "react";
import Header from "./Header";
import { auth } from "../config/firebaseconfig";
import InputBox from "./InputBox";
import useLangs from "../hooks/useLangs";
import translateText from "../service/translate";
import { ContentPaste, Done } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

function Home() {
  const [user, setUser] = useState({});

  const [fromLang, setFromLang] = useState("auto");
  const [toLang, setToLang] = useState("en");

  const [input, setInput] = useState("");

  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const [detectedLang, setDetectedLang] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 500);
  };

  useEffect(() => {
    const trans = async () => {
      if (!input.trim()) {
        setDetectedLang(""); // Reset when input is empty
        setOutput(""); // Also reset output
        return;
      }
      const res = await translateText(input, toLang, fromLang);
      setOutput(res.translations[0].text);
      if (fromLang == "auto") setDetectedLang(res.detectedLanguage.language);
    };
    trans();
  }, [input, toLang, fromLang]);

  const languages = useLangs();
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
      <InputBox
        languages={languages}
        isFromBox
        lang={fromLang}
        setSelectedLang={setFromLang}
        setInput={setInput}
        detectLang={detectedLang}
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
    </div>
  );
}

export default Home;
