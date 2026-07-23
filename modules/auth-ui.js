/**
 * Abyssus - Authentication UI
 * Login, register, and account management
 */

class AuthUI {
  constructor() {
    this.isAuthenticated = false;
    this.currentUser = null;
  }

  showAuthModal() {
    const modal = `
      <div class="auth-modal-overlay" id="authModalOverlay">
        <div class="auth-modal">
          <button class="auth-close" id="authClose">✕</button>
          
          <div class="auth-tabs">
            <button class="auth-tab active" data-tab="login">Connexion</button>
            <button class="auth-tab" data-tab="register">Inscription</button>
          </div>

          <!-- Login Form -->
          <form class="auth-form active" id="loginForm" data-form="login">
            <h2>Connexion à l'Abyssus</h2>
            <div class="form-group">
              <label>Email</label>
              <input type="email" id="loginEmail" class="form-input" placeholder="ton@email.com" required>
            </div>
            <div class="form-group">
              <label>Mot de passe</label>
              <input type="password" id="loginPassword" class="form-input" placeholder="••••••••" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Se Connecter</button>
            <p class="auth-error" id="loginError"></p>
          </form>

          <!-- Register Form -->
          <form class="auth-form" id="registerForm" data-form="register">
            <h2>Créer un Compte</h2>
            <div class="form-group">
              <label>Nom d'Explorateur</label>
              <input type="text" id="registerUsername" class="form-input" placeholder="Ton pseudo unique" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" id="registerEmail" class="form-input" placeholder="ton@email.com" required>
            </div>
            <div class="form-group">
              <label>Mot de passe</label>
              <input type="password" id="registerPassword" class="form-input" placeholder="••••••••" required>
            </div>
            <div class="form-group">
              <label>Confirmer le mot de passe</label>
              <input type="password" id="registerPasswordConfirm" class="form-input" placeholder="••••••••" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Créer un Compte</button>
            <p class="auth-error" id="registerError"></p>
          </form>
        </div>
      </div>
    `;

    const container = document.getElementById('modal-container');
    container.innerHTML = modal;
    container.classList.add('active');

    this.setupAuthListeners();
  }

  setupAuthListeners() {
    // Tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.target.getAttribute('data-tab');
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        e.target.classList.add('active');
        document.querySelector(`[data-form="${tabName}"]`).classList.add('active');
      });
    });

    // Close modal
    document.getElementById('authClose')?.addEventListener('click', () => {
      document.getElementById('modal-container').innerHTML = '';
      document.getElementById('modal-container').classList.remove('active');
    });

    // Login form
    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    // Register form
    document.getElementById('registerForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleRegister();
    });
  }

  async handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorElement = document.getElementById('loginError');

    const result = await cloudDataManager.login(email, password);
    if (result.success) {
      errorElement.textContent = '';
      document.getElementById('modal-container').innerHTML = '';
      document.getElementById('modal-container').classList.remove('active');
      this.onAuthSuccess();
    } else {
      errorElement.textContent = '❌ ' + result.error;
    }
  }

  async handleRegister() {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const errorElement = document.getElementById('registerError');

    if (password !== passwordConfirm) {
      errorElement.textContent = '❌ Les mots de passe ne correspondent pas';
      return;
    }

    const result = await cloudDataManager.register(email, password, username);
    if (result.success) {
      errorElement.textContent = '';
      document.getElementById('modal-container').innerHTML = '';
      document.getElementById('modal-container').classList.remove('active');
      this.onAuthSuccess();
    } else {
      errorElement.textContent = '❌ ' + result.error;
    }
  }

  onAuthSuccess() {
    console.log('✅ Authentification réussie');
    if (window.uiManager) {
      window.uiManager.updatePlayerStatus();
      window.uiManager.updateDomainCards();
    }
  }

  showLogoutButton() {
    // Add logout button to navbar
    const navbar = document.querySelector('.navbar-player');
    if (navbar && !document.getElementById('logoutBtn')) {
      const logoutBtn = document.createElement('button');
      logoutBtn.id = 'logoutBtn';
      logoutBtn.className = 'btn btn-sm';
      logoutBtn.textContent = 'Déconnexion';
      logoutBtn.style.marginLeft = '1rem';
      logoutBtn.addEventListener('click', async () => {
        await cloudDataManager.logout();
        logoutBtn.remove();
      });
      navbar.appendChild(logoutBtn);
    }
  }
}

const authUI = new AuthUI();