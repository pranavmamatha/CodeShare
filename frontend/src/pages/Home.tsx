import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const backendURL = import.meta.env.VITE_BACKEND_URL;

function Button({onclick}:{onclick: React.MouseEventHandler<HTMLButtonElement>}){
    return <button
      onClick={onclick}
      style={{
        backgroundColor: "#4CAF50",
        color: "white",
        padding: "12px 24px",
        border: "none",
        borderRadius: "8px",
        fontSize: "18px",
        fontWeight: "bold",
        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#45a049")}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#4CAF50")}
    >
      Share your code now
    </button>
}

function Spinner() {
  const spinnerStyle = {
    width: "40px",
    height: "40px",
    border: "5px solid rgba(0, 0, 0, 0.1)",
    borderTop: "5px solid #4CAF50",
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

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  async function onclick() {
    setIsLoading(true)
    const roomId = (await axios.get(backendURL)).data.roomId;
    navigate(`/${roomId}`);
    setIsLoading(false)
  }

 return (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "black",
      gap: "40px",
    }}
  >
    <img 
      src="/android-chrome-512x512.png" 
      alt="CodeShare Logo" 
      style={{
        width: "175px",
        height: "175px",
        borderRadius: "20px",
        boxShadow: "0 8px 32px rgba(76, 175, 80, 0.3)",
      }}
    />
    {isLoading ? <Spinner/> : <Button onclick={onclick}/>}
  </div>
);
}