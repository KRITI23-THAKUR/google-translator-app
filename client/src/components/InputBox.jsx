import { Box, MenuItem, Select, TextareaAutosize } from "@mui/material";
import { useState } from "react";

function InputBox({
  languages,
  isFromBox = false,
  lang,
  setSelectedLang,
  setInput,
  output = "",
  detectLang,
  ...props
}) {
  // to send the selected language code back, we need a setter for the selected language from the parent component

  const langArray = Object.entries(languages);
  return (
    <div>
      <Box>
        {/* the below cond is for the language dropdown to be displayed only when all the languages are loaded*/}
        {langArray.length > 0 && (
          <Select
            value={lang}
            onChange={(e) => setSelectedLang(e.target.value)}
          >
            {isFromBox && (
              <MenuItem value="auto">
                {detectLang !== "" && languages[detectLang.split("-")[0]] // Strip script suffix
                  ? `${languages[detectLang.split("-")[0]].name}-Detected`
                  : "Auto Detection"}
              </MenuItem>
            )}
            {langArray.map(([langCode, data]) => (
              <MenuItem key={langCode} value={langCode}>
                {langCode} - {data.name}
              </MenuItem>
            ))}
          </Select>
        )}
        {isFromBox ? (
          <TextareaAutosize
            minRows={2}
            placeholder={"Enter Input text here..."}
            variant="outlined"
            onChange={(e) => setInput(e.target.value)}
            {...props}
          />
        ) : (
          <TextareaAutosize
            minRows={2}
            placeholder={"Output text will appear here..."}
            variant="outlined"
            disabled
            value={output}
            {...props}
          />
        )}
      </Box>
    </div>
  );
}

export default InputBox;
