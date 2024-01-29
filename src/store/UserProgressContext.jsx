import { createContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../config/firebase";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    signInWithPopup,
    signOut,
} from "firebase/auth";

const UserProgressContext = createContext({
    progress: "",
    showCart: () => {},
    hideCart: () => {},
    showCheckout: () => {},
    hideCheckout: () => {},
});

export function UserProgressContextProvider({ children }) {
    const [phone, setPhone] = useState("");
    const [user, setUser] = useState(null);
    const [otp, setOtp] = useState("");
    const [userProgress, setUserProgress] = useState("");

    const sendOtp = async () => {
        try {
            const recaptchaContainer = document.getElementById("recaptcha");
            if (!recaptchaContainer) {
                console.error(
                    "reCAPTCHA client element is missing from the DOM"
                );
                return;
            }

            const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
                size: "invisible",
            });

            const confirmation = await signInWithPhoneNumber(
                auth,
                phone,
                recaptchaVerifier
            );
            setUser(confirmation);
            swal({
                title:"Code sent",
                text: `Check your phone`,
                icon: "success",
                timer: 2000,
                buttons: false
              });
        } catch (error) {
            swal({
                title:"Code can not send",
                text: `${error.message}`,
                icon: "error",
                timer: 2000,
                buttons: false
              });
        }
    };

    const verifyOtp = async () => {
        try {
            const data = await user.confirm(otp);
            swal({
                title:"Verification succesfully",
                text: `Now you can order our delicious food`,
                icon: "success",
                timer: 2000,
                buttons: false
              });
            console.log(data);
        } catch (error) {
            console.log(error);
            swal({
                title:"Verification Problem",
                text: `${error.message}`,
                icon: "error",
                timer: 2000,
                buttons: false
              });
        }
    };
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    // const signInWithGoogle = async () => {
    //     try {
    //         await signInWithPopup(auth, googleProvider);
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

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
                {auth?.currentUser?.phoneNumber ? (
                    <div className="loginContainer">
                                            {auth?.currentUser?.phoneNumber}

                    <button className="button" onClick={logout}>
                        Logout
                    </button>
                    </div>
                ) : (
                    <div className="loginContainer">
                        <PhoneInput
                            defaultCountry="TR"
                            value={phone}
                            onChange={setPhone}
                        />
                        <div id="recaptcha"></div>
                        <button onClick={sendOtp}>Send Code</button>
                        <input
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                        />
                        <button onClick={verifyOtp}>Emter Code</button>
                    </div>
                )}
                {children}
            </>
        </UserProgressContext.Provider>
    );
}

export default UserProgressContext;
