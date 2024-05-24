import React, { useState, useEffect } from "react";
import Swal from "sweetalert"; // Import SweetAlert
import { db } from "../../config/firebase.js";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore"; // Import doc function
import "./orders.css"; // Import CSS file
import Button from "../UI/Button.jsx";
import { auth } from "../../config/firebase.js";

function Orders() {
    const [ordersList, setOrdersList] = useState([]);

    const ordersCollectionRef = collection(db, "order");
    const getOrdersList = async () => {
        try {
            const data = await getDocs(ordersCollectionRef);
            const filteredData = data.docs.map((doc) => ({
                id: doc.id, // Access the document ID
                ...doc.data(),
            }));

            // Sort the orders from newest to oldest
            const sortedData = filteredData.sort(
                (a, b) => b.orderDate - a.orderDate
            );

            setOrdersList(sortedData);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteOrder = async (orderId) => {
        try {
            await deleteDoc(doc(db, "order", orderId)); // Use doc function to create reference
            // Update state to remove the deleted order
            setOrdersList(ordersList.filter((order) => order.id !== orderId));
            Swal({
                icon: "success",
                title: "Done",
                text: "Succesfully deleted.",
            });
        } catch (err) {
            console.error(err);
            // Display SweetAlert notification
            Swal({
                icon: "warning",
                title: "An error occurred while deleting the order.",
                text: "Sign out and login with admin phone number.",
                timer: 2000, // Duration in milliseconds
                timerProgressBar: true, // Show progress bar
                toast: true,
                position: "top-right",
                button: false,
            });
        }
    };

    useEffect(() => {
        getOrdersList();
    }, []);

    return (
        <div className="container">
            <h2>Orders</h2>

            <Button
                onClick={() => (window.location.href = "/")}
                className="button">
                Go to Home
            </Button>
            <ul className="list">
                {ordersList.map((order) => (
                    <li key={order.id} className="item">
                        <div className="details">
                            <h3>Name: {order.name}</h3>
                            <h3>Price: ${order.price}</h3>
                            <h3>Quantity: {order.quantity}</h3>
                            <h3>Total: ${order.quantity * order.price}</h3>
                            <h3>
                                User Phone: {maskPhoneNumber(order.userPhone)}
                            </h3>
                            <h3>
                                Order Date:
                                {order.orderDate
                                    ? new Date(
                                          order.orderDate.seconds * 1000
                                      ).toLocaleString("tr-TR", {
                                          year: "numeric",
                                          month: "2-digit",
                                          day: "2-digit",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          second: "2-digit",
                                      })
                                    : "Invalid Date"}
                            </h3>
                            <h3>Table Number: {order.tableNumber}</h3>
                        </div>
                        {auth?.currentUser?.phoneNumber == "+905550005500" && (
                            <button
                                className="delete-button"
                                onClick={() => deleteOrder(order.id)}>
                                Delete
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Orders;

// Function to mask the phone number except the last four digits
function maskPhoneNumber(phoneNumber) {
    const length = phoneNumber.length;
    const maskedPart = "*".repeat(length - 4);
    const lastFourDigits = phoneNumber.slice(length - 4);
    return maskedPart + lastFourDigits;
}
