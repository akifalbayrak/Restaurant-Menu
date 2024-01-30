import { useContext, useEffect, useState, createContext } from "react";

import Button from "./UI/Button.jsx";
import logoImg from "../assets/logo.jpg";
import CartContext from "../store/CartContext.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
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

export default function Header() {
    const [phone, setPhone] = useState("");
    const [user, setUser] = useState(null);
    const [otp, setOtp] = useState("");

    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item) => {
        return totalNumberOfItems + item.quantity;
    }, 0);

    function handleShowCart() {
        userProgressCtx.showCart();
    }


// Declare a global variable to store the recaptcha element
let recaptchaElement = null;

// Create the verifier only once and store it in a state variable
const [verifier, setVerifier] = useState(null);

// Initialize the verifier on component mount
useEffect(() => {
    // Check if the recaptcha element already exists
    if (recaptchaElement) {
        // Reuse the existing recaptcha element
        setVerifier(new RecaptchaVerifier(auth, recaptchaElement, {
            size: 'invisible',
        }));
    } else {
        // Create a new recaptcha element and store it in the global variable
        recaptchaElement = document.createElement('div');
        recaptchaElement.id = 'recaptcha';
        document.body.appendChild(recaptchaElement);
        setVerifier(new RecaptchaVerifier(auth, recaptchaElement, {
            size: 'invisible',
        }));
    }
}, []);

    const sendOtp = async () => {
        try {
            // Use the existing verifier instead of creating a new one
            const confirmation = await signInWithPhoneNumber(
                auth,
                phone,
                verifier
            );
            setUser(confirmation);
            swal({
                title: "Code sent",
                text: `Check your phone`,
                icon: "success",
                timer: 2000,
                buttons: false,
            });
            document.getElementById("sendPart").style.display = "none";
            document.getElementById("otpPart").style.display = "inline";
        } catch (error) {
            console.log(error)
            swal({
                title: "Code can not send",
                text: `${error.message}`,
                icon: "error",
                timer: 2000,
                buttons: false,
            });
        }
    };

    const verifyOtp = async () => {
        try {
            await user.confirm(otp);
            swal({
                title: "Verification succesfully",
                text: `Now you can order our delicious food`,
                icon: "success",
                timer: 2000,
                buttons: false,
            });
        } catch (error) {
            swal({
                title: "Verification Problem",
                text: `${error.message}`,
                icon: "error",
                timer: 2000,
                buttons: false,
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
            if(cartCtx.items.length > 0){
                document.getElementById("deleteAll").click();
            }
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <header id="main-header">
            <div id="title">
                <img src={logoImg} alt="A restaurant" />
                <h1>Food Menu</h1>
                <Button onClick={() => window.location.href = "/orders"} className="button">
                Go to Orders
            </Button>
            </div>
            <div className="loginContainer">
                {auth?.currentUser?.phoneNumber ? (
                    <>
                        {auth?.currentUser?.phoneNumber}
                        <Button className="button" onClick={logout}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <div id="sendPart">
                            <PhoneInput
                                defaultCountry="TR"
                                value={phone}
                                onChange={setPhone}
                                placeholder="Enter Phone Number"
                            />
                            <div id="recaptcha"></div>
                            <Button onClick={sendOtp}>Send Code</Button>
                        </div>
                        <div id="otpPart" style={{ display: "none" }}>
                            <input
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                            />
                            <Button id="verifyBtn" onClick={verifyOtp}>
                                Enter Code
                            </Button>
                        </div>
                    </>
                )}
            </div>
            <nav>
                <Button textOnly onClick={handleShowCart}>
                    Cart ({totalCartItems})
                </Button>

            </nav>
        </header>
    );
}
