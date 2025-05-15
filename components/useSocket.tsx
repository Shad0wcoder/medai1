import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ResponseData, AnswerData, FormatData } from "@/lib/minterfaces";

const SOCKET_URL = "http://127.0.0.1:8000";

export default function useSocket(setMessages: React.Dispatch<React.SetStateAction<FormatData[]>>, messages: FormatData[]) {
    const socketref = useRef<Socket | null>(null);
    const [message, setMessage] = useState<ResponseData[]>([]);
    const [nameSet, setNameSet] = useState(false);
    const [resdict, setResdict] = useState<ResponseData>({
        qkey: 0,
        ic: -1,
        q: '',
        ql: [],
    });

    const [ql, setQl] = useState<string[][]>([]);
    const [i, setI] = useState<number>(0);
    const [answerStack, setAnswerStack] = useState<string[]>([]);

    useEffect(() => {
        const socket = io(SOCKET_URL, {
            transports: ['websocket'],
            withCredentials: true,
        });

        socket.on('connect', () => {
            console.log("Connected:", socket.id);
        });

        socket.on('response', (data: ResponseData) => {
            console.log("Received:", data);

            // Log `p` and `r` if they exist
            if (data.p) console.log("p:", data.p);
            if ('r' in data && data.r != null) console.log("r:", data.r);

            // Update state with response data
            setMessage((prev) => [...prev, data]);
            setResdict(data);

            // Display `p` in chat if exists
            if (data.p) {
                setMessages((prev) => [...prev, { sender: 'MedAi', text: `You may have ${data.p}` }]);
            }

            // Display `r` in chat if exists
            type RKeys = keyof NonNullable<ResponseData["r"]>; // 'desc' | 'prec'

            const key: RKeys = "desc"; // or dynamically set
            // Ensure 'prec' is an array of strings and join them with line breaks
            if (data.r) {
                if (data.r.prec && data.r.desc) {
                    const desc = data.r.desc;
                    const precautionsList = data.r.prec.map((item) => `- ${item}`).join('\n');

                    setMessages((prev) => [
                        ...prev,
                        {
                            sender: 'MedAi',
                            text: `Related: ${desc}\n\nPrecautions:\n${precautionsList}\n\n`
                        }
                    ]);
                }
                else {
                    setMessages((prev) => [...prev, { sender: 'MedAi', text: `Related:\n${data.r}` }]);
                }
            }

            // Construct and display main question
            const displayText = data.ql?.length
                ? `${data.q}`
                : data.q;

            setMessages((prev) => [...prev, { sender: 'MedAi', text: displayText }]);

            // Handle yes/no type questions
            if (data.qkey === 5) {
                const newQl = data.ql as string[][];
                setQl(newQl);
                setI(0);
                setAnswerStack([]);

                if (newQl[0]) {
                    const [short, desc] = newQl[0];
                    setMessages((prev) => [...prev, { sender: 'MedAi', text: `${short} -> ${desc}` }]);
                }
            }

        });

        socketref.current = socket;

        return () => {
            socket.disconnect();
        };
    }, [setMessages]);

    const updatedChat = (sender: string, text: string) => {
        setMessages((prev) => [...prev, { sender, text }]);
        console.log("Updated chat:", { sender, text });
    };

    const setName = (name: string) => {
        if (!nameSet) {
            socketref.current?.emit('set_name', { name });
            setNameSet(true);
        }
    };

    const sendMessage = (msg: string) => {
        console.log("Sending message:", msg);


        if (resdict.qkey === 5) {
            if (msg === "yes" || msg === "no") {
                const nextI = i + 1;
                let newStack = [...answerStack];

                if (msg === "yes" && ql[i]) {
                    newStack.push(ql[i][0]);
                }

                console.log("nextI:", nextI);
                console.log("prevStack:", answerStack);
                console.log("newStack:", newStack);

                setAnswerStack(newStack);
                setI(nextI);

                if (nextI >= ql.length) {
                    const finalAnswer: AnswerData = {
                        qkey: resdict.qkey,
                        ic: resdict.ic,
                        answer: newStack,
                        ql: resdict.ql,
                        atype: "str",
                    };
                    socketref.current?.emit('my_event', finalAnswer);
                } else {
                    const [short, desc] = ql[nextI];
                    updatedChat("MedAi", `${short} -> ${desc}`);
                }
            } else {
                updatedChat("MedAi", "Answer in yes or no!");
            }
        }
        else {
            const answerData: AnswerData = {
                qkey: resdict.qkey,
                ic: resdict.ic,
                answer: msg,
                ql: resdict.ql,
                atype: "str",
            };
            socketref.current?.emit('my_event', answerData);
        }
    };
    const sendImage = async (file: File) => {
        const reader = new FileReader();
        reader.onload = async function () {
            const base64Image = reader.result?.toString().split(',')[1];  // Remove data:image/...;base64,
            if (!base64Image) return alert("Error in encoding image.");

            // Send image data through socket
            const imageData = {
                answer: base64Image,
                atype: 'img',
                qkey: resdict.qkey,
                ic: resdict.ic,
                ql: resdict.ql,
            };

            updatedChat("You", "[Image sent]");
            console.log("Sending image data:", imageData);
            socketref.current?.emit('my_event', imageData);
        };
        reader.readAsDataURL(file);
    };

    return { message, setName, sendMessage, sendImage };
}
