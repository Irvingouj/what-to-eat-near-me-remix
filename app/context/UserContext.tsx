import { User } from "common/type/user";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";
function useUserContextCreator(user: User | null) {
    const [state, setState] = useState({
        currentUser: user,
        error: null as Error | null,
        isLoading: false
    });

    const updateUser = useCallback((user: User) => {
        setState(prev => ({
            ...prev,
            currentUser: user
        }));
    }, []);

    const logout = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentUser: null
        }));
    }, []);

    return {
        ...state,
        updateUser,
        logout
    };
}

type UserContextType = ReturnType<typeof useUserContextCreator>;

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ user, children }: { user: User | null, children: ReactNode }) {
    const contextValue = useUserContextCreator(user);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
} 