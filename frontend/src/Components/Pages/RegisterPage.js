// eslint-disable-next-line import/no-unresolved
import ecranRanking from '../../assets/Capture1.png';
import Navigate from '../Router/Navigate';
import { storeUser } from '../../utils/connection';
import cookieMgt from '../../utils/cookieMgt';

// Definition of the ConnectionPage component
const ConnectionPage = () => {
  let responseFetch =null;

  // Select the <main> element in the HTML document
  const main = document.querySelector('main');

  // Create a container for the connection page
  const connectionPageContent = document.createElement('div');
  connectionPageContent.classList.add('register-page-content');
  connectionPageContent.style.backgroundImage = `url(${ecranRanking})`;
  connectionPageContent.style.backgroundSize = 'cover';
  connectionPageContent.style.backgroundPosition = 'center';
  connectionPageContent.style.height = '100vh';
  connectionPageContent.style.display = 'flex';
  connectionPageContent.style.justifyContent = 'center';
  connectionPageContent.style.alignItems = 'center';
  connectionPageContent.id = 'RegisterPage';

  // Create a container for the form
  const formContainer = document.createElement('div');
  formContainer.classList.add('container', 'col-md-4');

  // Create the form
  const form = document.createElement('form');
  form.classList.add('bg-light', 'p-4', 'rounded');

  // Utility function to create form elements
  const createFormElement = (labelText, inputType, inputName) => {
    const label = document.createElement('label');
    label.textContent = labelText;
    label.classList.add('form-label');

    const input = document.createElement('input');
    input.type = inputType;
    input.classList.add('form-control');
    input.id = inputName;
    input.name = inputName;
    input.required = true;

    return { label, input };
  };

  // Create form fields
  const username = createFormElement('Username', 'text', 'username');
  const password = createFormElement('Password', 'password', 'password');
  const confirmPassword = createFormElement('Confirm Password', 'password', 'confirmPassword');
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Register';

  // Configure the submit button
  submitButton.classList.add('btn', 'btn-primary', 'mt-3');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // Check if passwords match
    if (confirmPassword.input.value !== password.input.value) {
      alert('Passwords do not match');
      ConnectionPage();
      return;
    }
    if(username.input.value.length >14){
      alert("user has too many characters");
      ConnectionPage();
      return;

    }
 
    // Build the FormData object from the form values
    const formData = {
      username: username.input.value,
      password: password.input.value,
    };
   
    try {
      // Send POST request to the registration API
      const response = await fetch('api/auths/register', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
      })
 
 
      responseFetch = await response.json()
     
      // Stocke le token dans le local storage (pas de cookie - choix du developpeur EIO)
      storeUser(responseFetch);

      // Gestion des erreurs
      if (response.status ===400){
        console.log(responseFetch.message)
        localStorage.removeItem('project.usrnm')
        localStorage.removeItem('project.tkn')
      }

      if (!response.ok) {
        ConnectionPage();
        alert("user already taken");
        throw new Error(`Fetch error: ${response.status} : ${response.statusText}`);
       
        // console.log(${response.status } +" : " + response.statusText);
      }

      // Redirige vers la home page
      Navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Registration failed:', error.message);
    }

  });

  // Add fields to the form
  [username, password, confirmPassword].forEach(({ label, input }) => {
    form.appendChild(label);
    form.appendChild(input);
  });

  // Add the submit button to the form
  form.appendChild(submitButton);

  // Add the form to the form container
  formContainer.appendChild(form);

  // Add the form container to the connection page
  connectionPageContent.appendChild(formContainer);

  // Clear the current content of <main>
  main.innerHTML = '';

  // Add the connection page to <main>
  main.appendChild(connectionPageContent);
// cookie mgt
  cookieMgt(connectionPageContent.id);
};



// Export the ConnectionPage component
export default ConnectionPage;
