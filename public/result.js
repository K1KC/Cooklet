document.addEventListener('DOMContentLoaded', async () => {
    // Get the recipes data from the query parameter
    const params = new URLSearchParams(window.location.search);
    const recipesData = params.get('recipes');
    
    if (!recipesData) {
        console.error('No recipes data found');
        return;
    }
  
    try {
        const recipes = JSON.parse(recipesData);
        
        if (!Array.isArray(recipes)) {
            console.error('Invalid recipes data format');
            return;
        }

        // Fetch all ingredients
        const response = await fetch('http://localhost:5500/api/ingredients');
        if (!response.ok) {
            throw new Error('Failed to fetch ingredients');
        }
        const allIngredients = await response.json();
        
        // Map ingredient IDs to names
        const ingredientMap = {};
        allIngredients.forEach(ingredient => {
            ingredientMap[ingredient._id] = ingredient.ingredient_name;
        });
  
        // Display the search results
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) {
            console.error('Results div not found');
            return;
        }
  
        recipes.forEach(recipe => {
            const ingredientNames = recipe.ingredient_ids.map(id => ingredientMap[id] || 'Unknown ingredient').join(', ');
            const recipeDiv = document.createElement('div');
            recipeDiv.innerHTML = `
                <h2>${recipe.recipe_name}</h2>
                <p>Description: ${recipe.recipe_desc ? recipe.recipe_desc : 'No description available'}</p>
                <p>Ingredients: ${ingredientNames}</p>
            `;
            resultsDiv.appendChild(recipeDiv);
        });
    } catch (error) {
        console.error('Error parsing recipes data:', error);
    }
});
