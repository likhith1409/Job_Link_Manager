/**
 * Displays the list of jobs in the UI.
 * @param {Array} jobs - The list of jobs to display.
 */
function displayJobs(jobs) {
    const jobList = document.getElementById('jobs');
    // Map each job to a list item and join them into a single string
    jobList.innerHTML = jobs.map(job => `
        <li>
            <a href="${job.link}" class="job-link" target="_blank">${job.link}</a>
            <span class="job-skills">Skills: ${job.skills}</span>
        </li>
    `).join('');
}

/**
 * Displays a temporary message in the UI.
 * @param {string} message - The message to display.
 */
function showMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    // Clear the message after 3 seconds
    setTimeout(() => {
        messageDiv.textContent = '';
    }, 3000);
}

/**
 * Shows the confirmation dialog.
 */
function showConfirmationDialog() {
    const dialog = document.getElementById('confirmationDialog');
    dialog.style.display = 'flex'; // Display the dialog as a flex container
}

/**
 * Hides the confirmation dialog.
 */
function hideConfirmationDialog() {
    const dialog = document.getElementById('confirmationDialog');
    dialog.style.display = 'none'; // Hide the dialog
}

// Load jobs from Chrome storage and display them
chrome.storage.local.get({ jobs: [] }, function (data) {
    console.log('Loaded jobs from storage:', data.jobs);
    displayJobs(data.jobs); // Display the loaded jobs
});

// Handle form submission to add a new job
document.getElementById('jobForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get the job link and skills from the form
    const link = document.getElementById('link').value;
    const skills = document.getElementById('skills').value;

    // Retrieve existing jobs from storage
    chrome.storage.local.get({ jobs: [] }, function (data) {
        const jobs = data.jobs;
        jobs.push({ link, skills }); // Add the new job to the list

        // Save the updated jobs list to storage
        chrome.storage.local.set({ jobs }, function () {
            console.log('Job added:', { link, skills });
            displayJobs(jobs); // Update the UI with the new job
            showMessage('Job added successfully!'); // Show a success message
        });
    });
});

// Handle the "Clear All Jobs" button click
document.getElementById('clearJobs').addEventListener('click', function () {
    // Clear all jobs from storage
    chrome.storage.local.set({ jobs: [] }, function () {
        console.log('All jobs cleared.');
        displayJobs([]); // Clear the job list in the UI
        showMessage('All jobs cleared!'); // Show a confirmation message
    });
});

// Handle the "Send Jobs to Users" button click
document.getElementById('sendJobs').addEventListener('click', function () {
    showConfirmationDialog(); // Show the confirmation dialog
});

// Handle the "Yes" button in the confirmation dialog
document.getElementById('confirmYes').addEventListener('click', function () {
    hideConfirmationDialog(); // Hide the dialog
    // Send a message to the background script to send jobs
    chrome.runtime.sendMessage({ action: 'sendJobs' }, function (response) {
        console.log('Response from background script:', response);
        showMessage(response.message); // Show the response message
    });
});

// Handle the "No" button in the confirmation dialog
document.getElementById('confirmNo').addEventListener('click', function () {
    hideConfirmationDialog(); // Hide the dialog
});