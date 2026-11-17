export default function UpgradeCard({ upgrade }) {

    return (
        <article className="upgrade-card">

            <div className="upgrade-heading">
                <h3>{upgrade.name}</h3>

                <span className={`priority ${upgrade.priority}`}>
                    {upgrade.priority}
                </span>
            </div>

            <p>{upgrade.description}</p>

            <small>{upgrade.reason}</small>

        </article>
    );
}