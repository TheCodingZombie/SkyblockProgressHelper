
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Pickaxe, Search, Sparkles } from "lucide-react";

import { usePlayer } from "../context/PlayerContext";

import "../styles/landingPage.css";

export default function PlayerLookupPage() {

    const [username, setUsername] = useState("");

    const { selectPlayer } = usePlayer();

    const navigate = useNavigate();

    function handleSubmit(event) {

        event.preventDefault();

        const trimmedUsername = username.trim();

        if (!trimmedUsername) {
            return;
        }

        selectPlayer(trimmedUsername);

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

                    <h1>
                        Skyblock Upgrade Advisor
                    </h1>

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
                            onChange={event =>
                                setUsername(event.target.value)
                            }
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={!username.trim()}
                        className="landing-button"
                    >
                        <span>Analyze Player</span>
                        <Sparkles size={18} />
                    </button>

                </form>

                <div className="landing-footer">
                    <span>
                        Mining
                    </span>

                    <span>•</span>

                    <span>
                        Foraging
                    </span>

                    <span>•</span>

                    <span>
                        Fishing
                    </span>
                </div>

            </div>

        </main>
    );
}
