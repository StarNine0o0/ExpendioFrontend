
        const loginForm = document.getElementById('loginForm');

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página se recargue

            // Obtenemos los valores de los inputs por su ID
            const nombreUsuario = document.getElementById('nombre_usuario').value;
            const contrasena = document.getElementById('contrasena').value;
            const btn = document.getElementById('continuar-btn');

            // Feedback visual (deshabilitar botón)
            btn.disabled = true;
            btn.innerText = "Verificando...";

            try {
                // Hacemos la petición a TU API Laravel
                // Asegúrate de que el puerto sea el correcto (8000 o el que estés usando)
                const response = await fetch('http://127.0.0.1:8000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        nombre_usuario: nombreUsuario,
                        contrasena: contrasena
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    
                    // Guardamos datos importantes para usarlos en otras páginas
                    localStorage.setItem('user_id', data.user_id);
                    localStorage.setItem('user_role', data.id_rol);
                    
                  if (data.id_rol == 1) {
                    // Redirigir al menú
                    window.location.href = 'ALmacen2.html';
                  } else if (data.id_rol == 2) {
                    // Redirigir al menú
                    window.location.href = 'menu.html';
                  }
                  else {
                    // Redirigir al menú
                    window.location.href = 'Administrador.html';
                  }


                } else {
                    // --- ERROR (Credenciales incorrectas) ---
                    alert('Error: ' + (data.message || 'Credenciales incorrectas'));
                    btn.disabled = false;
                    btn.innerText = "Continuar";
                }

            } catch (error) {
                // --- ERROR DE CONEXIÓN (El servidor está apagado) ---
                console.error('Error:', error);
                alert('No se pudo conectar con el servidor. Revisa que Laravel esté corriendo.');
                btn.disabled = false;
                btn.innerText = "Continuar";
            }
        });
   