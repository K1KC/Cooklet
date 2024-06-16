document.addEventListener('DOMContentLoaded', async () => {
    // Get the recipes data from the query parameter
    const params = new URLSearchParams(window.location.search);
    const recipesData = params.get('recipes');
    
    if (recipesData) {
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
    
            // Fetch all users
            const userResponse = await fetch('http://localhost:5500/api/users');
            if (!userResponse.ok) {
                throw new Error('Failed to fetch users');
            }
            const allUsers = await userResponse.json();
    
            // Map user IDs to names
            const userMap = {};
            allUsers.forEach(user => {
                userMap[user.user_id] = user.username; // Assuming user object has _id and name fields
            });
    
            // Display the search results
            const resultsContainer = document.getElementById('results-container');
            if (!resultsContainer) {
                console.error('Results container not found');
                return;
            }
            
            if (recipes.length === 0) {
                resultsContainer.innerHTML = `<p class="no-recipe-label">No recipe available yet</p>`;
            } else {
                resultsContainer.innerHTML = '';
                recipes.forEach((recipe, index) => {
                    const ingredientNames = recipe.ingredient_ids.map(id => ingredientMap[id] || 'Unknown ingredient').join(', ');
                    const recipeMakerName = userMap[recipe.recipe_maker] || 'Unknown Maker';
                    const recipeDiv = document.createElement('div');
                    recipeDiv.className = 'result-inner-container';
                    recipeDiv.innerHTML = `
                    <img src="${recipe.recipe_img}" class="recipe-food-img" id="result-img-${index}">
                    <h2 class="recipe-title">${recipe.recipe_name}</h2>
                    
                    <p>Description: ${recipe.recipe_desc ? recipe.recipe_desc : 'No description available'}</p>
                    <p>Ingredients: ${ingredientNames}</p>
                    <ol>${recipe.recipe_steps ? recipe.recipe_steps.map(step => `<li>${step}</li>`).join('') : 'No steps available'}</ol>
                    `;
                    resultsContainer.appendChild(recipeDiv);
                });
            }
        } catch (error) {
            console.error('Error parsing recipes data:', error);
        }
    } else {
        console.error("No recipe found");
        return;
    }
});

// <p>By: ${recipeMakerName}</p> 
// sementara taro sini