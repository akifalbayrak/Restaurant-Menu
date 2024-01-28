import { createContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../config/firebase";
import { signInWithPopup, signOut } from "firebase/auth";

const UserProgressContext = createContext({
    progress: "", // 'cart', 'checkout'
    showCart: () => {},
    hideCart: () => {},
    showCheckout: () => {},
    hideCheckout: () => {},
});

export function UserProgressContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userProgress, setUserProgress] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error(err);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };
    function showCart() {
        setUserProgress("cart");
    }

    function hideCart() {
        setUserProgress("");
    }

    function showCheckout() {
        setUserProgress("checkout");
    }

    function hideCheckout() {
        setUserProgress("");
    }

    const userProgressCtx = {
        progress: userProgress,
        showCart,
        hideCart,
        showCheckout,
        hideCheckout,
    };

    return (
        <UserProgressContext.Provider value={userProgressCtx}>
            <>
                {auth?.currentUser?.uid}
                {user ? (
                    <button className="button" onClick={logout}>
                        Logout
                    </button>
                ) : (
                    <button className="button" onClick={signInWithGoogle}>
                        Sign In With Google
                    </button>
                )}
                {children}
            </>
        </UserProgressContext.Provider>
    );
}

export default UserProgressContext;
