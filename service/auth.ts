const sessionIdMap = new Map<string, string>();

const createSession = (sessionId: string, userId: string) => {
    sessionIdMap.set(sessionId, userId);
}

const getSession = (sessionId: string): string | undefined => {
    return sessionIdMap.get(sessionId);
}

const deleteSession = (sessionId: string) => {
    sessionIdMap.delete(sessionId);
}

export { createSession, getSession, deleteSession };
