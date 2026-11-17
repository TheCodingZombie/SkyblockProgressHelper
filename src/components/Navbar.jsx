
import { Link, NavLink } from "react-router-dom";
import { Pickaxe, Trees, Fish } from "lucide-react";

import { skills } from "../config/skills";

const skillIcons = {
    mining: Pickaxe,
    foraging: Trees,
    fishing: Fish
};

export default function Navbar() {
    return (
        <nav className="navbar">

            <Link to="/dashboard" className="navbar-brand">
                <div className="brand-icon">
                    <Pickaxe size={23} />
                </div>

                <div className="brand-text">
                    <h2>SKYBLOCK</h2>
                    <span>UPGRADE ADVISOR</span>
                </div>
            </Link>

            <div className="nav-links">

                {Object.values(skills).map(skill => {

                    const Icon = skillIcons[skill.id];

                    return (
                        <NavLink
                            key={skill.id}
                            to={`/${skill.id}`}
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                            style={{
                                "--skill-color": skill.color
                            }}
                        >
                            <Icon size={18} />
                            <span>{skill.name}</span>
                        </NavLink>
                    );
                })}

            </div>

        </nav>
    );
}
