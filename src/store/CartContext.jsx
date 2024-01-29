import { createContext, useReducer } from "react";
import { db, auth } from "../config/firebase";
import swal from 'sweetalert';
import {
    getDocs,
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
} from "firebase/firestore";
const CartContext = createContext({
    items: [],
    addItem: (item) => {},
    removeItem: (id) => {},
    clearCart: () => {},
});

function cartReducer(state, action) {
    if (action.type === "ADD_ITEM") {
        const existingCartItemIndex = state.items.findIndex(
            (item) => item.id === action.item.id
        );

        const updatedItems = [...state.items];

        if (existingCartItemIndex > -1) {
            const existingItem = state.items[existingCartItemIndex];
            const updatedItem = {
                ...existingItem,
                quantity: existingItem.quantity + 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            updatedItems.push({ ...action.item, quantity: 1 });
        }
        swal({
            title: "Order Added",
            text: `${action.item.name}`,
            icon: "success",
            timer: 2000,
            buttons: false
          });
                  return { ...state, items: updatedItems };
    }

    if (action.type === "REMOVE_ITEM") {
        const existingCartItemIndex = state.items.findIndex(
            (item) => item.id === action.id
        );
        const existingCartItem = state.items[existingCartItemIndex];

        const updatedItems = [...state.items];

        if (existingCartItem.quantity === 1) {
            updatedItems.splice(existingCartItemIndex, 1);
        } else {
            const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity - 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
        }

        return { ...state, items: updatedItems };
    }

    if (action.type === "CLEAR_CART") {
        return { ...state, items: [] };
    }

    return state;
}

export function CartContextProvider({ children }) {

    const order = []
    const orderCollectionRef = collection(db, "order");
    const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });


    const deleteOrder = async (id) => {
        const orderDoc = doc(db, "order", id);
        await deleteDoc(orderDoc);
    };

    const updateOrder = async (id) => {
        const movieDoc = doc(db, "movies", id);
        await updateDoc(movieDoc, { title: updatedTitle });
    };

    function addItem(item) {
        dispatchCartAction({ type: "ADD_ITEM", item });
    }

    function removeItem(id) {
        dispatchCartAction({ type: "REMOVE_ITEM", id });
    }

    function clearCart() {
        dispatchCartAction({ type: "CLEAR_CART" });
    }

    const cartContext = {
        items: cart.items,
        addItem,
        removeItem,
        clearCart,
    };

    return (
        <CartContext.Provider value={cartContext}>
            {children}
        </CartContext.Provider>
    );
}

export default CartContext;
