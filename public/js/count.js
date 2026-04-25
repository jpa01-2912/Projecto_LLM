document.addEventListener('DOMContentLoaded', () => {
  // Verificamos si hay un usuario logueado en localStorage
  const loggedUserString = localStorage.getItem('loggedUser');
  
  if (!loggedUserString) {
    // Redirigir a login si no hay nadie conectado
    window.location.href = 'login.html';
    return;
  }

  let user;
  try {
    user = JSON.parse(loggedUserString);
    
    // 1. Actualizar el nombre
    document.getElementById('user-name').textContent = user.nombre || user.email.split('@')[0];
    
    // 2. Actualizar el avatar
    const avatarEl = document.getElementById('user-avatar');
    if (user.avatar && user.avatar.trim() !== '') {
      avatarEl.innerHTML = `<img src="${user.avatar}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
    } else {
      const initial = (user.nombre || user.email || 'U').charAt(0).toUpperCase();
      avatarEl.textContent = initial;
    }

    // 3. Enmascarar el correo
    const email = user.email || '';
    if (email.includes('@')) {
      const [local, domain] = email.split('@');
      const maskedLocal = local.length > 2 
        ? local.substring(0, 2) + '*'.repeat(3) 
        : local + '*'.repeat(3);
        
      const domainParts = domain.split('.');
      const domainName = domainParts[0];
      const domainExt = domainParts.length > 1 ? '.' + domainParts[domainParts.length - 1] : '';
      const maskedDomain = domainName.charAt(0) + '*'.repeat(3) + domainExt;
      
      document.getElementById('user-email').textContent = `${maskedLocal}@${maskedDomain}`;
    } else {
      document.getElementById('user-email').textContent = email;
    }

  } catch (error) {
    console.error('Error parseando datos del usuario:', error);
    localStorage.removeItem('loggedUser');
    window.location.href = 'login.html';
  }

  // Modal logic
  const settingsBtn = document.querySelector('.settings-btn');
  const modal = document.getElementById('settings-modal');
  const closeModalBtn = document.querySelector('.close-modal');
  const settingsForm = document.getElementById('settings-form');

  if (settingsBtn && modal && closeModalBtn && settingsForm) {
    settingsBtn.addEventListener('click', () => {
      // Pre-fill form
      document.getElementById('edit-name').value = user.nombre || '';
      document.getElementById('edit-email').value = user.email || '';
      document.getElementById('edit-password').value = ''; // Don't show current password
      document.getElementById('edit-avatar').value = user.avatar || '';
      modal.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

    settingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const saveBtn = settingsForm.querySelector('.save-settings-btn');
      const originalText = saveBtn.textContent;
      saveBtn.textContent = 'Guardando...';
      saveBtn.disabled = true;

      const updatedUser = {
        ...user,
        nombre: document.getElementById('edit-name').value,
        email: document.getElementById('edit-email').value,
        avatar: document.getElementById('edit-avatar').value
      };

      const newPassword = document.getElementById('edit-password').value;
      if (newPassword.trim() !== '') {
        updatedUser.password = newPassword;
      }

      try {
        const response = await fetch(`/api/usuarios/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedUser)
        });

        if (response.ok) {
          localStorage.setItem('loggedUser', JSON.stringify(updatedUser));
          // Reload the page to reflect changes
          window.location.reload();
        } else {
          const errorData = await response.json();
          alert('Error al guardar los cambios: ' + (errorData.error || 'Error desconocido'));
          saveBtn.textContent = originalText;
          saveBtn.disabled = false;
        }
      } catch (error) {
        console.error('Error updating user:', error);
        alert('Error de conexión al guardar los cambios.');
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
      }
    });
  }

  // Evento para cerrar sesión
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('loggedUser');
    window.location.href = 'login.html';
  });
});
