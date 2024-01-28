import { useContext } from "react";

import { currencyFormatter } from "../util/formatting.js";
import Button from "./UI/Button.jsx";
import CartContext from "../store/CartContext.jsx";
import { getDownloadURL, ref } from 'firebase/storage';
import {storage} from "../config/firebase.js"
import { useState,useEffect } from "react";

export default function MealItem({ meal }) {

    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const imageRef = ref(storage, meal.image);
        getDownloadURL(imageRef)
            .then((url) => {
                setImageUrl(url);
            })
            .catch((error) => {
                console.error('Error getting download URL:', error);
            });
    }, [meal.image]);
    const cartCtx = useContext(CartContext);

    function handleAddMealToCart() {
        cartCtx.addItem(meal);
    }

    return (
        <li className="meal-item">
            <article>
                <img
                    src={imageUrl}
                    alt={meal.name}
                />
                <div>
                    <h3>{meal.name}</h3>
                    <p className="meal-item-price">
                        {currencyFormatter.format(meal.price)}
                    </p>
                    <p className="meal-item-description">{meal.description}</p>
                </div>
                <p className="meal-item-actions">
                    <Button onClick={handleAddMealToCart}>Add to Cart</Button>
                </p>
            </article>
        </li>
    );
}
