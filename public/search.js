document.querySelector('#search-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const selectedIngredients = Array.from(document.querySelectorAll('.filter-textbox .ing_name')).map(span => span.textContent);
  
    if (selectedIngredients.length === 0) {
      console.error('No ingredients selected');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5500/api/recipes?ingredients=${encodeURIComponent(selectedIngredients.join(','))}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const recipes = await response.json();
  
      // Redirect to result.html and pass recipes data as a query parameter
      window.location.href = `result.html?recipes=${encodeURIComponent(JSON.stringify(recipes))}`;
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  });
  