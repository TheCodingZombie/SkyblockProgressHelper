
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pickaxe, Trees, Fish, LoaderCircle } from "lucide-react";

import { usePlayer } from "../context/PlayerContext";
import { skills } from "../config/skills";
import { getSkyblockProfile, getSkillResources, getPlayerEquipment } from "../services/hypixelService";
import { calculateSkillProgress } from "../utils/skillProgression";

import PlayerProfileCard from "../components/PlayerProfileCard";
import TopUpgradeCard from "../components/TopUpgradeCard";
import SkillProgressCard from "../components/SkillProgressCard";

import "../styles/dashboard.css";

const skillIcons = {
    mining: Pickaxe,
    foraging: Trees,
    fishing: Fish
};

const skillXPFields = {
    mining: "SKILL_MINING",
    foraging: "SKILL_FORAGING",
    fishing: "SKILL_FISHING"
};

const skillResourceFields = {
    mining: "MINING",
    foraging: "FORAGING",
    fishing: "FISHING"
};

// Temporary recommendations until we build the recommendation engine.
const exampleUpgrades = {
    mining: {
        name: "Improve Your Mining Equipment",
        description: "Your next mining upgrade could improve your overall mining efficiency.",
        benefit: "Mining progression"
    },
    foraging: {
        name: "Upgrade Your Foraging Tool",
        description: "Consider improving your tool to increase your foraging efficiency.",
        benefit: "Foraging progression"
    },
    fishing: {
        name: "Improve Your Fishing Setup",
        description: "A better fishing setup could help you progress more efficiently.",
        benefit: "Fishing progression"
    }
};

function formatXP(value) {
    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0
    }).format(value);
}

export default function PlayerDashboard() {
    const {
        player,
        switchProfile,
        clearPlayer
    } = usePlayer();

    const navigate = useNavigate();

    const [memberData, setMemberData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [skillResources, setSkillResources] = useState(null);
    const [equipmentData, setEquipmentData] = useState(null);
    
    useEffect(() => {
        let cancelled = false;

        async function loadProfile() {
            setLoading(true);
            setError("");
            setMemberData(null);

            try {
                const profile = await getSkyblockProfile(
                    player.profileId
                );

                // Normalize the player's UUID by removing hyphens.
                const normalizedPlayerUUID = player.uuid
                    .replaceAll("-", "")
                    .toLowerCase();

                // Find the player's member data, regardless of UUID formatting.
                const memberEntry = Object.entries(profile?.members ?? {})
                    .find(([uuid]) =>
                        uuid.replaceAll("-", "").toLowerCase() ===
                        normalizedPlayerUUID
                    );

                if (!memberEntry) {
                    console.log("Player UUID:", normalizedPlayerUUID);
                    console.log(
                        "Profile member UUIDs:",
                        Object.keys(profile?.members ?? {})
                    );

                    throw new Error(
                        "Your player data was not found in this SkyBlock profile."
                    );
                }

                // The second element of the entry is the actual member data.
                const member = memberEntry[1];

                if (!cancelled) {
                    setMemberData(member);
                }

            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }

            const equipment = await getPlayerEquipment(
                player.profileId,
                player.uuid
            );

            if (cancelled) return;

            setEquipmentData(equipment);
        }

        if (player?.profileId && player?.uuid) {
            loadProfile();
        }

        return () => {
            cancelled = true;
        };
    }, [player?.profileId, player?.uuid]);

    useEffect(() => {
        let cancelled = false;

        async function loadSkillResources() {
            try {
                const resources = await getSkillResources();

                if (!cancelled) {
                    setSkillResources(resources);
                }
            } catch (err) {
                console.error("Failed to load skill resources:", err);
            }
        }

        loadSkillResources();

        return () => {
            cancelled = true;
        };
    }, []);

    const skillProgress = Object.fromEntries(
        Object.entries(skillXPFields).map(([skillId, xpField]) => {
            const xp = memberData?.player_data?.experience?.[xpField];

            const resource =
                skillResources?.[skillResourceFields[skillId]];

            return [
                skillId,
                calculateSkillProgress(xp, resource)
            ];
        })
    );

    console.log(
        "ACCESSORY CALCULATION INPUT:",
        JSON.stringify({
            accessories: equipmentData?.talismans?.map(item => ({
                id: item.id,
                name: item.name,
                rarity: item.rarity,
                rarityUpgrades: item.rarityUpgrades,
                accessoryPower: item.accessoryPower,
                stats: item.stats
            })),

            selectedPower: equipmentData?.accessoryStorage?.selected_power,

            tuning: equipmentData?.accessoryStorage?.tuning
        }, null, 2)
    );

    function handleChangePlayer() {
        clearPlayer();
        navigate("/lookup");
    }

    function handleProfileChange(event) {
        const selectedProfile = player.profiles.find(
            profile => profile.profileId === event.target.value
        );

        if (selectedProfile) {
            switchProfile(selectedProfile);
        }
    }

    return (
        <main className="dashboard-page">
            <header className="dashboard-heading">
                <div>
                    <span className="dashboard-eyebrow">
                        PLAYER OVERVIEW
                    </span>

                    <h1>Your Dashboard</h1>

                    <p>
                        Here's where your next SkyBlock upgrades begin.
                    </p>
                </div>
            </header>

            <div className="dashboard-layout">
                <div className="dashboard-player-column">
                    <PlayerProfileCard
                        player={player}
                        onChangePlayer={handleChangePlayer}
                        handleProfileChange={handleProfileChange}
                    />
                </div>

                <div className="dashboard-upgrades-column">
                    <div className="dashboard-upgrade-list">
                        {Object.values(skills).map(skill => {
                            const Icon = skillIcons[skill.id];

                            return (
                                <TopUpgradeCard
                                    key={skill.id}
                                    skill={{ ...skill, icon: Icon }}
                                    upgrade={exampleUpgrades[skill.id]}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            <section className="dashboard-progression">
                <div className="dashboard-section-heading">
                    <h2>Skill Progression</h2>
                    <p>Your current SkyBlock skill levels and experience.</p>
                </div>

                <div className="statistics-grid">
                    {Object.values(skills).map(skill => (
                        <SkillProgressCard
                            key={skill.id}
                            skill={skill}
                            progression={skillProgress[skill.id]}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}
