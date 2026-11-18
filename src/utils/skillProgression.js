
export function calculateSkillProgress(xp, skillResource) {
    if (!Number.isFinite(xp) || !skillResource) {
        return null;
    }

    const levels = skillResource.levels;
    const maxLevel = skillResource.maxLevel;

    if (!Array.isArray(levels) || levels.length === 0) {
        return null;
    }

    // Find the highest level whose XP requirement
    // has already been reached.
    let currentLevel = 0;

    for (const level of levels) {
        if (xp >= level.totalExpRequired) {
            currentLevel = level.level;
        } else {
            break;
        }
    }

    // Handle maximum skill level.
    if (currentLevel >= maxLevel) {
        return {
            level: maxLevel,
            maxLevel,
            currentXP: xp,
            xpIntoLevel: 0,
            xpForNextLevel: 0,
            xpRemaining: 0,
            progress: 100,
            isMaxLevel: true
        };
    }

    const nextLevel = levels.find(
        level => level.level === currentLevel + 1
    );

    const currentLevelRequirement = levels.find(
        level => level.level === currentLevel
    )?.totalExpRequired ?? 0;

    if (!nextLevel) {
        return null;
    }

    const xpForNextLevel =
        nextLevel.totalExpRequired - currentLevelRequirement;

    const xpIntoLevel = xp - currentLevelRequirement;

    return {
        level: currentLevel,
        maxLevel,
        currentXP: xp,
        xpIntoLevel,
        xpForNextLevel,
        xpRemaining: nextLevel.totalExpRequired - xp,
        progress: Math.min(
            100,
            Math.max(0, (xpIntoLevel / xpForNextLevel) * 100)
        ),
        isMaxLevel: false
    };
}
