import React, { useState, useRef } from 'react';
import { Form, Container, Button } from 'react-bootstrap';

import Peer from "simple-peer";
import { v1 as uuid } from "uuid";

import { room2Socket as socket } from "../socket";

function Home() {
    const peerRef = useRef();
    const [file, setFile] = useState(null);
    const [isLinkGenerated, setIsLinkGenerated] = useState(false);
    const [progressPercentage, setProgressPercentage] = useState({});

    function selectFile(e) {
        setFile(e.target.files[0]);
    }

    function sendFile() {
        // Get the reference to the peer object
        const peer = peerRef.current;

        // Keep track of the current byte position in the file
        let totalSentBytes = 0;

        // Set the chunk size to 10KB (adjust as needed)
        const chunkSize = 10 * 1024;

        // getting the size of the file
        const totalFileSize = file.size;

        // Send the totalFileSize before sending the actual file chunk
        peer.write(JSON.stringify({ type: "fileMetaData", totalFileSize }));

        function readNextChunk() {
            // Calculate the ending byte for the current chunk
            const endingByte = Math.min(totalSentBytes + chunkSize, totalFileSize);

            // Slice the file to get the current chunk
            const fileChunk = file.slice(totalSentBytes, endingByte);

            // Create a readable stream from the current chunk
            const stream = fileChunk.stream();

            // Get the reader to read from the stream
            const reader = stream.getReader();

            // Read the chunk from the stream
            reader.read().then((obj) => {
                // Send the chunk data to the peer using the simple-peer library
                peer.write(obj.value);

                // Calculate and update the progress percentage
                setProgressPercentage((prev) => {
                    return {
                        ...prev,
                        [peer.channelName]: (totalSentBytes / totalFileSize) * 100
                    };
                });

                // If there is more data to send, move to the next chunk
                if (totalSentBytes < totalFileSize) {
                    totalSentBytes = endingByte;
                    readNextChunk();
                }
                else {
                    // If the last chunk has been sent, send the "done" message
                    peer.write(JSON.stringify({ done: true, fileName: file.name, type: "fileData" }));
                    return;
                }
            });
        }

        // Start reading and sending the file in chunks
        readNextChunk();
    }


    function createPeer(userToSignal, callerID) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
        });

        peer.on("signal", (signal) => {
            socket.emit("sending_sdp_offer", {
                userToSignal,
                callerID,
                signal,
            });
        });

        return peer;
    }

    function generateLink() {
        if (!file) {
            alert("Please Select a file First!");
            return;
        }

        const roomID = uuid();

        socket.emit("join_room", { roomID, init: true });
        setIsLinkGenerated(`http://localhost:3000/room/${roomID}`);

        socket.on("peer_connected", (peer) => {
            peerRef.current = createPeer(peer, socket.id);
        });

        function onReceiving_SDP_Answer(payload) {
            peerRef.current.signal(payload.signal);

            peerRef.current.on('connect', () => {
                setProgressPercentage((prev) => {
                    return {
                        ...prev,
                        [peerRef.current.channelName]: 0
                    };
                });

                sendFile();
            });

            peerRef.current.on('close', () => {
                console.log('Disconnected to peer!');
            });

            peerRef.current.on('error', (err) => {
                if (err.code === 'ERR_CONNECTION_FAILURE') {
                    console.log('Disconnected to peer!');
                }
            });
        }

        socket.on("receive_sdp_answer", onReceiving_SDP_Answer);
    }

    function copy() {
        let text = document.getElementById("text");
        text.select();
        document.execCommand("copy");
    }

    return (
        <Container className="text-center">
            <Form>
                <Form.Label>Select the File:</Form.Label>
                <Form.Control
                    size="lg"
                    type="file"
                    required
                    onChange={selectFile}
                ></Form.Control>
            </Form>
            <br /><br />

            <Button onClick={generateLink}>Generate Link</Button>
            <br /><br />

            {isLinkGenerated && (
                <Form>
                    <Form.Group>
                        <Form.Label>Your Room URL: (Share with Anyone in World)</Form.Label>
                        <br /><br />

                        <Form.Control
                            readOnly
                            size="lg"
                            id="text"
                            type="text"
                            value={isLinkGenerated}
                        />
                    </Form.Group>

                    <br /><br />
                    <Button onClick={copy} variant="primary">
                        Copy to Clipboard
                    </Button>
                </Form>
            )}

            {Object.values(progressPercentage).map((percentage, index) => (
                <p key={index}> {percentage.toFixed()}% </p>
            ))}
        </Container>
    );
}

const MemoizedHome = React.memo(Home);
export default MemoizedHome;