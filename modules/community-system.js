/**
 * Abyssus - Community System
 * Real-time community posts and interactions
 */

class CommunitySystem {
  constructor() {
    this.posts = [];
    this.selectedDomain = null;
    this.initListeners();
  }

  initListeners() {
    if (window.eventsSystem) {
      window.eventsSystem.on('posts:updated', (posts) => {
        this.posts = posts;
        this.renderCommunityFeed();
      });
    }
  }

  async createPost(title, content, domain) {
    if (!cloudDataManager.currentUser) {
      alert('Connecte-toi d\'abord!');
      return;
    }

    const result = await cloudDataManager.createCommunityPost(
      cloudDataManager.currentUser.uid,
      cloudDataManager.playerProfile.username,
      { title, content, domain }
    );

    if (result.success) {
      console.log('✅ Post créé');
      this.showPostForm();
    }
  }

  async likePost(postId) {
    const result = await cloudDataManager.likePost(postId);
    if (result.success) {
      console.log('✅ Post aimé');
    }
  }

  showPostForm() {
    const modal = `
      <div class="post-form-overlay" id="postFormOverlay">
        <div class="post-form">
          <button class="auth-close" id="postFormClose">✕</button>
          <h2>Partager une Réflexion</h2>
          
          <form id="communityPostForm">
            <div class="form-group">
              <label>Domaine</label>
              <select id="postDomain" class="form-input" required>
                <option value="">Choisir un domaine...</option>
                ${GAME_CONFIG.DOMAINS.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
              </select>
            </div>
            
            <div class="form-group">
              <label>Titre</label>
              <input type="text" id="postTitle" class="form-input" placeholder="Titre de ta réflexion" required>
            </div>
            
            <div class="form-group">
              <label>Contenu</label>
              <textarea id="postContent" class="form-input" placeholder="Partage ta pensée..." style="min-height: 150px; resize: vertical;" required></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;">Publier</button>
          </form>
        </div>
      </div>
    `;

    const container = document.getElementById('modal-container');
    container.innerHTML = modal;
    container.classList.add('active');

    document.getElementById('postFormClose')?.addEventListener('click', () => {
      container.innerHTML = '';
      container.classList.remove('active');
    });

    document.getElementById('communityPostForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('postTitle').value;
      const content = document.getElementById('postContent').value;
      const domain = document.getElementById('postDomain').value;
      
      await this.createPost(title, content, domain);
      container.innerHTML = '';
      container.classList.remove('active');
    });
  }

  renderCommunityFeed() {
    const feed = document.getElementById('communityFeed');
    if (!feed) return;

    if (this.posts.length === 0) {
      feed.innerHTML = `<p class="empty-state">Sois le premier à partager une réflexion !</p>`;
      return;
    }

    feed.innerHTML = this.posts.map(post => `
      <div class="community-card">
        <div class="post-header">
          <strong>${post.username}</strong>
          <small>${new Date(post.createdAt).toLocaleDateString()}</small>
        </div>
        <div class="post-meta">
          <span class="tag">${post.domain}</span>
        </div>
        <h4>${post.title}</h4>
        <p class="post-text">${post.content}</p>
        <div class="post-footer">
          <button class="btn btn-sm" onclick="window.communitySystem.likePost('${post.id}')">👍 ${post.likes || 0}</button>
        </div>
      </div>
    `).join('');
  }

  async loadCommunityPosts(domain = null) {
    this.posts = await cloudDataManager.getCommunityPosts(domain);
    this.renderCommunityFeed();
  }
}

const communitySystem = new CommunitySystem();