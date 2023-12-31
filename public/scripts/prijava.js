document.addEventListener('DOMContentLoaded', function () {
    // Select the form by its ID
    const loginForm = document.getElementById('loginForm');
  
    // Add an event listener for the form submission
    loginForm.addEventListener('submit', async function (event) {
      // Prevent the default form submission behavior
      event.preventDefault();
  
      // Get the username and password from the form
      const username = loginForm.querySelector('[name="username"]').value;
      const password = loginForm.querySelector('[name="password"]').value;
  
      try {
        // Call the postLogin method using async/await
        const data = await new Promise((resolve, reject) => {
          PoziviAjax.postLogin(username, password, function (err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
              const iframeElement = document.querySelector('iframe[name="iframe_a"]');
              const iframeContent = iframeElement.contentWindow;
              iframeContent.postMessage({
                action: 'Prijavljen',
                data: data
              }, 'http://localhost:3000/meni.html');
            }
          });
        });
  
        console.log('Login successful:', data);
        // Handle the retrieved data (e.g., update the UI)
      } catch (error) {
        console.error('Error during login:', error);
        // Handle the error (display a message, etc.)
      }
    });
  });
  