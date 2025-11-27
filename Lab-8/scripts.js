document.addEventListener("DOMContentLoaded", () => {
  // --- SELECTORS ---
  const addRecipeForm = document.getElementById("add-recipe-form");
  const recipeList = document.getElementById("recipe-list");
  const modal = document.getElementById("recipe-modal");
  const closeModalBtn = document.querySelector(".close-button");
  const editIndexInput = document.getElementById("edit-index");
  const formTitle = document.getElementById("form-title");
  const submitButton = document.getElementById("submit-button");
  const cancelEditButton = document.getElementById("cancel-edit-button");
  const currentImagePreview = document.getElementById("current-image-preview");

  let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

  const saveRecipes = () => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  };

  const displayRecipes = () => {
    recipeList.innerHTML = "";

    if (recipes.length === 0) {
      recipeList.innerHTML =
        "<p>No recipes added yet. Add one using the form!</p>";
      return;
    }

    // Loop through each recipe and create a card
    recipes.forEach((recipe, index) => {
      const recipeCard = document.createElement("div");
      recipeCard.classList.add("recipe-card");

      // Use the stored image or a placeholder
      const imageSrc =
        recipe.image || "https://via.placeholder.com/300x200.png?text=No+Image";

      recipeCard.innerHTML = `
                <img src="${imageSrc}" alt="${recipe.title}">
                <div class="recipe-card-content">
                    <h3>${recipe.title}</h3>
                </div>
                <div class="recipe-card-buttons">
                    <button class="btn-view" data-index="${index}">View</button>
                    <button class="btn-edit" data-index="${index}">Edit</button>
                    <button class="btn-delete" data-index="${index}">Delete</button>
                </div>
            `;
      recipeList.appendChild(recipeCard);
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get values from the form
    const title = document.getElementById("recipe-title").value;
    const ingredients = document.getElementById("recipe-ingredients").value;
    const instructions = document.getElementById("recipe-instructions").value;
    const imageFile = document.getElementById("recipe-image").files[0];
    const editIndex = editIndexInput.value;

    // Use FileReader to convert the image to a Base64 string
    const reader = new FileReader();

    // This function runs AFTER the reader has loaded the file
    reader.onloadend = () => {
      const imageData = reader.result;

      if (editIndex === "") {
        const newRecipe = {
          title: title,
          ingredients: ingredients,
          instructions: instructions,
          image: imageData, // This will be the Base64 string
        };
        recipes.push(newRecipe);
      } else {
        // --- UPDATE EXISTING RECIPE ---
        const recipeToUpdate = recipes[editIndex];
        recipeToUpdate.title = title;
        recipeToUpdate.ingredients = ingredients;
        recipeToUpdate.instructions = instructions;

        // Only update the image if a new one was selected
        if (imageFile) {
          recipeToUpdate.image = imageData;
        }
      }

      // Save, re-display, and reset the form
      saveRecipes();
      displayRecipes();
      resetForm();
    };

    if (imageFile) {
      reader.readAsDataURL(imageFile);
    } else {
      // If no new file is chosen...
      if (editIndex === "") {
        reader.onloadend();
      } else {
        //
        reader.onloadend();
      }
    }
  };

  /**
   */
  const handleListClick = (event) => {
    const target = event.target;
    const index = target.dataset.index;

    if (target.classList.contains("btn-delete")) {
      // --- DELETE RECIPE ---
      if (
        confirm(`Are you sure you want to delete "${recipes[index].title}"?`)
      ) {
        recipes.splice(index, 1); // Remove the recipe from the array
        saveRecipes();
        displayRecipes();
      }
    } else if (target.classList.contains("btn-edit")) {
      // --- EDIT RECIPE ---
      populateFormForEdit(index);
    } else if (target.classList.contains("btn-view")) {
      // --- VIEW RECIPE ---
      showRecipeModal(index);
    }
  };

  const populateFormForEdit = (index) => {
    const recipe = recipes[index];

    document.getElementById("recipe-title").value = recipe.title;
    document.getElementById("recipe-ingredients").value = recipe.ingredients;
    document.getElementById("recipe-instructions").value = recipe.instructions;
    editIndexInput.value = index; // Set the hidden index

    // Show current image
    if (recipe.image) {
      currentImagePreview.src = recipe.image;
      currentImagePreview.style.display = "block";
    } else {
      currentImagePreview.style.display = "none";
    }

    // Update UI to "Edit Mode"
    formTitle.textContent = "Edit Recipe";
    submitButton.textContent = "Update Recipe";
    cancelEditButton.style.display = "inline-block";

    // Scroll to the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * Resets the form back to "Add" mode.
   */
  const resetForm = () => {
    addRecipeForm.reset(); // Clears all form fields
    editIndexInput.value = ""; // Clear the hidden index
    formTitle.textContent = "Add a New Recipe";
    submitButton.textContent = "Add Recipe";
    cancelEditButton.style.display = "none";
    currentImagePreview.style.display = "none";
    currentImagePreview.src = "";
  };

  /**
   * Displays the recipe details in a modal.
   */
  const showRecipeModal = (index) => {
    const recipe = recipes[index];

    document.getElementById("modal-title").textContent = recipe.title;

    // Replace newlines (\n) with <br> tags for correct HTML display
    document.getElementById("modal-ingredients").innerHTML =
      recipe.ingredients.replace(/\n/g, "<br>");
    document.getElementById("modal-instructions").innerHTML =
      recipe.instructions.replace(/\n/g, "<br>");

    document.getElementById("modal-image").src =
      recipe.image || "https://via.placeholder.com/600x400.png?text=No+Image";

    modal.style.display = "flex"; // Show the modal
  };

  /**
   * Hides the recipe detail modal.
   */
  const closeModal = () => {
    modal.style.display = "none";
  };

  // --- EVENT LISTENERS ---
  addRecipeForm.addEventListener("submit", handleFormSubmit);
  recipeList.addEventListener("click", handleListClick);
  closeModalBtn.addEventListener("click", closeModal);
  cancelEditButton.addEventListener("click", resetForm);

  // Close modal if user clicks outside of the modal content
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  displayRecipes();
});
