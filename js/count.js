document.addEventListener('DOMContentLoaded', () => {
  // Verificamos si hay un usuario logueado en localStorage (o sessionStorage)
  const currentUserString = localStorage.getItem('currentUser');
  
  if (!currentUserString) {
    // Redirigir a login si no hay nadie conectado
    window.location.href = 'login.html';
    return;
  }

  try {
    const user = JSON.parse(currentUserString);
    
    // 1. Actualizar el nombre
    document.getElementById('user-name').textContent = user.nombre || user.email.split('@')[0];
    
    // 2. Actualizar el avatar (solo la inicial)
    const initial = (user.nombre || user.email || 'U').charAt(0).toUpperCase();
    document.getElementById('user-avatar').textContent = initial;

    // 3. Enmascarar el correo (ej: r****@g****.com)
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
    // Si los datos están corruptos, redirigimos al login
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  }

  // Evento para cerrar sesión
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  });
});
