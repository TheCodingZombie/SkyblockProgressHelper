
import { Pickaxe, Trees, Fish } from "lucide-react";

const skillIcons = {
    mining: Pickaxe,
    foraging: Trees,
    fishing: Fish
};

export default function SkillProgressCard({ skill, progression }) {
    if (!progression) {
        return null;
    }

    const Icon = skillIcons[skill.id];
    
    return (
        <section
            className="skill-progress-card"
            style={{ "--skill-color": skill.color }}
        >
            <div className="skill-progress-heading">
                <div className="skill-progress-name">
                    <Icon size={20} />
                    <h3>{skill.name}</h3>
                </div>

                <strong>
                    Level {progression.level}
                </strong>
            </div>

            <div className="skill-progress-bar">
                <div
                    className="skill-progress-fill"
                    style={{
                        width: `${progression.progress}%`
                    }}
                />
            </div>

            <div className="skill-progress-details">
                <span>
                    {progression.isMaxLevel
                        ? "Maximum level reached!!"
                        : `${progression.progress.toFixed(1)}% to next level`}
                </span>

                <span>
                    {progression.isMaxLevel
                        ? "MAX"
                        : `${progression.xpRemaining.toLocaleString()} XP remaining`}
                </span>
            </div>

            <div className="skill-progress-total">
                Total XP: {progression.currentXP.toLocaleString()}
            </div>
        </section>
    );
}
