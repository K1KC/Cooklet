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

    if (!ingredientId || !ingredientName) {
        console.error('Invalid ingredient data');
        return;
    }

    const div_selected = document.createElement('div');
    div_selected.className = 'selected-tag';

    const ingredientText = document.createElement('span');
    ingredientText.textContent = ingredientName;
    ingredientText.dataset.id = ingredientId;
    ingredientText.className = 'ing_name';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'filter-delete-button';
    deleteBtn.textContent = 'X';
    deleteBtn.className = 'filter-delete-button';
    deleteBtn.addEventListener('click', () => {
        textboxContainer.removeChild(div_selected);
    });

    div_selected.appendChild(ingredientText);
    div_selected.appendChild(deleteBtn);
    textboxContainer.appendChild(div_selected);
    sort(textboxContainer);
}

function sort(container) {
    const tags = Array.from(container.children);
    tags.sort((a, b) => a.querySelector('span').textContent.localeCompare(b.querySelector('span').textContent));

    tags.forEach(tag => container.appendChild(tag));
}



