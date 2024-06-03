document.querySelector('#search-by-name').addEventListener('submit', async (event) => {
    event.preventDefault();

    let searchParams = {};

    const recipeName = document.querySelector('#recipe-name').value.trim();

    if (!recipeName) {
        console.error('No recipe name provided');
        return;
    }

    searchParams = { name: recipeName };


    if (Object.keys(searchParams).length === 0) {
        console.error('No search parameters provided');
        return;
    }

    try {
        const response = await fetch('http://localhost:5500/api/searchName', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchParams),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }

        const recipes = await response.json();

        // Redirect to result.html with the recipes data
        try {
            sessionStorage.setItem('recipes', JSON.stringify(recipes));
            window.location.href = '/result.html?recipes=' + encodeURIComponent(JSON.stringify(recipes));
        } catch (error) {
            console.error('Error redirecting to result.html:', error);
        }

    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
});

document.querySelector('#search-by-ingredients').addEventListener('submit', async (event) => {
    event.preventDefault();
    let searchParams = {};
    const selectedIngredients = Array.from(document.querySelectorAll('.filter-textbox .ing_name')).map(span => span.dataset.id);

    if (selectedIngredients.length === 0) {
        console.error('No ingredients selected');
        return;
    }
    searchParams = { ingredientIds: selectedIngredients };

    if (Object.keys(searchParams).length === 0) {
        console.error('No search parameters provided');
        return;
    }

    console.log('Sending search parameters:', searchParams);

    try {
        const response = await fetch('http://localhost:5500/api/searchIngredient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchParams),
        });
        
        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch recipes: ${errorText}`);
        }

        const recipes = await response.json();

        // Redirect to result.html and pass recipes data as a query parameter
        window.location.href = `result.html?recipes=${encodeURIComponent(JSON.stringify(recipes))}`;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        if (error.name === 'TypeError') {
            console.error('TypeError: ', error);
        } else if (error.name === 'Error') {
            console.error('Error: ', error);
        } else {
            console.error('Unknown error: ', error);
        }
    }
});
