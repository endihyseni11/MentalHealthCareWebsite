import { useState, useEffect, useRef } from "react";
import {
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr";

import { defaultOptions } from "./global";

export default function useSignalRHub(hubUrl, options) {
  const [signalRHub, setSignalRHub] = useState(null);
  const optionsRef = useRef({ ...defaultOptions, ...options });
  const connectionRef = useRef(null);

  useEffect(() => {
    optionsRef.current = { ...defaultOptions, ...options };
  }, [options]);

  useEffect(() => {
    let isCanceled = false;

    const startConnection = async () => {
      const hubConnectionSetup = new HubConnectionBuilder();

      if (optionsRef.current.httpTransportTypeOrOptions) {
        hubConnectionSetup.withUrl(
          hubUrl,
          optionsRef.current.httpTransportTypeOrOptions
        );
      } else {
        hubConnectionSetup.withUrl(hubUrl);
      }

      if (optionsRef.current.automaticReconnect) {
        if (optionsRef.current.automaticReconnect === true) {
          hubConnectionSetup.withAutomaticReconnect();
        } else {
          hubConnectionSetup.withAutomaticReconnect({
            nextRetryDelayInMilliseconds: optionsRef.current.automaticReconnect,
          });
        }
      }

      const hubConnection = hubConnectionSetup.build();

      try {
        await hubConnection.start();

        if (isCanceled) return hubConnection.stop();

        if (optionsRef.current.onConnected) {
          optionsRef.current.onConnected(hubConnection);
        }

        if (optionsRef.current.onDisconnected) {
          hubConnection.onclose(optionsRef.current.onDisconnectedAsync);
        }

        if (optionsRef.current.onReconnecting) {
          hubConnection.onreconnecting(optionsRef.current.onReconnecting);
        }

        if (optionsRef.current.onReconnected) {
          hubConnection.onreconnected(optionsRef.current.onReconnected);
        }

        // Ruaj lidhjen e krijuar në ref
        connectionRef.current = hubConnection;

        // Merr userId nga localStorage
        const userId = localStorage.getItem('userId');
        // Nëse userId nuk është null, dërgo në server për të ruajtur
        if (userId) {
          try {
            // Dërgo userId dhe connectionId në server për të ruajtur
            await hubConnection.invoke("JoinUser", userId, hubConnection.connectionId);
          } catch (error) {
            console.error('Error saving userId and connectionId to server:', error);
          }
        }

        setSignalRHub(hubConnection);
      } catch (error) {
        if (isCanceled) return;

        if (optionsRef.current.onError) {
          optionsRef.current.onError(error);
        }
      }
    };

    if (!optionsRef.current.enabled) return;

    // Kontrollo nëse ka një lidhje të krijuar tashmë
    if (connectionRef.current && connectionRef.current.state === HubConnectionState.Connected) {
      setSignalRHub(connectionRef.current);
      return;
    }

    startConnection();
    

  }, [hubUrl, optionsRef.current.enabled]);

  return signalRHub;
}
