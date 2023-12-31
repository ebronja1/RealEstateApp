
document.addEventListener('DOMContentLoaded', function () {
  PoziviAjax.getKorisnik(function (err, data) {
    if (err) {
      loggedInDisplay(false);
      console.log(err);
    } else {
      if (data.user) {
        loggedInDisplay(true);
      }
    }
  });
});

    odjavaLink.addEventListener('click', function () {
        // Make an asynchronous call to log out the user
        PoziviAjax.postLogout(function (logoutErr, logoutData) {
          if (logoutErr) {
            // Handle logout error
            console.error('Error logging out:', logoutErr);
          } else {
            // Handle successful logout
            loggedInDisplay(false);
            console.log('User logged out:', logoutData);
            // You can perform additional actions after successful logout
          }
        });
    });
   window.addEventListener('message', function (event) {

      // Extract data from the received message
      const { action, data} = event.data;
      if(action == 'Prijavljen') {
        loggedInDisplay(true);
      }
      else return;
    })
    function loggedInDisplay (param) {
       //get html data
       const nekretnineLink = document.querySelector('a[href="nekretnine.html"]');
       const detaljiLink = document.querySelector('a[href="detalji.html"]');
       const prijavaLink = document.querySelector('a[href="prijava.html"]');
       const profilLink = document.querySelector('a[href="profil.html"]');
       const odjavaLink = document.querySelector('#odjavaLink');
      if (param) {
        //Display parts of menu if logged in    
        prijavaLink.style.display = 'none'; // Show "Prijava"
        nekretnineLink.style.display = 'inline-block'; // Show "Nekretnine"
        detaljiLink.style.display = 'inline-block'; // Show "Detalji"
        profilLink.style.display = 'inline-block'; // Hide "Profil"
        odjavaLink.style.display = 'inline-block'; // Hide "Odjava"
      }
      else {
        //Display parts of menu if not logged in
        prijavaLink.style.display = 'inline-block'; // Show "Prijava"
        nekretnineLink.style.display = 'inline-block'; // Show "Nekretnine"
        detaljiLink.style.display = 'inline-block'; // Show "Detalji"
        profilLink.style.display = 'none'; 
        odjavaLink.style.display = 'none'; 
      }
    }