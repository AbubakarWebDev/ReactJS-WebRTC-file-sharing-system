# ReactJS WebRTC File Sharing System

Welcome to the ReactJS WebRTC File Sharing System, a cutting-edge application that leverages the power of WebRTC and the simple-peer library to enable seamless and efficient file sharing between multiple peers in real-time.

## Key Features

1. **One-to-Many File Sharing:** This application allows one peer to initiate the file sharing process by uploading a file and generating a unique room link. Other peers can join this room by accessing the link and establish a connection with the initiator.

2. **WebRTC-powered Communication:** The system utilizes WebRTC technology along with the simple-peer library to facilitate direct peer-to-peer communication. Peers exchange ICE and SDP offers and answers to establish a secure and efficient connection.

3. **Real-Time Progress Tracking:** Throughout the file sharing process, our application provides real-time progress tracking on both ends in the form of percentages. This feature keeps users informed about the current status of file chunk sending and receiving.

4. **Efficient Chunking:** Files are broken down into specific inputted-sized chunks before being sent over the data channel. This approach ensures optimal transmission efficiency and minimizes the risk of data loss during the transfer.

5. **Seamless Downloading:** Once the file transfer reaches 100% completion, the shared file is automatically downloaded to the user's system. This straightforward process makes accessing the shared content quick and hassle-free.

## How to Use

1. **Initiate File Sharing:** As the initiator, upload the file you wish to share and generate a unique room link.

2. **Joining the Room:** Other peers can join the room by clicking on the shared link and establish a connection with the initiator.

3. **Monitor Progress:** Throughout the file sharing process, both the initiator and joining peers can view the real-time progress as the file is sent and received in chunks.

4. **Automated Download:** Once the file transfer reaches 100%, the shared file will be automatically downloaded to the system, ensuring a smooth and efficient user experience.

## Contribution

Please feel free to contribute to this open-source project, report issues, and suggest improvements. Let's make file sharing smarter and more convenient together!

## License

This project is licensed under the [MIT License](LICENSE).
