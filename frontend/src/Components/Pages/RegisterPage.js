// eslint-disable-next-line import/no-unresolved
 import ecranRanking from '../../assets/Capture1.png';


const ConnectionPage = () => {
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
  const confirmPassword = createFormElement('Confirm Password', 'password', 'confirmPassword');
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Register';
  submitButton.classList.add('btn', 'btn-primary', 'mt-3');
  submitButton.addEventListener('click', async () => {



    const formData = {
       username: username.input.value,
       password: password.input.value,
       confirmPassword: confirmPassword.input.value,
    };
    if (confirmPassword !== password) {
      alert('register rater ');
      window.location.href = '/';
    }
    
    try {
      
       // Utilisez votre propre chemin d'API au lieu de '/auths/register'
       const response = await fetch('api/auths/register', {
         method: 'POST',
         body: JSON.stringify(formData),
         mode: 'cors',
         credentials: 'include',
         headers: { 'Content-Type': 'application/json' }
         
       });
      
        if (!response.ok) {
          throw new Error(`Fetch error: ${response.status} : ${response.statusText}`);
        }
        window.location.href = '/';
       
       // const registeredUser = await response.json();
        // console.log('Registered user:', registeredUser);
       // console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
       
       document.write(response);

       // Ajoutez ici la logique pour rediriger ou effectuer d'autres actions après l'inscription réussie
    } catch (error) {
       console.error('Registration failed:', error.message);
       
    }
    window.location.href = '/';
   });
  

  [username, password, confirmPassword].forEach(({ label, input }) => {
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
