import React, { useEffect, useRef, useState } from "react";
import { Container, Spinner, Button } from "react-bootstrap";

import Peer from "simple-peer";
import streamSaver from "streamsaver";

import { useParams } from "react-router-dom";

import { room2Socket as socket } from "../socket";

const worker = new Worker("/worker.js");

function Room() {
    const { roomID } = useParams();

    const peerRef = useRef(null);
    const fileSize = useRef(null);
    const totalReceivedBytes = useRef(0);

    const [gotFile, setGotFile] = useState(false);
    const [completeFile, setCompleteFile] = useState(false);
    const [connectionEstablished, setConnection] = useState(false);
    const [progressPercentage, setProgressPercentage] = useState(0);


    function downloadFile() {
        worker.postMessage("download");

        worker.addEventListener("message", (event) => {
            const stream = event.data.stream();

            const fileStream = streamSaver.createWriteStream(JSON.parse(data).fileName);

            stream.pipeTo(fileStream);
        });
    }

    function handleReceivingData(data) {
        if (data.toString().includes("fileMetaData")) {
            fileSize.current = JSON.parse(data).totalFileSize;
            setGotFile(true);
        }
        else {
            if (data.toString().includes("done")) {
                setCompleteFile(true);
            }
            else {
                totalReceivedBytes.current += data.length;

                if (fileSize.current) setProgressPercentage((totalReceivedBytes.current / fileSize.current) * 100);

                worker.postMessage(data);
            }
        }
    }

    function addPeer(incomingSignal, callerID) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
        });

        peer.on("signal", (signal) => {
            socket.emit("sending_sdp_answer", { signal, callerID });
        });

        peer.on("data", handleReceivingData);

        peer.signal(incomingSignal);

        return peer;
    }

    useEffect(() => {
        socket.emit("join_room", { roomID, init: false });

        function onReceiving_SDP_offer(payload) {
            peerRef.current = addPeer(payload.signal, payload.callerID);

            peerRef.current.on('connect', () => {
                setConnection(true);
            });

            peerRef.current.on('close', () => {
                setConnection(false);
            });

            peerRef.current.on('error', (err) => {
                if (err.code === 'ERR_CONNECTION_FAILURE') {
                    setConnection(false);
                }

                console.log(err);
            });
        }

        socket.on("receive_sdp_offer", onReceiving_SDP_offer);

        return () => {
            peerRef.current.destroy();
            socket.off("receive_sdp_offer", onReceiving_SDP_offer);
        }
    }, []);

    return (
        <Container>
            {connectionEstablished ? (
                <Container className="text-center">
                    <br /><br />

                    <h1>Connected With Peer (You can Share or Transfer Files)</h1>

                    <br /><br />
                </Container>
            ) : (
                <Container className="text-center">
                    <br /> <br />

                    <h1>Waiting for the Peer to Join</h1>

                    <br /><br />

                    <Spinner animation="grow" variant="primary" />
                    <Spinner animation="grow" variant="success" />
                    <Spinner animation="grow" variant="danger" />
                </Container>
            )}

            {gotFile && (
                <Container className="text-center">
                    {progressPercentage.toFixed()}%
                </Container>
            )}

            {completeFile && (
                <Container className="text-center">
                    <br /><br />

                    <h3> You have received a file. Would you like to download the file? </h3>
                    <br />

                    <Button onClick={downloadFile}>Yes</Button>
                </Container>
            )}
        </Container>
    );
}

const MemoizedRoom = React.memo(Room);
export default MemoizedRoom;