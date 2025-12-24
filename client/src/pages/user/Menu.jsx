import React, { useState, useEffect } from 'react';
import FoodCard from '../../components/FoodCard';
import { database } from '../../../firebase';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';

const Menu = () => {
    const [breakfast, setBreakfast] = useState([]);
    const [lunch, setLunch] = useState([]);
    const [dinner, setDinner] = useState([]);
    const [snacks, setSnacks] = useState([]);
    const db = database;

    useEffect(() => {
        // BREAKFAST
        const breakfastQuery = query(
            ref(db, "menuItems/"),
            orderByChild("category"),
            equalTo("Breakfast")
        );

        onValue(breakfastQuery, (snapshot) => {
            const data = snapshot.val() || {};
            const arr = Object.entries(data).map(([id, value]) => ({ id, ...value }));
            setBreakfast(arr);
            console.log(`Breakfast`, arr);
        });

        // LUNCH
        const lunchQuery = query(
            ref(db, "menuItems/"),
            orderByChild("category"),
            equalTo("Lunch")
        );

        onValue(lunchQuery, (snapshot) => {
            const data = snapshot.val() || {};
            const arr = Object.entries(data).map(([id, value]) => ({ id, ...value }));
            setLunch(arr);
            console.log(`Lunch`, arr);
        });

        // DINNER
        const dinnerQuery = query(
            ref(db, "menuItems/"),
            orderByChild("category"),
            equalTo("Dinner")
        );

        onValue(dinnerQuery, (snapshot) => {
            const data = snapshot.val() || {};
            const arr = Object.entries(data).map(([id, value]) => ({ id, ...value }));
            setDinner(arr);
            console.log(`Dinner`, arr);
        });

        // SNACKS
        const snacksQuery = query(
            ref(db, "menuItems/"),
            orderByChild("category"),
            equalTo("Snacks")
        );

        onValue(snacksQuery, (snapshot) => {
            const data = snapshot.val() || {};
            const arr = Object.entries(data).map(([id, value]) => ({ id, ...value }));
            setSnacks(arr);
            console.log(`Snacks`, arr);
        });
    }, [db]);

    return (
        <div className="container mx-auto px-4 py-8">

            {/* BREAKFAST */}
            <section className="breakfast">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold">Today's <span className="text-orange-500">Breakfast</span></h2>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                    {breakfast.length > 0 ? breakfast.map(food => (
                        <FoodCard key={food.id} {...food} />
                    )) : <p className="text-gray-500">No breakfast items</p>}
                </div>
            </section>

            {/* LUNCH */}
            <section className="lunch mt-14">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold">Today's <span className="text-orange-500">Lunch</span></h2>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                    {lunch.length > 0 ? lunch.map(food => (
                        <FoodCard key={food.id} {...food} />
                    )) : <p className="text-gray-500">No lunch items</p>}
                </div>
            </section>

            {/* DINNER */}
            <section className="dinner mt-14">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold">Today's <span className="text-orange-500">Dinner</span></h2>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                    {dinner.length > 0 ? dinner.map(food => (
                        <FoodCard key={food.id} {...food} />
                    )) : <p className="text-gray-500">No dinner items</p>}
                </div>
            </section>

            {/* SNACKS */}
            <section className="snacks mt-14">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold">Today's <span className="text-orange-500">Snacks</span></h2>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                    {snacks.length > 0 ? snacks.map(food => (
                        <FoodCard key={food.id} {...food} />
                    )) : <p className="text-gray-500">No snacks available</p>}
                </div>
            </section>
        </div>
    );
};

export default Menu;
