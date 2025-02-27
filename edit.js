 // ----- Global Functions for Gallery -----
      
      // Fetch categories from the API and populate the filter buttons
      async function loadCategories() {
        try {
          const response = await fetch('http://localhost:5678/api/categories', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          const categories = await response.json();
          console.log('Categories:', categories);
      
          const buttonContainer = document.getElementById('button-container');
          buttonContainer.innerHTML = ''; // Clear any existing buttons
      
          const allButton = document.createElement('button');
          allButton.textContent = 'All';
          allButton.dataset.categoryId = 'all';
          allButton.addEventListener('click', () => filterProjectsByCategory('all', allButton));
          buttonContainer.appendChild(allButton);
      
          categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.name;
            button.dataset.categoryId = category.id;
            button.addEventListener('click', () => filterProjectsByCategory(category.id, button));
            buttonContainer.appendChild(button);
          });
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      }
      
      // Global variable to store all projects
      let allProjects = [];
      
      // Fetch projects and display them in the main gallery
      async function loadProjects() {
        try {
          const response = await fetch('http://localhost:5678/api/works', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          allProjects = await response.json();
          console.log('All Projects:', allProjects);
          displayProjects(allProjects);
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      }
      
      // Display projects in the main gallery
      function displayProjects(projects) {
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '';
      
        projects.forEach(project => {
          const figure = document.createElement('figure');
          const img = document.createElement('img');
          img.src = project.imageUrl;
          img.alt = project.title;
          const figcaption = document.createElement('figcaption');
          figcaption.textContent = project.title;
      
          figure.appendChild(img);
          figure.appendChild(figcaption);
          gallery.appendChild(figure);
        });
      }
      
      // Filter projects based on category
      function filterProjectsByCategory(categoryId, selectedButton) {
        const buttons = document.querySelectorAll('#button-container button');
        buttons.forEach(button => button.classList.remove('active'));
        selectedButton.classList.add('active');
      
        let filteredProjects;
        if (categoryId === 'all') {
          filteredProjects = allProjects;
        } else {
          filteredProjects = allProjects.filter(project => project.category.id === categoryId);
        }
      
        displayProjects(filteredProjects);
      }
      
      // Load gallery categories and projects when the window loads
      window.onload = () => {
        loadCategories();
        loadProjects();
      };
      
      
      // ----- Modal & Add/Delete Work Functionality -----
      
      document.addEventListener("DOMContentLoaded", () => {
        // Modal Elements
        const modalGallery = document.getElementById('photo-gallery-modal');
        const modalAddPhoto = document.getElementById('add-photo-modal');
        const editPortfolioLink = document.getElementById('editPortfolioLink');
        const closeModalGallery = modalGallery.querySelector('.close-modal');
        const closeModalAdd = modalAddPhoto.querySelector('.close-modal');
        const backToGallery = document.getElementById('back-to-gallery');
        const openAddPhotoModalButton = document.getElementById('open-add-photo-modal');
        const imageGrid = document.getElementById('image-grid');
        const addWorkApiUrl = 'http://localhost:5678/api/works';
      
        // ----- Modal Gallery Functions -----
      
        // Fetch and display works in the modal (for edit mode)
        async function loadWorks() {
          try {
            const response = await fetch(addWorkApiUrl, {
              method: 'GET',
              headers: { 'Accept': 'application/json' }
            });
            const works = await response.json();
            displayWorksInModal(works);
          } catch (error) {
            console.error('Error fetching works:', error);
          }
        }
      
        // Display works inside the modal's image grid
        function displayWorksInModal(works) {
          imageGrid.innerHTML = ''; // Clear previous content
      
          works.forEach(work => {
            const imgContainer = document.createElement('div');
            const imgElement = document.createElement('img');
            imgElement.src = work.imageUrl;
            imgElement.alt = work.title;
      
            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fa-regular', 'fa-trash-can');
            deleteIcon.style.cursor = 'pointer';
            deleteIcon.addEventListener('click', () => deleteWork(work.id));
      
            imgContainer.appendChild(imgElement);
            imgContainer.appendChild(deleteIcon);
            imageGrid.appendChild(imgContainer);
          });
        }
      
        // Delete work function with authentication
        async function deleteWork(workId) {
          const token = localStorage.getItem("auth_token");
          try {
            const response = await fetch(`${addWorkApiUrl}/${workId}`, {
              method: 'DELETE',
              headers: { 
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            if (response.ok) {
              alert('Work deleted successfully');
              loadWorks();
            } else {
              alert('Failed to delete work');
            }
          } catch (error) {
            console.error('Error deleting work:', error);
          }
        }
      
        // ----- Modal Open/Close Event Listeners -----
      
        // Open gallery modal and load works for editing
        editPortfolioLink.addEventListener('click', async (e) => {
          e.preventDefault();
          modalGallery.style.display = 'flex';
          await loadWorks();
        });
      
        // Close gallery modal
        closeModalGallery.addEventListener('click', () => {
          modalGallery.style.display = 'none';
        });
      
        // Open Add Photo Modal: hide gallery, load category options, then show add photo modal
        openAddPhotoModalButton.addEventListener('click', async () => {
          modalGallery.style.display = 'none';
          await loadCategoriesForSelect();
          modalAddPhoto.style.display = 'flex';
        });
      
        // Go back to gallery modal from add photo modal
        backToGallery.addEventListener('click', () => {
          modalAddPhoto.style.display = 'none';
          modalGallery.style.display = 'flex';
        });
      
        // Close add photo modal
        closeModalAdd.addEventListener('click', () => {
          modalAddPhoto.style.display = 'none';
        });
      
        // Load categories for the Add Photo modal's dropdown
        async function loadCategoriesForSelect() {
          try {
            const response = await fetch('http://localhost:5678/api/categories', {
              method: 'GET',
              headers: { 'Accept': 'application/json' }
            });
            const categories = await response.json();
      
            const categorySelect = document.getElementById('category');
            categorySelect.innerHTML = '';
      
            // Add default placeholder option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Category';
            categorySelect.appendChild(defaultOption);
      
            categories.forEach(cat => {
              const option = document.createElement('option');
              option.value = cat.id;
              option.textContent = cat.name;
              categorySelect.appendChild(option);
            });
          } catch (error) {
            console.error('Error fetching categories:', error);
          }
        }
      
        // ----- Add Photo Form Handling -----
      
        const addPhotoForm = document.getElementById('add-photo-form');
        const imageInput = document.getElementById('image-upload');
        const titleInput = document.getElementById('title');
        const categorySelect = document.getElementById('category');
        const confirmButton = document.querySelector('.confirm-button');
      
        // Enable the confirm button when all required fields have valid input
        function checkFormValidity() {
          if (
            imageInput.files.length > 0 &&
            titleInput.value.trim() !== "" &&
            categorySelect.value !== ""
          ) {
            confirmButton.disabled = false;
          } else {
            confirmButton.disabled = true;
          }
        }
      
        // Attach validation event listeners
        imageInput.addEventListener('change', checkFormValidity);
        titleInput.addEventListener('input', checkFormValidity);
        categorySelect.addEventListener('change', checkFormValidity);
      
        // Handle Add Photo form submission
        addPhotoForm.addEventListener('submit', async (e) => {
          e.preventDefault();
      
          const token = localStorage.getItem("auth_token");
          const formData = new FormData();
          formData.append('image', imageInput.files[0]);
          formData.append('title', titleInput.value);
          formData.append('category', categorySelect.value);
      
          try {
            const response = await fetch(addWorkApiUrl, {
              method: 'POST',
              headers: { 
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: formData
            });
      
            if (response.ok) {
              alert('Work added successfully');
              loadWorks(); // Reload the works in the modal
              addPhotoForm.reset();
              modalAddPhoto.style.display = 'none';
              modalGallery.style.display = 'flex';
              confirmButton.disabled = true;
            } else {
              alert('Failed to add work');
            }
          } catch (error) {
            console.error('Error adding work:', error);
          }
        });
      });