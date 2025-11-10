// Vehicle categorization database
// This maps vehicle models to their size categories

export const vehicleDatabase = {
    // COMPACT CARS (sedans, hatchbacks, small cars)
    compact: [
        // Honda
        'honda city', 'honda civic', 'honda accord', 'honda amaze', 'honda jazz', 'honda brio',
        // Toyota
        'toyota corolla', 'toyota yaris', 'toyota etios', 'toyota glanza', 'toyota camry',
        // Hyundai
        'hyundai i20', 'hyundai verna', 'hyundai elantra', 'hyundai aura', 'hyundai grand i10',
        // Maruti Suzuki
        'maruti swift', 'maruti dzire', 'maruti baleno', 'maruti ciaz', 'maruti alto', 'maruti wagon r',
        'maruti celerio', 'maruti ignis', 's-cross',
        // Volkswagen
        'volkswagen polo', 'volkswagen vento', 'vw polo', 'vw vento', 'volkswagen jetta',
        // Skoda
        'skoda rapid', 'skoda octavia', 'skoda superb', 'skoda slavia',
        // Ford
        'ford figo', 'ford aspire', 'ford fiesta', 'ford fusion', 'ford focus',
        // Nissan
        'nissan sunny', 'nissan micra', 'nissan kicks',
        // Tata
        'tata tiago', 'tata tigor', 'tata altroz', 'tata zest', 'tata bolt',
        // Mahindra
        'mahindra verito', 'mahindra logan',
        // Renault
        'renault kwid', 'renault triber', 'renault kiger', 'renault duster',
        // Kia
        'kia rio', 'kia forte', 'kia seltos',
        // MG
        'mg hector',
        // BMW
        'bmw 3 series', 'bmw 320d', 'bmw 330i',
        // Mercedes
        'mercedes c class', 'mercedes a class', 'mercedes cla',
        // Audi
        'audi a3', 'audi a4',
        // Others
        'fiat punto', 'chevrolet beat', 'datsun go', 'datsun redi-go'
    ],

    // LARGE VEHICLES (SUVs, MUVs, vans)
    large: [
        // Toyota
        'toyota fortuner', 'toyota innova', 'toyota innova crysta', 'toyota land cruiser',
        'toyota hilux', 'toyota prado',
        // Mahindra
        'mahindra scorpio', 'mahindra xuv500', 'mahindra xuv700', 'mahindra thar', 'mahindra bolero',
        'mahindra marazzo', 'mahindra tuv300', 'mahindra xylo', 'mahindra scorpio n',
        // Tata
        'tata safari', 'tata harrier', 'tata hexa', 'tata sumo', 'tata nexon',
        // Hyundai
        'hyundai creta', 'hyundai venue', 'hyundai tucson', 'hyundai santa fe', 'hyundai alcazar',
        // Kia
        'kia seltos', 'kia sonet', 'kia carnival', 'kia sorento', 'kia sportage',
        // Ford
        'ford endeavour', 'ford ecosport', 'ford explorer', 'ford expedition',
        // Jeep
        'jeep compass', 'jeep wrangler', 'jeep grand cherokee', 'jeep meridian',
        // Honda
        'honda crv', 'honda brv', 'honda pilot',
        // Nissan
        'nissan terrano', 'nissan patrol', 'nissan armada', 'nissan pathfinder',
        // Renault
        'renault captur', 'renault lodgy',
        // MG
        'mg hector plus', 'mg gloster', 'mg astor',
        // BMW
        'bmw x1', 'bmw x3', 'bmw x5', 'bmw x7',
        // Mercedes
        'mercedes glc', 'mercedes gle', 'mercedes gls', 'mercedes g class', 'mercedes glb',
        // Audi
        'audi q3', 'audi q5', 'audi q7', 'audi q8',
        // Land Rover
        'range rover', 'land rover discovery', 'land rover defender',
        // Volvo
        'volvo xc40', 'volvo xc60', 'volvo xc90',
        // Porsche
        'porsche cayenne', 'porsche macan',
        // Others
        'chevrolet trailblazer', 'isuzu mu-x', 'isuzu v-cross'
    ],

    // MINI/TWO-WHEELERS
    mini: [
        // Bikes
        'honda activa', 'honda dio', 'honda shine', 'honda unicorn', 'honda hornet', 'honda cb',
        'hero splendor', 'hero passion', 'hero glamour', 'hero xtreme', 'hero hf deluxe',
        'bajaj pulsar', 'bajaj avenger', 'bajaj dominar', 'bajaj platina', 'bajaj ct',
        'tvs apache', 'tvs ntorq', 'tvs jupiter', 'tvs xl', 'tvs raider', 'tvs ronin',
        'yamaha fz', 'yamaha r15', 'yamaha mt', 'yamaha fascino', 'yamaha ray',
        'suzuki gixxer', 'suzuki access', 'suzuki burgman', 'suzuki intruder', 'suzuki hayabusa',
        'royal enfield', 'bullet', 'classic 350', 'himalayan', 'interceptor', 'continental gt',
        'ktm duke', 'ktm rc', 'ktm adventure',
        'kawasaki ninja', 'kawasaki versys', 'kawasaki z',
        'harley davidson',
        'ducati',
        // Scooters
        'activa', 'dio', 'jupiter', 'access', 'ntorq', 'vespa', 'aprilia',
        // Electric
        'ather', 'ola electric', 'simple one', 'revolt'
    ]
};

