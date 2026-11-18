
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Pickaxe,
    Search,
    Sparkles,
    User,
    LoaderCircle
} from "lucide-react";

import { usePlayer } from "../context/PlayerContext";
import { lookupPlayer } from "../services/hypixelService";

import "../styles/landingPage.css";

export default function PlayerLookupPage() {
    const [username, setUsername] = useState("");
    const [profiles, setProfiles] = useState([]);
    const [foundPlayer, setFoundPlayer] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { selectPlayer } = usePlayer();
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();

        if (!username.trim() || loading) return;

        setLoading(true);
        setError("");
        setProfiles([]);
        setFoundPlayer(null);

        try {
            const result = await lookupPlayer(username.trim());

            if (!result.profiles || result.profiles.length === 0) {
                throw new Error(
                    "This player has no accessible SkyBlock profiles."
                );
            }

            setFoundPlayer(result.player);
            setProfiles(result.profiles);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleProfileSelect(profile) {
        selectPlayer(foundPlayer, profiles, profile);
        navigate("/dashboard");
    }

    return (
        <main className="landing-page">
            <div className="landing-content">

                <div className="landing-icon">
                    <Pickaxe size={38} />
                </div>

                <div className="landing-title">
                    <span className="eyebrow">
                        HYPIXEL SKYBLOCK
                    </span>

                    <h1>Skyblock Upgrade Advisor</h1>

                    <p>
                        Find your next upgrade.
                        Optimize your progression.
                        Make every coin count.
                    </p>
                </div>

                <form
                    className="player-search-form"
                    onSubmit={handleSubmit}
                >
                    <label htmlFor="username">
                        Minecraft Username
                    </label>

                    <div className="landing-search">
                        <Search size={20} />

                        <input
                            id="username"
                            type="text"
                            placeholder="Enter your username..."
                            value={username}
                            onChange={event => setUsername(event.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!username.trim() || loading}
                        className="landing-button"
                    >
                        {loading ? (
                            <>
                                <LoaderCircle size={18} />
                                <span>Looking up player...</span>
                            </>
                        ) : (
                            <>
                                <span>Analyze Player</span>
                                <Sparkles size={18} />
                            </>
                        )}
                    </button>

                    {error && (
                        <p className="lookup-error">
                            {error}
                        </p>
                    )}
                </form>

                {foundPlayer && (
                    <section className="profile-selection">
                        <div className="profile-selection-heading">
                            <User size={20} />

                            <div>
                                <h2>{foundPlayer.username}</h2>
                                <p>Select a SkyBlock profile to analyze.</p>
                            </div>
                        </div>

                        <div className="profile-options">
                            {profiles.map(profile => (
                                <button
                                    key={profile.profile_id}
                                    className="profile-option"
                                    onClick={() => handleProfileSelect(profile)}
                                >
                                    <span>
                                        <strong>{profile.cute_name}</strong>
                                        <small>
                                            {profile.selected
                                                ? "Currently selected in-game"
                                                : "SkyBlock profile"}
                                        </small>
                                    </span>

                                    <span className="profile-arrow">
                                        →
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                <div className="landing-footer">
                    <span>Mining</span>
                    <span>•</span>
                    <span>Foraging</span>
                    <span>•</span>
                    <span>Fishing</span>
                </div>

            </div>
        </main>
    );
}
