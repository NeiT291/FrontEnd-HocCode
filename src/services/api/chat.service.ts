import axios from "axios";

export async function sendChatMessage(message: string) {
  const res = await axios.post(
    "http://localhost:8080/api/v1/chat",
    {
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    }
  );

  return res.data; // { reply: "..." }
}
