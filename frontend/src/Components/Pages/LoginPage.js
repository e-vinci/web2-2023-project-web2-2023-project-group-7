// eslint-disable-next-line import/no-unresolved
import ecranRanking from '../../assets/Capture1.png';
import Navigate from '../Router/Navigate';

 // const { storeUser } = require('../../utils/connection');

const ConnectionPage = () => {
  let responseFetch =null;
  const main = document.querySelector('main');

  const connectionPageContent = document.createElement('div');
  connectionPageContent.classList.add('register-page-content');
  connectionPageContent.style.backgroundImage = `url(${ecranRanking})`;
  connectionPageContent.style.backgroundSize = 'cover';
  connectionPageContent.style.backgroundPosition = 'center';
  connectionPageContent.style.height = '100vh';
  connectionPageContent.style.display = 'flex';
  connectionPageContent.style.justifyContent = 'center';
  connectionPageContent.style.alignItems = 'center';

  const formContainer = document.createElement('div');
  formContainer.classList.add('container', 'col-md-4');

  const form = document.createElement('form');
  form.classList.add('bg-light', 'p-4', 'rounded');

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

  const username = createFormElement('Username', 'text', 'username');
  const password = createFormElement('Password', 'password', 'password');
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Login';
  submitButton.classList.add('btn', 'btn-primary', 'mt-3');
  submitButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const formData = {
      username: username.input.value,
      password: password.input.value,
    };

    try {
      const response = await fetch('api/auths/login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
      });
      responseFetch = await response.json()
     
       if (response.ok) {
        // storeUser(responseFetch); // ne fonctionne pas : message d'erreur n'est pas une fonction????
          localStorage.setItem('project.usrnm',responseFetch.username);
          localStorage.setItem('project.tkn',responseFetch.token);
       }

      if (!response.ok) {
        // alert('Passwords do not match');
        ConnectionPage();
        throw new Error(`Fetch error: ${response.status} : ${response.statusText}`);
       
      }
      Navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  });

  [username, password].forEach(({ label, input }) => {
    form.appendChild(label);
    form.appendChild(input);
  });

  form.appendChild(submitButton);

  formContainer.appendChild(form);

  connectionPageContent.appendChild(formContainer);

  main.innerHTML = '';

  main.appendChild(connectionPageContent);
};

export default ConnectionPage;
