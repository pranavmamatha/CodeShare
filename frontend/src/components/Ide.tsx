import React, { useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import axios from "axios";

const wsURL = import.meta.env.VITE_WS_URL;
const backendURL = import.meta.env.VITE_BACKEND_URL;

function ActionButton({
  onClick,
  children,
  variant = "primary",
  style = {},
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  style?: React.CSSProperties;
}) {
  const baseStyle = {
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    minWidth: "80px",
  };

  const variants = {
    primary: {
      backgroundColor: "#4CAF50",
      boxShadow: "0 2px 4px rgba(76, 175, 80, 0.3)",
    },
    secondary: {
      backgroundColor: "#6c757d",
      boxShadow: "0 2px 4px rgba(108, 117, 125, 0.3)",
    },
  };

  return (
    <button
      onClick={onClick}
      style={{ ...baseStyle, ...variants[variant], ...style }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor =
          variant === "primary" ? "#45a049" : "#5a6268";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor =
          variant === "primary" ? "#4CAF50" : "#6c757d";
        e.currentTarget.style.transform = "translateY(0px)";
      }}
    >
      {children}
    </button>
  );
}

function Spinner() {
  const spinnerStyle = {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
      <div style={spinnerStyle}></div>
    </>
  );
}

export default function Ide(props: { roomId: string }) {
  const [code, setCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    async function InitialData() {
      const data = (await axios.get(`${backendURL}/data/${props.roomId}`)).data;
      setCode(data.code);
    }
    InitialData();

    ws.current = new WebSocket(wsURL);
    const joinData = JSON.stringify({
      type: "join",
      payload: {
        roomId: props.roomId,
      },
    });
    setTimeout(() => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(joinData);
      }
    }, 2000);

    ws.current.onmessage = (event) => {
      setCode(event.data);
    };
  }, []);

  const onChange = React.useCallback((value: string) => {
    setCode(value);
    const data = JSON.stringify({
      type: "code",
      payload: {
        roomId: props.roomId,
        code: value,
      },
    });
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(data);
    }
  }, []);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Room URL copied to clipboard!");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard!");
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `code-${props.roomId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const roomId = (await axios.get(backendURL)).data.roomId;
      window.open(`/${roomId}`, "_blank");
    } catch (error) {
      console.error("Failed to create new room:", error);
    }
    setIsCreating(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#1a1a1a",
        color: "white",
      }}
    >
      <div
        style={{
          padding: "20px 20px",
          backgroundColor: "#2a2a2a",
          borderBottom: "1px solid #404040",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
          onClick={() => (window.location.href = "/")}
        >
          <img
            src="/favicon.ico"
            alt="CodeShare"
            style={{
              width: "40px",
              height: "40px",
            }}
          />
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#888",
            fontFamily: "monospace",
          }}
        >
          Room ID: {props.roomId} (This room will expire 24h from creation)
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <ActionButton onClick={handleShare} variant="primary">
            Share
          </ActionButton>
          <ActionButton onClick={handleCopy} variant="secondary">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 16V18.8C8 19.9201 8 20.4802 8.21799 20.908C8.40973 21.2843 8.71569 21.5903 9.09202 21.782C9.51984 22 10.0799 22 11.2 22H18.8C19.9201 22 20.4802 22 20.908 21.782C21.2843 21.5903 21.5903 21.2843 21.782 20.908C22 20.4802 22 19.9201 22 18.8V11.2C22 10.0799 22 9.51984 21.782 9.09202C21.5903 8.71569 21.2843 8.40973 20.908 8.21799C20.4802 8 19.9201 8 18.8 8H16M5.2 16H12.8C13.9201 16 14.4802 16 14.908 15.782C15.2843 15.5903 15.5903 15.2843 15.782 14.908C16 14.4802 16 13.9201 16 12.8V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H5.2C4.0799 2 3.51984 2 3.09202 2.21799C2.71569 2.40973 2.40973 2.71569 2.21799 3.09202C2 3.51984 2 4.07989 2 5.2V12.8C2 13.9201 2 14.4802 2.21799 14.908C2.40973 15.2843 2.71569 15.5903 3.09202 15.782C3.51984 16 4.07989 16 5.2 16Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </ActionButton>
          <ActionButton onClick={handleDownload} variant="secondary">
            Download
          </ActionButton>
          <ActionButton
            onClick={handleCreate}
            variant="secondary"
            style={{ minWidth: isCreating ? "100px" : "80px" }}
          >
            {isCreating ? <Spinner /> : "Create"}
          </ActionButton>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: "20px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: "8px",
            overflow: "auto",
            border: "1px solid #404040",
          }}
        >
          <CodeMirror
            value={code}
            height="100%"
            theme="dark"
            extensions={[javascript({ jsx: true })]}
            onChange={onChange}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              highlightSelectionMatches: false,
              searchKeymap: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}
