import MealItem from "./MealItem.jsx";
import useHttp from "../hooks/useHttp.js";
import Error from "./Error.jsx";
import { db } from "../config/firebase.js";
import {
    getDocs,
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
const requestConfig = {};

export default function Meals() {
    const [foodsList, setFoodsList] = useState([]);
    const foodsCollectionRef = collection(db, "foods_menu");

    const getFoodsList = async () => {
        try {
            const data = await getDocs(foodsCollectionRef);
            //   console.log(data)
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
            }));
            setFoodsList(filteredData);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getFoodsList();
    }, []);
    // const {
    //     data: loadedMeals,
    //     isLoading,
    //     error,
    // } = useHttp("http://localhost:3000/meals", requestConfig, []);

    // if (isLoading) {
    //     return <p className="center">Fetching meals...</p>;
    // }

    // if (error) {
    //     return <Error title="Failed to fetch meals" message={error} />;
    // }

    // // if (!data) {
    // //   return <p>No meals found.</p>
    // // }
    // console.log(loadedMeals);
    return (
        <ul id="meals">
            {foodsList.map((meal) => (
                <MealItem key={meal.id} meal={meal} />
            ))}
        </ul>
    );
}
