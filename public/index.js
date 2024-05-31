document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:5500/api/ingredients');
        if (!response.ok) {
            throw new Error('Failed to fetch ingredients');
        }
        const ingredients = await response.json();

        // Sort ingredients alphabetically by ingredient_name
        ingredients.sort((a, b) => a.ingredient_name.localeCompare(b.ingredient_name));

        const tagContainer = document.querySelector('.tag-container');

        ingredients.forEach(ingredient => {
            const button = document.createElement('button');
            button.textContent = ingredient.ingredient_name;
            button.className = 'tag-ingredient-button';
            button.addEventListener('click', (event) => {
                event.preventDefault();
                addIngredient(ingredient._id, ingredient.ingredient_name);
            });
            tagContainer.appendChild(button);
        });
    } catch (error) {
        console.error('Error fetching ingredients:', error);
    }
});

function addIngredient(ingredientId, ingredientName) {
    const textboxContainer = document.querySelector('.filter-textbox');

    if (Array.from(textboxContainer.querySelectorAll('.ing_name')).some(span => span.dataset.id === ingredientId)) {
        console.log('Ingredient already added');
        return;
    }

    const selectedTagDiv = document.createElement('div');
    selectedTagDiv.className = 'selected-tag';

    const ingredientText = document.createElement('span');
    ingredientText.textContent = ingredientName;
    ingredientText.dataset.id = ingredientId;
    ingredientText.className = 'ing_name';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.className = 'filter-delete-button';
    deleteBtn.addEventListener('click', () => {
        textboxContainer.removeChild(selectedTagDiv);
    });

    selectedTagDiv.appendChild(ingredientText);
    selectedTagDiv.appendChild(deleteBtn);
    textboxContainer.appendChild(selectedTagDiv);
}

document.querySelector('#search-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const searchType = event.submitter.id;
    let searchParams = {};

    if (searchType === 'search-by-ingredients') {
        const selectedIngredients = Array.from(document.querySelectorAll('.filter-textbox .ing_name')).map(span => span.dataset.id);

        if (selectedIngredients.length === 0) {
            console.error('No ingredients selected');
            return;
        }

        // Pass the selected ingredient IDs to the searchParams
        searchParams = { ingredientIds: selectedIngredients }; // Use ingredientIds instead of ingredients
    } else if (searchType === 'search-by-name') {
        const recipeName = document.querySelector('#recipe-name').value.trim();
        
        if (!recipeName) {
            console.error('No recipe name provided');
            return;
        }

        searchParams = { name: recipeName };
    }

    try {
        const response = await fetch('http://localhost:5500/api/search', {
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
        sessionStorage.setItem('recipes', JSON.stringify(recipes));
        window.location.href = '/result.html?recipes=' + encodeURIComponent(JSON.stringify(recipes));

    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
});

