import { useContext } from "react";
import swal from 'sweetalert';
import Modal from "./UI/Modal.jsx";
import CartContext from "../store/CartContext.jsx";
import { currencyFormatter } from "../util/formatting.js";
import Input from "./UI/Input.jsx";
import Button from "./UI/Button.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import Error from "./Error.jsx";
import { db, auth, storage } from "../config/firebase.js";
import {
    getDocs,
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
} from "firebase/firestore";

export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const cartTotal = cartCtx.items.reduce(
        (totalPrice, item) => totalPrice + item.quantity * item.price,
        0
    );

    function handleClose() {
        userProgressCtx.hideCheckout();
    }

    function handleFinish() {
        userProgressCtx.hideCheckout();
        cartCtx.clearCart();
        clearData();
    }

    function handleSubmit(event) {
        event.preventDefault();
    
        const orderCollectionRef = collection(db, "order");
        const currentDate = new Date();
        const tableNumber = document.getElementById('tnum').value;

    
        cartCtx.items.forEach(async (item) => {
            try {
                if (auth && auth.currentUser){
                                    await addDoc(orderCollectionRef, {
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    userPhone: auth?.currentUser?.phoneNumber,
                    orderDate: currentDate,
                    tableNumber: tableNumber,
                });
                swal({
                    text: `Ordered Successfully!`,
                    icon: "success",
                    timer: 2000,
                    buttons: false
                  });
                }else{
                    throw new Error("Authentication Error");
                }

            } catch (err) {
                console.log(err)
                swal({
                    title:"Authentication Error",
                    text: `Please Sign In`,
                    icon: "error",
                    timer: 2000,
                    buttons: false
                  });
            }
        });
    
        handleClose();
        document.getElementById("deleteAll").click();

    }
    

    let actions = (
        <>
            <Button type="button" textOnly onClick={handleClose}>
                Close
            </Button>
            <Button>Submit Order</Button>
        </>
    );

    if (false) {
        return (
            <Modal
                open={userProgressCtx.progress === "checkout"}
                onClose={handleFinish}>
                <h2>Success!</h2>
                <p>Your order was submitted successfully.</p>
                <p>
                    We will get back to you with more details via email within
                    the next few minutes.
                </p>
                <p className="modal-actions">
                    <Button onClick={handleFinish}>Okay</Button>
                </p>
            </Modal>
        );
    }

    return (
        <Modal
            open={userProgressCtx.progress === "checkout"}
            onClose={handleClose}>
            <form onSubmit={handleSubmit}>
                <h2>Checkout</h2>
                <ul>
                    {cartCtx.items.map((item) => (
                        <li key={item.id}>
                            {item.name} x {item.quantity} - ${item.price}
                        </li>
                    ))}
                </ul>
                <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

                <Input label="Table Number" type="number" id="tnum" />
                {false && (
                    <Error title="Failed to submit order" message={error} />
                )}

                <p className="modal-actions">{actions}</p>
            </form>
        </Modal>
    );
}
