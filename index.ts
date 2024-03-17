import { useState, useEffect } from "react";

/**
 * Interface defining the properties returned by the `useRTCPeerConnection` hook.
 */
interface RTCPeerConnectionHook {
    /** The RTCPeerConnection object, or null if not yet initialized. */
    peerConnection: RTCPeerConnection | null;
    /**
     * A function that creates and returns a promise resolving to the generated offer description.
     * Rejects with an error if the peer connection is not initialized.
     */
    createOffer: () => Promise<RTCSessionDescriptionInit | undefined>;
    /**
     * A function that sets the remote description of the peer connection and returns a promise.
     * Rejects with an error if the peer connection is not initialized.
     */
    setRemote: (offer: RTCSessionDescriptionInit) => Promise<void>;
    /** The RTCDataChannel object associated with the peer connection, or null if not yet established. */
    dataChannel: RTCDataChannel | null;
    /** A boolean indicating whether the data channel is open. */
    isOpen: boolean;
    /** The data received through the data channel, or null if no data has been received. */
    data: any;
    iceCandidate: RTCIceCandidate | null
}

/**
 * A React hook that creates and manages an RTCPeerConnection for WebRTC communication.
 *
 * @param {object} options - Configuration options for the hook.
 * @param {string} options.offer - The ID of the remote peer. This is typically the SDP string received from the other party.
 * @param {RTCConfiguration} [options.configuration] - Optional configuration options for the RTCPeerConnection.
 * @returns {RTCPeerConnectionHook} An object containing the state and functions related to the RTCPeerConnection.
 */
export const useRTCPeerConnection = ({ offer, configuration }: { configuration?: RTCConfiguration, offer: RTCSessionDescriptionInit }): RTCPeerConnectionHook => {
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [data, setData] = useState(null)
    const [iceCandidate, setIceCandidate] = useState<RTCIceCandidate | null>(null)


    useEffect(() => {
        const initializePeerConnection = async () => {
            try {
                const pc = new RTCPeerConnection(configuration);
                setPeerConnection(pc);
                if (!offer) {
                    const dc = pc.createDataChannel("dataChannel");
                    setDataChannel(dc);
                    dc.onmessage = (event) => setData(event.data)
                    dc.onopen = () => { setIsOpen(true); }
                    dc.onclose = () => { setIsOpen(false); }
                } else {
                    const rc = new RTCPeerConnection(configuration);
                    if (!rc) {
                        throw new Error("Peer connection not initialized");
                    }
                    try {
                        rc.ondatachannel = e => {
                            const rc = e.channel;
                            setDataChannel(rc)
                            rc.onmessage = (event) => setData(event.data)
                            rc.onopen = () => { setIsOpen(true); }
                            rc.onclose = () => { setIsOpen(false); }
                        }
                        rc.ontrack = e => {
                            console.log(e);

                        }
                        await rc.setRemoteDescription(offer);
                        const answer = await rc.createAnswer();
                        await rc.setLocalDescription(answer);
                        setPeerConnection(rc);
                        rc.onicecandidate = (e) => {
                            setIceCandidate(e.candidate);
                        }
                    } catch (error) {
                        console.error("Error setting remote description and creating answer:", error);
                        throw error; // Re-throw for handling at a higher level if needed
                    }
                }
            } catch (error) {
                console.error("Error initializing RTCPeerConnection:", error);
            }
        };

        initializePeerConnection();

        return () => {
            if (peerConnection) {
                peerConnection.close();
            }
        };
    }, [configuration]); // Only re-run when configuration changes

    const createOffer = async () => {
        if (!peerConnection) {
            console.error("Peer connection not initialized");
            return;
        }
        try {
            const offer = await peerConnection.createOffer();
            peerConnection.setLocalDescription(offer);
            return offer;
        } catch (error) {
            console.error("Error creating offer:", error);
        }
    };
    const setRemote = async (offer: RTCSessionDescriptionInit) => {
        if (!peerConnection) {
            console.error("Peer connection not initialized");
            return;
        }
        try {
            await peerConnection.setRemoteDescription(offer);
        } catch (error) {
            console.error("Error setting remote description:", error);
        }
    };

    return {
        peerConnection,
        createOffer,
        setRemote,
        dataChannel,
        isOpen,
        data,
        iceCandidate
    };
};
