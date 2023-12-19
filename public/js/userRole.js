
const userButton = document.getElementById('premiumButton');
const adminRolButton = document.getElementById('rolButton')
const adminDeleteButton = document.getElementById('deleteButton')


userButton.addEventListener('click', async () => {
  try {

    const response = await fetch(`/premium/:id`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: ""  
      })
    });

    const data = await response.json();
    console.log(data); 
  } catch (error) {
    console.error(error);
  }
});

