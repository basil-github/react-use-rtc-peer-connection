# useRTCPeerConnection Hook
This React hook simplifies the creation and management of RTCPeerConnection for WebRTC communication within your React applications.

## Demo

Insert gif or link to demo
- https://youtu.be/t2-O1tfnkHU
- https://webrtc-channel-chat.vercel.app

Example code is given below 

## Installation

Assuming you have npm or yarn installed, run the following command in your terminal:



## Installation

NPM

```bash
 npm install use-rtc-peer-connection
```
YARN

```bash
 yarn add use-rtc-peer-connection
```
## Usage

Import the hook:

```bash
import { useRTCPeerConnection } from 'use-rtc-peer-connection';
```

Call the hook:
```bash
const { peerConnection, createOffer, setRemote, dataChannel, isOpen, data, iceCandidate } = useRTCPeerConnection({
  offer: /* remote peer offer (optional) */,
  configuration: /* RTCConfiguration options (optional) */
});
```

## Hook Options

- offer: (optional) The SDP offer received from the remote peer, if applicable.
- configuration: (optional) An RTCConfiguration object to customize the peer connection configuration.
## Hook State and Functions
- peerConnection: The RTCPeerConnection object, or null if not yet initialized.
- createOffer: A function to create an offer description.
- setRemote: A function to set the remote description.
- dataChannel: The RTCDataChannel object for data transfer, or null if not yet established.
- isOpen: A boolean indicating whether the data channel is open.
- data: The data received through the data channel, or null if no data has been received.
- iceCandidate: The latest generated ICE candidate, or null if none available.

## Example

- [example.tsx](https://gist.githubusercontent.com/basil-github/753712528271825828aaa1ebc9b941fe/raw/42eb586e53cbd167dc85617544b411e9b8df6526/example.tsx)
## Contributing

Contributions are welcome! Please refer to the contribution guidelines: https://github.com/basil-github/react-use-rtc-peer-connection.git for more information.

## Authors

- [@beacel](https://beacel.com)

