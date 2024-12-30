/**
 * Creates a formatted job alert message for matched jobs.
 * @param {Array} matchedJobs - List of jobs matched to the user's skills.
 * @returns {string} - The formatted message.
 */
function createJobAlertMessage(matchedJobs) {
  let message = `🤖 *Automated Job Alert!* 🤖\n\n`;
  message += `🌟 *Job Opportunity Just for You!* 🌟\n\n`;

  // Add details for each matched job
  matchedJobs.forEach((job, index) => {
    message += `🔗 *Link:* ${job.link}\n`;
    message += `💡 *Required Skills:* ${job.skills}\n\n`;
  });

  // Add instructions for applying
  message += `📝 *How to Apply:*\n`;
  message += `1. Click the link above to view the job details.\n`;
  message += `2. Submit your application before the deadline.\n\n`;

  // Add closing notes
  message += `💌 *Good luck with your application!* 💌\n\n`;
  message += `---\n`;
  message += `📅 *This is an automated message sent by Likhith's Job Alert System.*\n`;
  message += `🤖 *Powered by WhatsApp Automation.*`;

  return message;
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'sendJobs') {
    console.log('Received "sendJobs" action.');

    // Fetch users from the backend
    fetch('http://localhost:5000/users')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }
        return response.json();
      })
      .then(users => {
        console.log('Fetched users:', users);

        // Fetch jobs from Chrome storage
        chrome.storage.local.get({ jobs: [] }, function (data) {
          const jobs = data.jobs;
          console.log('Fetched jobs:', jobs);

          // Iterate over each user
          Object.entries(users).forEach(([name, userData]) => {
            const userSkills = userData.skills;
            console.log(`Processing user: ${name}, Skills: ${userSkills}`);

            // Match jobs to the user's skills
            const matchedJobs = jobs.filter(job => {
              const requiredSkills = job.skills.split(',').map(skill => skill.trim());
              console.log(`Job Skills: ${requiredSkills}`);
              return requiredSkills.some(skill => userSkills.includes(skill));
            });

            console.log(`Matched jobs for ${name}:`, matchedJobs);

            // If there are matched jobs, send a message
            if (matchedJobs.length > 0) {
              const message = createJobAlertMessage(matchedJobs); // Create the job alert message
              console.log('Message to send:', message);

              // Send the message via the backend
              fetch('http://localhost:5000/sendWhatsApp', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  phone: userData.phone,
                  message: message,
                }),
              })
                .then(response => {
                  if (!response.ok) {
                    throw new Error(`Failed to send message: ${response.statusText}`);
                  }
                  return response.json();
                })
                .then(result => {
                  console.log('Message sent successfully:', result);
                })
                .catch(error => {
                  console.error('Error sending message:', error);
                });
            } else {
              console.log(`No matched jobs for ${name}.`);
            }
          });

          // Send a response back to the extension
          sendResponse({ message: 'Jobs sent successfully!' });
        });
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        sendResponse({ message: 'Failed to fetch users.' });
      });
  }

  // Return true to keep the message channel open for sendResponse
  return true;
});