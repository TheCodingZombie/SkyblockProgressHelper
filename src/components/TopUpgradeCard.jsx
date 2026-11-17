
import { ArrowUpRight } from "lucide-react";

export default function TopUpgradeCard({ skill, upgrade }) {
    const Icon = skill.icon;

    return (
        <section
            className="top-upgrade-card"
            style={{ "--skill-color": skill.color }}
        >
            <div className="upgrade-skill">
                <Icon size={19} />
                <span>{skill.name}</span>
            </div>

            <div className="upgrade-details">
                <h3>{upgrade.name}</h3>
                <p>{upgrade.description}</p>
            </div>

            <div className="upgrade-footer">
                <span>{upgrade.benefit}</span>
                <ArrowUpRight size={18} />
            </div>
        </section>
    );
}
