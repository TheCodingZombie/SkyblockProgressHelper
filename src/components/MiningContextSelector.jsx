
import { MINING_CONTEXTS } from "../config/miningContexts";

import "../styles/miningContextSelector.css";

export default function MiningContextSelector({
    selectedContext,
    onChange
}) {
    return (
        <section className="mining-context-section">

            <div className="mining-context-heading">
                <h2>Mining Context</h2>

                <p>
                    Select the type of mining you're currently
                    planning to do.
                </p>
            </div>

            <div className="mining-context-selector">

                {MINING_CONTEXTS.map(context => (
                    <button
                        key={context.id}
                        className={`mining-context-button ${
                            selectedContext === context.id
                                ? "active"
                                : ""
                        }`}
                        onClick={() => onChange(context.id)}
                    >
                        {context.label}
                    </button>
                ))}

            </div>

        </section>
    );
}
