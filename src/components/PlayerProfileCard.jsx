
import { User, RefreshCw } from "lucide-react";

export default function PlayerProfileCard({ player, onChangePlayer }) {
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
                <p>Hypixel SkyBlock Player</p>
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
