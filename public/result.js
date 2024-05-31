document.addEventListener('DOMContentLoaded', () => {
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

      // Display the search results
      const resultsDiv = document.getElementById('results');
      if (!resultsDiv) {
          console.error('Results div not found');
          return;
      }

      recipes.forEach(recipe => {
          const recipeDiv = document.createElement('div');
          recipeDiv.innerHTML = `
              <h2>${recipe.recipe_name}</h2>
              <p>Description: ${recipe.recipe_desc}</p>
              <p>Ingredients: ${recipe.ingredient_ids.join(', ')}</p>
          `;
          resultsDiv.appendChild(recipeDiv);
      });
  } catch (error) {
      console.error('Error parsing recipes data:', error);
  }
});
