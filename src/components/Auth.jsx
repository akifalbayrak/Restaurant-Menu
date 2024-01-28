import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "../config/firebase";
import { signInWithPopup, signOut } from "firebase/auth";

const Auth = () => {
    const [user, setUser] = useState(null);

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

    return (
        <>
            {user ? (
                <button className="button" onClick={logout}>Logout</button>
            ) : (
                <button className="button" onClick={signInWithGoogle}>Sign In With Google</button>
            )}
        </>
    );
};

export default Auth;