/**
 * Categorizes a vehicle based on its model name
 * @param {string} vehicleModel - The vehicle model name entered by user
 * @returns {string} - Returns 'compact', 'large', or 'mini'
 */
export const categorizeVehicle = (vehicleModel) => {
    if (!vehicleModel || typeof vehicleModel !== 'string') {
        return null;
    }

    const modelLower = vehicleModel.toLowerCase().trim();

    // Check for two-wheeler keywords
    const twoWheelerKeywords = ['bike', 'scooter', 'motorcycle', 'scooty', 'activa', 'splendor',
        'pulsar', 'apache', 'bullet', 'duke', 'ninja', 'fz', 'dio'];
    if (twoWheelerKeywords.some(keyword => modelLower.includes(keyword))) {
        return 'mini';
    }

    // Check mini category
    for (const model of vehicleDatabase.mini) {
        if (modelLower.includes(model) || model.includes(modelLower)) {
            return 'mini';
        }
    }

    // Check for SUV/MUV/Van keywords
    const largeKeywords = ['suv', 'xuv', 'muv', 'van', 'fortuner', 'innova', 'scorpio',
        'safari', 'creta', 'thar', 'endeavour'];
    if (largeKeywords.some(keyword => modelLower.includes(keyword))) {
        return 'large';
    }

    // Check large category
    for (const model of vehicleDatabase.large) {
        if (modelLower.includes(model) || model.includes(modelLower)) {
            return 'large';
        }
    }

    // Check compact category
    for (const model of vehicleDatabase.compact) {
        if (modelLower.includes(model) || model.includes(modelLower)) {
            return 'compact';
        }
    }

    // Default to compact if no match found (most common vehicle type)
    return 'compact';
};

/**
 * Get vehicle category display information
 * @param {string} category - 'compact', 'large', or 'mini'
 * @returns {object} - Category details
 */
export const getCategoryInfo = (category) => {
    const categoryInfo = {
        compact: {
            label: 'Compact Car',
            description: 'Sedans, Hatchbacks',
            rate: '₹35/hour',
            examples: 'e.g., Honda City, Swift, i20'
        },
        large: {
            label: 'Large Vehicle',
            description: 'SUVs, MUVs, Vans',
            rate: '₹50/hour',
            examples: 'e.g., Fortuner, Creta, Scorpio'
        },
        mini: {
            label: 'Two Wheeler',
            description: 'Motorcycles, Scooters',
            rate: '₹20/hour',
            examples: 'e.g., Activa, Pulsar, Bullet'
        }
    };

    return categoryInfo[category] || categoryInfo.compact;
};

/**
 * Get autocomplete suggestions based on partial input
 * @param {string} input - Partial vehicle model name
 * @param {number} limit - Maximum number of suggestions
 * @returns {array} - Array of suggested vehicle models
 */
export const getVehicleSuggestions = (input, limit = 10) => {
    if (!input || input.length < 2) {
        return [];
    }

    const inputLower = input.toLowerCase().trim();
    const allVehicles = [
        ...vehicleDatabase.compact,
        ...vehicleDatabase.large,
        ...vehicleDatabase.mini
    ];

    const suggestions = allVehicles
        .filter(model => model.includes(inputLower))
        .slice(0, limit)
        .map(model => ({
            model: model,
            category: categorizeVehicle(model),
            displayName: model.split(' ').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')
        }));

    return suggestions;
};
