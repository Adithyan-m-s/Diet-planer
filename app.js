const MEAL_DATABASE = {
    'non-veg': {
        breakfast: [
            "Puttu and Kadala Curry (Black Chickpeas)",
            "Idli (3) with Sambar and Coconut Chutney",
            "Appam with Egg Roast (1 Egg)",
            "Oats Upma with Carrot and Peas",
            "Pathiri with Chicken Mappas (Small portion)",
            "Whole Wheat Idiyappam with Egg Stew",
            "Dosa (2) with Tomato Chutney and Egg whites"
        ],
        lunch: [
            "Brown Rice with Meen Vevichathu (Fish Curry) and Thoran",
            "Nadan Chicken Curry (Less oil) with 2 Chapatis & Salad",
            "Kerala Matta Rice, Fish Fry (Small piece) & Aviyal",
            "Chala (Sardine) Curry, Matta Rice and Cabbage Thoran",
            "Beef Ularthiyathu (Small portion) with Malabar Pathiri (2) and Salad",
            "Matta Rice with Moru Curry, Fish Moilee & Beans Thoran",
            "Matta Rice with Prawns Roast and Beetroot Thoran"
        ],
        dinner: [
            "Oats Kanji with Green Gram (Payar)",
            "2 Chapatis with Egg Burji (Vegetables added)",
            "Vegetable Soup with Grilled Fish (100g)",
            "Kanji (Rice Gruel) with Vanpayar (Red Lobia) thoran",
            "2 Chapatis with Chicken Roast and Mixed Salad",
            "Upma with a side of Boiled Egg",
            "Baked Fish with steamed vegetables (Broccoli, Carrot)"
        ]
    },
    'veg': {
        breakfast: [
            "Puttu and Kadala Curry",
            "Idli (3) with Sambar and Chutney",
            "Appam with Vegetable Stew",
            "Oats Upma with Plenty of Vegetables",
            "Wheat Dosa (2) with Coconut Chutney",
            "Steamed Nendran Banana and small portion of Upma",
            "Idiyappam (2) with Vegetable Kurma"
        ],
        lunch: [
            "Matta Rice with Aviyal and Moru Curry",
            "Matta Rice with Olan and Parippu Curry",
            "Matta Rice with Sambar and Beetroot Thoran",
            "Matta Rice with Erissery and Kalan",
            "Brown Rice, Vendakka (Okra) Thoran and Tomato Rasam",
            "Matta Rice with Koottu Curry and Pumpkin Erissery",
            "Matta Rice with Pineapple Pulissery and Cabbage Thoran"
        ],
        dinner: [
            "Oats Kanji with Green Gram",
            "2 Chapatis with Dal Fry (Spinach added)",
            "Vegetable Soup with Salad",
            "Kanji with Vanpayar Thoran",
            "2 Chapatis with Mixed Vegetable Kurma",
            "Wheat Upma with steamed sprouts",
            "Brown bread toast with mashed Avocado/Vegetable spread"
        ]
    }
};

const form = document.getElementById('diet-form');
const inputSection = document.getElementById('input-section');
const resultSection = document.getElementById('result-section');
const dietBody = document.getElementById('diet-body');
const targetCaloriesElem = document.getElementById('target-calories');
const waterIntakeElem = document.getElementById('water-intake');
const dietDisplayElem = document.getElementById('diet-display');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    generatePlan();
});

document.getElementById('new-plan-btn').addEventListener('click', () => {
    resultSection.classList.add('hidden');
    inputSection.classList.remove('hidden');
});

document.getElementById('regenerate-btn').addEventListener('click', () => {
    generatePlan();
});

function generatePlan() {
    const gender = document.getElementById('gender').value;
    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const activity = parseFloat(document.getElementById('activity').value);
    const preference = document.getElementById('preference').value;
    const speed = parseFloat(document.getElementById('speed').value);

    // BMR Calculation (Mifflin-St Jeor)
    let bmr;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // TEE (Total Energy Expenditure)
    const tee = bmr * activity;

    // Target Calories (with deficit)
    // 0.5kg/week approx 500kcal deficit
    // speed is weight loss in kg/week
    const deficit = (speed / 0.5) * 500;
    let targetCalories = Math.round(tee - deficit);

    // Safety Floor
    const floor = gender === 'male' ? 1500 : 1200;
    if (targetCalories < floor) targetCalories = floor;

    // Water Intake (30-35ml per kg)
    const water = (weight * 0.033).toFixed(1);

    // Update UI Summary
    targetCaloriesElem.textContent = `${targetCalories} kcal`;
    waterIntakeElem.textContent = `${water} L`;
    dietDisplayElem.textContent = preference.charAt(0).toUpperCase() + preference.slice(1);

    // Generate 7-day Plan
    renderTable(preference);

    // Show Results
    inputSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderTable(preference) {
    const meals = MEAL_DATABASE[preference];
    dietBody.innerHTML = '';

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    days.forEach((day, index) => {
        const tr = document.createElement('tr');
        
        // Pick semi-random meals for variety if possible, 
        // but for now let's use the list cyclically or just map
        const b = meals.breakfast[index % meals.breakfast.length];
        const l = meals.lunch[index % meals.lunch.length];
        const d = meals.dinner[index % meals.dinner.length];

        tr.innerHTML = `
            <td><strong>${day}</strong></td>
            <td>${b}</td>
            <td>${l}</td>
            <td>${d}</td>
        `;
        dietBody.appendChild(tr);
    });
}
