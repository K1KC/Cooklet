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
            button.className = 'tag-ingredient-button'; // Add a class for styling
            button.addEventListener('click', () => {
                filterRecipesByIngredient(ingredient.ingredient_name);
            });
            tagContainer.appendChild(button);
        });
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        // Handle the error gracefully, e.g., display a message to the user
    }
});

async function filterRecipesByIngredient(ingredientName) {
    try {
        // Fetch recipes from the server that contain the selected ingredient
        const response = await fetch(`http://localhost:5500/api/recipes?ingredient=${ingredientName}`);
        if (!response.ok) {
            throw new Error('Failed to filter recipes');
        }
        const recipes = await response.json();

        // Display the filtered recipes on the webpage
        console.log('Filtered recipes:', recipes);
        // Implement logic to display filtered recipes on the webpage
    } catch (error) {
        console.error('Error filtering recipes by ingredient:', error);
        // Handle the error gracefully, e.g., display a message to the user
    }
}
