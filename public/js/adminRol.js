const rolButtons = document.getElementsByClassName('rolButtonClass');
const deleteButtons = document.getElementsByClassName('deleteButtonClass');


Array.from(rolButtons).forEach((button) => {
  button.addEventListener('click', async (event) => {
    event.preventDefault();
  

    const userId = event.target.dataset.userId;
  
    try {
  
      const response = await fetch('/listOfUsers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
  
  
      if (response.ok) {
        const data = await response.json();

        console.log(data);
      } else {
        console.error('Error en la solicitud al backend');
      }
    } catch (error) {
      console.error(error);
    }
  });
});


Array.from(deleteButtons).forEach((button) => {
  button.addEventListener('click', async (event) => {
    event.preventDefault();
  
    const userId = event.target.dataset.userId;
  
    try {
      
      const response = await fetch(`/listOfUsers/${userId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        const data = await response.json();
      
        console.log(data);
      } else {
        console.error('Error en la solicitud al backend');
      }
    } catch (error) {
      console.error(error);
    }
  });
});
