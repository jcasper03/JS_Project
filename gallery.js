
// Fetch categories from the API and populate the buttons
async function loadCategories() {
  try {
    const response = await fetch('http://localhost:5678/api/categories', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    const categories = await response.json();
    console.log('Categories:', categories); // Log categories to check

    // Find the button container and populate it with category buttons
    const buttonContainer = document.getElementById('button-container');

    // Create "All" button first
    const allButton = document.createElement('button');
    allButton.textContent = 'All';
    allButton.dataset.categoryId = 'all';  // A special value to represent all projects
    allButton.addEventListener('click', () => filterProjectsByCategory('all', allButton));
    buttonContainer.appendChild(allButton);

    // Create buttons for each category
    categories.forEach(category => {
      const button = document.createElement('button');
      button.textContent = category.name;
      button.dataset.categoryId = category.id; // Store the category ID in the button
      button.addEventListener('click', () => filterProjectsByCategory(category.id, button));
      buttonContainer.appendChild(button);
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

// Fetch projects and display them in the gallery
let allProjects = []; // To hold all projects
async function loadProjects() {
  try {
    const response = await fetch('http://localhost:5678/api/works', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    allProjects = await response.json();
    console.log('All Projects:', allProjects); // Log all projects to check
    displayProjects(allProjects); // Display all projects initially
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
}

// Display the projects in the gallery
function displayProjects(projects) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = ''; // Clear current gallery

  projects.forEach(project => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = project.imageUrl; // Assuming the project has 'imageUrl'
    img.alt = project.title;
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = project.title; // Assuming the project has 'title'

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

// Filter projects based on the selected category
function filterProjectsByCategory(categoryId, selectedButton) {
  // Highlight the selected button and reset others
  const buttons = document.querySelectorAll('#button-container button');
  buttons.forEach(button => button.classList.remove('active')); // Remove active class from all buttons
  selectedButton.classList.add('active'); // Add active class to the clicked button

  let filteredProjects;

  // If "All" button is clicked, show all projects
  if (categoryId === 'all') {
    filteredProjects = allProjects; // Show all projects
  } else {
    // Otherwise, filter by category ID
    filteredProjects = allProjects.filter(project => project.category.id === categoryId);
  }

  displayProjects(filteredProjects); // Display filtered projects
}

// Load categories and projects when the page loads
window.onload = () => {
  loadCategories();  // Load categories for filtering
  loadProjects();    // Load all projects initially
};

