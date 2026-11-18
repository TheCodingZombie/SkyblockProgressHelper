
import { User, RefreshCw } from "lucide-react";
function formatProfileType(gameMode) {
    const types = {
        ironman: "Ironman",
        bingo: "Bingo",
        island: "Stranded"
    };

    return types[gameMode] ?? null;
}

export default function PlayerProfileCard({ player, onChangePlayer, handleProfileChange }) {
    return (
        <section className="player-profile-card">
            <div className="profile-avatar">
                <img
                    src={`https://mc-heads.net/avatar/${encodeURIComponent(player.username)}/160`}
                    alt={`${player.username}'s Minecraft skin`}
                />
            </div>

            <div className="profile-details">
                <span className="profile-label">CURRENT PLAYER</span>
                <h2>{player.username}</h2>
                <select
                    className="profile-switcher"
                    value={player.profileId}
                    onChange={handleProfileChange}
                >
                    {player.profiles.map(profile => {
                        const profileType = formatProfileType(profile.gameMode);

                        return (
                        <option
                            key={profile.profileId}
                            value={profile.profileId}
                        >
                            {profile.cuteName}
                            {profileType ? ` (${profileType})` : ""}
                            {profile.selected ? " (In-Game)" : ""}
                        </option>
                    )})}
                </select>
            </div>

            <button
                className="change-player-button"
                onClick={onChangePlayer}
            >
                <RefreshCw size={16} />
                Change Player
            </button>
        </section>
    );
}
