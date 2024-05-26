function searchIngredients(ingredients, searchTags) {
  const searchTagsLower = searchTags.map((tags) => tags.ToLowerCase());
  const filteredSearch = ingredients.filter((ingredient) => {
    const tagCheck =
      ingredients.tags &&
      ingredient.tags.some((tag) =>
        searchTagsLower.some((searchTag) =>
          tag.ToLowerCase().includes(searchTag)
        )
      );

    return tagCheck;
  });

  return filteredSearch;
}
