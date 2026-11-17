
import { createContext, useContext, useState } from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {

    const [player, setPlayer] = useState(() => {
        const saved = sessionStorage.getItem("skyblock-player");

        return saved ? JSON.parse(saved) : null;
    });

    function selectPlayer(username) {

        const newPlayer = {
            username: username.trim()
        };

        setPlayer(newPlayer);

        sessionStorage.setItem(
            "skyblock-player",
            JSON.stringify(newPlayer)
        );
    }

    function clearPlayer() {
        setPlayer(null);
        sessionStorage.removeItem("skyblock-player");
    }

    return (
        <PlayerContext.Provider
            value={{
                player,
                selectPlayer,
                clearPlayer
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    return useContext(PlayerContext);
}
