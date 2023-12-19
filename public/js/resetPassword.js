
document.getElementById('restablecer').addEventListener('click', async (event) => {
    event.preventDefault();

    const password = document.querySelector('input[name="Newpassword"]').value;
    const repeatPassword = document.querySelector('input[name="repeatNewPassword"]').value;
    const email = document.querySelector('input[name="email"]').value;


    let pathname = window.location.pathname.split("/")
    let token = pathname[pathname.length-1]



    const changePassword = async () => {
        try {
          const response = await fetch(`/reset/${token}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
              password,
              repeatPassword,
              email
            }),
          });
          await response.json();
          alert("Contraseña cambiada con exito");
          window.location.href = "/login";
        } catch (error) {
          alert("Error al cambiar la contraseña");
        }
      };
      changePassword();
    });
