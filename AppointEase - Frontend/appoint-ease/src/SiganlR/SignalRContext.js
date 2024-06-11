import React, { createContext, useContext } from 'react';
import useSignalRHub from './SignalRComponent';

const SignalRContext = createContext();

export const useSignalR = () => useContext(SignalRContext);

