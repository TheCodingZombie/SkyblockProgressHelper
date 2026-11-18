
import { createContext, useContext, useState } from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
    const [player, setPlayer] = useState(() => {
        try {
            const saved = sessionStorage.getItem("skyblock-player");
            return saved ? JSON.parse(saved) : null;
        } catch {
            sessionStorage.removeItem("skyblock-player");
            return null;
        }
    });

    function savePlayer(playerData) {
        setPlayer(playerData);
        sessionStorage.setItem(
            "skyblock-player",
            JSON.stringify(playerData)
        );
    }

    function selectPlayer(playerData, profiles, selectedProfile) {
        savePlayer({
            username: playerData.username,
            uuid: playerData.uuid,
            profiles: profiles,
            profileId: selectedProfile.profileId,
            profileName: selectedProfile.cuteName
        });
    }

    function switchProfile(profile) {
        if (!player) return;

        savePlayer({
            ...player,
            profileId: profile.profileId,
            profileName: profile.cuteName
        });
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
                switchProfile,
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
