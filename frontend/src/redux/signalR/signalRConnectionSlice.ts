import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getBaseAPIUrl } from "../../utils/api/apiConfig";
import { ACCESS_TOKEN } from "../../constants/auth";
import { isValidJwtToken } from "../../utils/auth/isValidJwtToken";

export type SignalRConnection = {
    connection: HubConnection | null;
    status: HubConnectionState.Connected | HubConnectionState.Connecting | HubConnectionState.Disconnected | "Error";
};

const INITIAL_STATE: SignalRConnection = {
    connection: null,
    status: HubConnectionState.Disconnected,
};

const createSignalRConnection = (): HubConnection => {
    const chatURL = `${getBaseAPIUrl()}chatHub`;
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token || !isValidJwtToken(token)) {
        throw new Error("You need to be authenticated to connect to the server.");
    }
    const newConnection = new HubConnectionBuilder()
        .withUrl(chatURL, { accessTokenFactory: () => token })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();
    return newConnection;
};

export const startConnection = createAsyncThunk("signalR/startConnection", async (_, { getState, rejectWithValue }) => {
    try {
        const state = getState() as { signalRConnection: SignalRConnection };
        if (state.signalRConnection.connection) return;

        const newConnection = createSignalRConnection();
        await newConnection.start();
        return newConnection;
    } catch (error) {
        return rejectWithValue((error as Error).message);
    }
});

export const stopConnection = createAsyncThunk("signalR/stopConnection", async (_, { getState }) => {
    const state = getState() as { signalRConnection: SignalRConnection };
    const { connection } = state.signalRConnection;
    if (connection) {
        await connection.stop();
    }
});

const signalRConnectionSlice = createSlice({
    name: "signalRConnection",
    initialState: INITIAL_STATE,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(startConnection.pending, (state) => {
                state.status = HubConnectionState.Connecting;
            })
            .addCase(startConnection.fulfilled, (state, action) => {
                state.connection = action.payload as HubConnection;
                state.status = HubConnectionState.Connected;
            })
            .addCase(startConnection.rejected, (state) => {
                state.status = "Error";
            })
            .addCase(stopConnection.fulfilled, (state) => {
                state.connection = null;
                state.status = HubConnectionState.Disconnected;
            });
    },
});

export default signalRConnectionSlice.reducer;
