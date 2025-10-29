const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

const statuses = ['draft','filmed','editing','thumbnail','scheduled','published'];
let currentEditPackage = null;
let allItems = [];
let currentView = 'table'; // 'table' or 'grid'

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButton(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
  const btn = $('#btnThemeToggle');
  if (btn) {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }
}

// View Management
function switchView(view) {
  currentView = view;
  if (view === 'table') {
    $('#tableView').style.display = 'block';
    $('#gridView').style.display = 'none';
    $('#viewTable').classList.add('active');
    $('#viewGrid').classList.remove('active');
  } else {
    $('#tableView').style.display = 'none';
    $('#gridView').style.display = 'grid';
    $('#viewTable').classList.remove('active');
    $('#viewGrid').classList.add('active');
  }
  filterItems(); // Re-render with current filters
}

function renderSummary(items) {
  const videos = items.filter(i=>i.type==='video');
  const shorts = items.filter(i=>i.type==='short');
  const published = items.filter(i=>i.status==='published');
  const editing = items.filter(i=>i.status==='editing');
  $('#countVideos').textContent = String(videos.length);
  $('#countShorts').textContent = String(shorts.length);
  $('#countPublished').textContent = String(published.length);
  $('#countEditing').textContent = String(editing.length);
}

function filterItems() {
  const searchTerm = $('#searchInput').value.toLowerCase();
  const typeFilter = $('#filterType').value;
  const statusFilter = $('#filterStatus').value;
  
  let filtered = allItems;
  
  // Filter by type
  if (typeFilter !== 'all') {
    filtered = filtered.filter(item => item.type === typeFilter);
  }
  
  // Filter by status
  if (statusFilter !== 'all') {
    filtered = filtered.filter(item => item.status === statusFilter);
  }
  
  // Filter by search term
  if (searchTerm) {
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(searchTerm) ||
      (item.topic && item.topic.toLowerCase().includes(searchTerm)) ||
      item.status.toLowerCase().includes(searchTerm)
    );
  }
  
  // Apply sorting
  sortItems(filtered);
  
  // Render based on current view
  if (currentView === 'table') {
    renderGrid(filtered);
  } else {
    renderCards(filtered);
  }
}

function sortItems(items) {
  const sortBy = $('#sortBy').value;
  
  // Don't sort if manual mode is selected
  if (sortBy === 'manual') {
    return;
  }
  
  const statusPriority = {
    'draft': 1, 'filmed': 2, 'editing': 3,
    'thumbnail': 4, 'scheduled': 5, 'published': 6
  };
  
  items.sort((a, b) => {
    let result = 0;
    
    switch(sortBy) {
      case 'status-asc':
        result = (statusPriority[a.status] || 999) - (statusPriority[b.status] || 999);
        if (result === 0) result = a.type === b.type ? 0 : (a.type === 'video' ? -1 : 1);
        if (result === 0) result = a.title.localeCompare(b.title);
        break;
        
      case 'status-desc':
        result = (statusPriority[b.status] || 999) - (statusPriority[a.status] || 999);
        if (result === 0) result = a.type === b.type ? 0 : (a.type === 'video' ? -1 : 1);
        if (result === 0) result = a.title.localeCompare(b.title);
        break;
        
      case 'title-asc':
        result = a.title.localeCompare(b.title);
        break;
        
      case 'title-desc':
        result = b.title.localeCompare(a.title);
        break;
        
      case 'created-desc':
        result = (b.createdDate || '').localeCompare(a.createdDate || '');
        if (result === 0) result = a.title.localeCompare(b.title);
        break;
        
      case 'created-asc':
        result = (a.createdDate || '').localeCompare(b.createdDate || '');
        if (result === 0) result = a.title.localeCompare(b.title);
        break;
        
      case 'publish-desc':
        result = (b.publishDate || '').localeCompare(a.publishDate || '');
        if (result === 0) result = a.title.localeCompare(b.title);
        break;
        
      case 'publish-asc':
        result = (a.publishDate || '').localeCompare(b.publishDate || '');
        if (result === 0) result = a.title.localeCompare(b.title);
        break;
        
      case 'score-desc':
        result = (b.score || 5) - (a.score || 5);
        if (result === 0) result = a.title.localeCompare(b.title);
        break;
        
      case 'score-asc':
        result = (a.score || 5) - (b.score || 5);
        if (result === 0) result = a.title.localeCompare(b.title);
        break;
    }
    
    return result;
  });
}

function socialIcons(social) {
  const icons = {
    youtube: '<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>',
    twitter: '<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'
  };
  const map = [
    ['youtube','social-youtube'],
    ['instagram','social-instagram'],
    ['tiktok','social-tiktok'],
    ['twitter','social-twitter'],
    ['facebook','social-facebook']
  ];
  return map.map(([k,cls]) => {
    const on = !!(social && social[k]);
    return `<div class="social-icon ${cls} ${on?'on':'off'}" data-key="${k}" title="${k}">${icons[k]}</div>`;
  }).join('');
}

function statusPill(status) {
  const cls = `status-${status}`;
  return `<span class="status-pill ${cls}">${status}</span>`;
}

function scoreColor(score) {
  // Red (1) -> Yellow (5) -> Green (10)
  if (score <= 5) {
    // Red to Yellow: 1-5
    const ratio = (score - 1) / 4; // 0 to 1
    const r = 239; // Keep red high
    const g = Math.round(68 + (234 - 68) * ratio); // 68 to 234
    const b = 68 - Math.round(68 * ratio); // 68 to 0
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Yellow to Green: 6-10
    const ratio = (score - 5) / 5; // 0 to 1
    const r = Math.round(234 - (234 - 16) * ratio); // 234 to 16
    const g = Math.round(234 - (234 - 185) * ratio); // 234 to 185
    const b = Math.round(0 + (129 - 0) * ratio); // 0 to 129
    return `rgb(${r}, ${g}, ${b})`;
  }
}

function scoreBadge(score) {
  const s = score || 5;
  const color = scoreColor(s);
  return `<div class="score-badge" style="background:${color};color:white;font-weight:700;padding:6px 10px;border-radius:8px;text-align:center;font-size:14px;">${s}</div>`;
}

function updateScoreDisplay(score) {
  const display = $('#scoreDisplay');
  display.textContent = score;
  display.style.background = scoreColor(score);
  display.style.color = 'white';
}

function typeBadge(type) {
  const cls = `type-${type}`;
  return `<span class="type-badge ${cls}">${type}</span>`;
}

function renderGrid(items) {
  const tbody = $('#gridBody');
  tbody.innerHTML = '';
  for (const it of items) {
    const tr = document.createElement('tr');
    const thumbHTML = it.thumb ? `<img class="thumb" src="${it.thumb}" />` : '<div class="thumb">No Image</div>';
    
    // Format dates
    const createdDisplay = it.createdDate ? formatDate(it.createdDate) : '<span style="color:#999;">—</span>';
    const publishDisplay = it.publishDate ? formatDate(it.publishDate) : '<span style="color:#999;">—</span>';
    
    tr.innerHTML = `
      <td>${typeBadge(it.type)}</td>
      <td>${thumbHTML}</td>
      <td><strong>${it.title}</strong></td>
      <td>${statusPill(it.status)}</td>
      <td>${scoreBadge(it.score)}</td>
      <td>${it.topic||''}</td>
      <td style="font-size:13px;color:#374151;">${createdDisplay}</td>
      <td style="font-size:13px;color:#374151;">${publishDisplay}</td>
      <td><div class="social-icons">${socialIcons(it.social)}</div></td>
      <td class="controls">
        <button class="btnEdit btn-primary">✏️ Edit</button>
        <button class="btnDelete btn-delete-content">🗑️ Delete</button>
      </td>
    `;
    
    // Wire Edit button
    tr.querySelector('.btnEdit').addEventListener('click', async ()=>{
      await openEditor(it);
    });
    
    // Wire Delete button
    tr.querySelector('.btnDelete').addEventListener('click', async ()=>{
      await deleteContent(it);
    });
    
    tr.querySelectorAll('.social-icon').forEach(el => {
      el.addEventListener('click', async () => {
        const key = el.getAttribute('data-key');
        const current = !!(it.social && it.social[key]);
        const next = !current;
        const social = Object.assign({}, it.social, { [key]: next });
        await window.ChannelAPI.updateSocial(it.path, it.type, social);
        refresh();
      });
    });
    // Status pill click to cycle
    tr.querySelector('.status-pill').addEventListener('click', async () => {
      const currentIdx = statuses.indexOf(it.status);
      const nextIdx = (currentIdx + 1) % statuses.length;
      const nextStatus = statuses[nextIdx];
      await window.ChannelAPI.updateStatus(it.path, it.type, nextStatus);
      refresh();
    });
    tbody.appendChild(tr);
  }
}

function renderCards(items) {
  const container = $('#gridView');
  container.innerHTML = '';
  
  for (const it of items) {
    const card = document.createElement('div');
    card.className = 'content-card';
    
    // Format dates
    const createdDisplay = it.createdDate ? formatDate(it.createdDate) : '—';
    const publishDisplay = it.publishDate ? formatDate(it.publishDate) : '—';
    
    const thumbHTML = it.thumb 
      ? `<img class="card-thumbnail" src="${it.thumb}" alt="${it.title}" />` 
      : `<div class="card-thumbnail">No Thumbnail</div>`;
    
    card.innerHTML = `
      ${thumbHTML}
      <div class="card-type-badge">${typeBadge(it.type)}</div>
      <div class="card-content">
        <div class="card-header">
          <div class="card-title">${it.title}</div>
          <div class="card-score">${scoreBadge(it.score)}</div>
        </div>
        <div class="card-meta">
          ${it.topic ? `<div class="card-meta-row">📁 ${it.topic}</div>` : ''}
          <div class="card-meta-row">📅 Created: ${createdDisplay}</div>
          <div class="card-meta-row">🚀 Publish: ${publishDisplay}</div>
        </div>
        <div class="card-status">${statusPill(it.status)}</div>
        <div class="card-social">${socialIcons(it.social)}</div>
        <div class="card-actions">
          <button class="btnEdit btn-edit">✏️ Edit</button>
          <button class="btnDelete btn-delete-content">🗑️</button>
        </div>
      </div>
    `;
    
    // Wire Edit button
    card.querySelector('.btnEdit').addEventListener('click', async () => {
      await openEditor(it);
    });
    
    // Wire Delete button
    card.querySelector('.btnDelete').addEventListener('click', async (e) => {
      e.stopPropagation();
      await deleteContent(it);
    });
    
    card.querySelectorAll('.social-icon').forEach(el => {
      el.addEventListener('click', async (e) => {
        e.stopPropagation();
        const key = el.getAttribute('data-key');
        const current = !!(it.social && it.social[key]);
        const next = !current;
        const social = Object.assign({}, it.social, { [key]: next });
        await window.ChannelAPI.updateSocial(it.path, it.type, social);
        refresh();
      });
    });
    
    card.querySelector('.status-pill').addEventListener('click', async (e) => {
      e.stopPropagation();
      const currentIdx = statuses.indexOf(it.status);
      const nextIdx = (currentIdx + 1) % statuses.length;
      const nextStatus = statuses[nextIdx];
      await window.ChannelAPI.updateStatus(it.path, it.type, nextStatus);
      refresh();
    });
    
    container.appendChild(card);
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr + 'T00:00:00');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

async function refresh() {
  allItems = await window.ChannelAPI.listPackages();
  renderSummary(allItems);
  filterItems();
}

async function deleteContent(pkg) {
  const typeLabel = pkg.type === 'video' ? 'video' : 'short';
  const confirmMessage = `⚠️ DELETE ${typeLabel.toUpperCase()}?

Title: "${pkg.title}"
Type: ${typeLabel}

This action will permanently delete:
• The complete content folder
• All files (script, description, tags, etc.)
• Thumbnail and raw files
• This action CANNOT be undone

Are you sure you want to delete this ${typeLabel}?`;

  if (!confirm(confirmMessage)) {
    return;
  }

  // Second confirmation for safety
  const doubleConfirm = confirm(`🚨 FINAL CONFIRMATION\n\nDo you REALLY want to delete "${pkg.title}"?\n\nThis is your last chance to cancel.`);
  
  if (!doubleConfirm) {
    return;
  }

  try {
    // Check if the API has a delete function
    if (window.ChannelAPI.deletePackage) {
      await window.ChannelAPI.deletePackage(pkg.path, pkg.type);
      alert(`✅ ${typeLabel === 'video' ? 'Video' : 'Short'} deleted successfully!\n\n"${pkg.title}" has been deleted.`);
      refresh();
    } else {
      // Fallback: show instructions for manual deletion
      const slug = pkg.path.split('\\').pop().split('/').pop();
      alert(`⚠️ Delete function not available in this version.\n\nTo delete this content manually:\n\n1. Open folder: content/${pkg.type}s/\n2. Delete folder: ${slug}\n3. Press the "Refresh" button to update`);
    }
  } catch (error) {
    alert(`❌ Error deleting:\n\n${error.message}\n\nPlease try again or delete the folder manually.`);
  }
}

async function openEditor(pkg) {
  currentEditPackage = pkg;
  const files = await window.ChannelAPI.getPackageFiles(pkg.path, pkg.type);
  
  // Set title as readable text, not slug
  $('#editorTitle').textContent = pkg.title;
  // Show slug as technical reference
  const slug = pkg.path.split('\\').pop().split('/').pop();
  $('#editorSlug').textContent = `Slug: ${slug}`;
  
  // Load thumbnail preview
  if (pkg.thumb) {
    $('#thumbnailPreview').src = pkg.thumb;
    $('#thumbnailPreview').style.display = 'block';
  } else {
    $('#thumbnailPreview').style.display = 'none';
  }
  
  // Load files
  $('#editTitle').value = files['title.txt'] || '';
  $('#editCreatedDate').value = pkg.createdDate || '';
  $('#editPublishDate').value = pkg.publishDate || '';
  $('#editScore').value = pkg.score || 5;
  updateScoreDisplay(pkg.score || 5);
  if (pkg.type === 'video') {
    $('#editBullets').value = files['bullets.md'] || '';
    $('#editDescription').value = files['description.txt'] || '';
    $('#editTags').value = files['tags.txt'] || '';
    $('#editChapters').value = files['chapters.txt'] || '';
    $('#editThumbnailBrief').value = files['thumbnail_brief.md'] || '';
    $('#editCommunityPost').value = files['community_post.txt'] || '';
    $('#editShortsIdeas').value = files['shorts_ideas.md'] || '';
    loadChecklist(files['checklist.md'] || '');
    // Show video-only blocks
    $('#lblBullets').textContent = 'Script / Bullets';
    $('#lblTags').textContent = 'Tags';
    $('#chaptersBlock').style.display = '';
    $('#communityBlock').style.display = '';
    $('#videoExtrasBlock').style.display = '';
  } else {
    $('#editBullets').value = files['script.md'] || '';
    $('#editDescription').value = files['caption.txt'] || '';
    $('#editTags').value = files['hashtags.txt'] || '';
    $('#editThumbnailBrief').value = files['thumbnail_brief.md'] || '';
    // Hide video-only blocks
    $('#lblBullets').textContent = 'Script';
    $('#lblTags').textContent = 'Hashtags';
    $('#chaptersBlock').style.display = 'none';
    $('#communityBlock').style.display = 'none';
    $('#videoExtrasBlock').style.display = 'none';
  }
  
  // Switch to editor tab
  $$('.tab').forEach(t => t.classList.remove('active'));
  $$('.tab-panel').forEach(p => p.classList.remove('active'));
  $('[data-tab="editor"]').classList.add('active');
  $('[data-tab="editor"]').style.display = '';
  $('#tab-editor').classList.add('active');
}

function wireTabs() {
  $$('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.tab').forEach(t => t.classList.remove('active'));
      $$('.tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      $('#tab-' + tab.dataset.tab).classList.add('active');
    });
  });
  $('#createType').addEventListener('change', () => {
    const isVideo = $('#createType').value === 'video';
    $$('.video-only').forEach(el => el.style.display = isVideo ? '' : 'none');
    if (!isVideo) $('#createTopic').value = 'Short: Reinvention/Travel';
  });
}

function wireHeader() {
  $('#btnThemeToggle').addEventListener('click', toggleTheme);
  
  $('#btnHelp').addEventListener('click', () => {
    const helpText = `⌨️ KEYBOARD SHORTCUTS

📊 Dashboard:
• Ctrl/Cmd + R → Refresh content
• Ctrl/Cmd + F → Focus search
• Ctrl/Cmd + D → Go to Dashboard tab
• Ctrl/Cmd + T → Toggle Dark/Light theme

✏️ Navigation:
• Ctrl/Cmd + N → Create new content
• Escape → Close editor

🎯 Dashboard Actions:
• Click Status Pills → Cycle through statuses
• Click Social Icons → Toggle platforms
• Click Type Badges → Visual type identification
• Toggle between Table and Grid views

💡 TIPS:
• Search filters by title, topic, or status
• Use dropdowns to filter by type or status
• Thumbnails update automatically after upload
• Checklist items are markdown compatible
• Dark mode is preserved between sessions`;
    
    alert(helpText);
  });
  
  $('#btnCreateChannel').addEventListener('click', async () => {
    const result = await window.ChannelAPI.createChannel();
    if (result) {
      alert(`Channel created successfully at:\n${result}\n\nRun Youtubator.bat (or .sh/.command) in that folder to start managing content.`);
    }
  });
  
  $('#btnRefresh').addEventListener('click', refresh);
  $('#btnBuildDash').addEventListener('click', async ()=>{ await window.ChannelAPI.buildDashboard(); alert('Dashboard rebuilt'); });
  $('#btnOpenDash').addEventListener('click', async ()=>{ await window.ChannelAPI.openDashboard(); });
  
  // View toggle buttons
  $('#viewTable').addEventListener('click', () => switchView('table'));
  $('#viewGrid').addEventListener('click', () => switchView('grid'));
}

function wireEditor() {
  // Score slider
  $('#editScore').addEventListener('input', (e) => {
    updateScoreDisplay(parseInt(e.target.value));
  });
  
  $('#btnBackToDash').addEventListener('click', () => {
    $$('.tab').forEach(t => t.classList.remove('active'));
    $$('.tab-panel').forEach(p => p.classList.remove('active'));
    $('[data-tab="dashboard"]').classList.add('active');
    $('#tab-dashboard').classList.add('active');
    $('[data-tab="editor"]').style.display = 'none';
  });
  $('#btnOpenFolder').addEventListener('click', async () => {
    if (currentEditPackage) await window.ChannelAPI.openPackage(currentEditPackage.path);
  });
  $('#btnChangeThumbnail').addEventListener('click', () => {
    $('#thumbnailInput').click();
  });
  $('#btnDeleteThumbnail').addEventListener('click', async () => {
    if (!currentEditPackage) return;
    
    if (!confirm('Are you sure you want to delete the thumbnail?')) return;
    
    const deleted = await window.ChannelAPI.deleteThumbnail(currentEditPackage.path);
    if (deleted) {
      $('#thumbnailPreview').src = '';
      $('#thumbnailPreview').style.display = 'none';
      alert('Thumbnail deleted successfully!');
      refresh();
    } else {
      alert('No thumbnail found to delete.');
    }
  });
  $('#thumbnailInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageDataUrl = event.target.result;
      $('#thumbnailPreview').src = imageDataUrl;
      $('#thumbnailPreview').style.display = 'block';
      
      // Save immediately
      if (currentEditPackage) {
        await window.ChannelAPI.saveThumbnail(currentEditPackage.path, imageDataUrl);
        alert('Thumbnail saved!');
        refresh();
      }
    };
    reader.readAsDataURL(file);
  });
  $('#btnSaveAll').addEventListener('click', async () => {
    if (!currentEditPackage) return;
    const pkg = currentEditPackage;
    const type = pkg.type;
    
    // Save title
    await window.ChannelAPI.savePackageFile(pkg.path, 'title.txt', $('#editTitle').value);
    
    // Save dates and score to metadata
    const createdDate = $('#editCreatedDate').value;
    const publishDate = $('#editPublishDate').value;
    const score = parseInt($('#editScore').value);
    
    if (createdDate || publishDate) {
      await window.ChannelAPI.updateMetaDates(pkg.path, createdDate, publishDate);
    }
    
    if (score) {
      await window.ChannelAPI.updateScore(pkg.path, score);
    }
    
    if (type === 'video') {
      await window.ChannelAPI.savePackageFile(pkg.path, 'bullets.md', $('#editBullets').value);
      await window.ChannelAPI.savePackageFile(pkg.path, 'description.txt', $('#editDescription').value);
      await window.ChannelAPI.savePackageFile(pkg.path, 'tags.txt', $('#editTags').value);
      await window.ChannelAPI.savePackageFile(pkg.path, 'chapters.txt', $('#editChapters').value);
      await window.ChannelAPI.savePackageFile(pkg.path, 'thumbnail_brief.md', $('#editThumbnailBrief').value);
      await window.ChannelAPI.savePackageFile(pkg.path, 'community_post.txt', $('#editCommunityPost').value);
      await window.ChannelAPI.savePackageFile(pkg.path, 'shorts_ideas.md', $('#editShortsIdeas').value);
      await window.ChannelAPI.savePackageFile(pkg.path, 'checklist.md', getChecklistText());
    } else {
      await window.ChannelAPI.savePackageFile(pkg.path, 'script.md', $('#editBullets').value);
      await window.ChannelAPI.savePackageFile(pkg.path, 'caption.txt', $('#editDescription').value);
      await window.ChannelAPI.savePackageFile(pkg.path, 'hashtags.txt', $('#editTags').value);
      await window.ChannelAPI.savePackageFile(pkg.path, 'thumbnail_brief.md', $('#editThumbnailBrief').value);
    }
    
    const fileCount = type === 'video' ? 9 : 4;
    alert(`✅ All changes saved!\n\n${fileCount} files updated successfully.\n\nTitle synced to meta.json`);
    refresh();
  });
}

function wireCreate() {
  $('#btnCreate').addEventListener('click', async () => {
    const type = $('#createType').value;
    const title = $('#createTitle').value.trim();
    
    if (!title) {
      alert('⚠️ Title is required');
      $('#createTitle').focus();
      return;
    }
    
    if (title.length < 3) {
      alert('⚠️ Title must be at least 3 characters');
      $('#createTitle').focus();
      return;
    }
    
    const primaryKeyword = $('#createPK').value.trim();
    const topic = $('#createTopic').value.trim();
    const timezone = $('#createTz').value.trim() || 'ET';
    
    try {
      await window.ChannelAPI.createPackage({ type, title, primaryKeyword, topic, timezone });
      alert(`✅ ${type === 'video' ? 'Video' : 'Short'} created successfully!\n\nTitle: ${title}`);
      // Clear form
      $('#createTitle').value = '';
      $('#createPK').value = '';
      refresh();
    } catch (error) {
      alert(`❌ Error creating package: ${error.message}`);
    }
  });
}

function loadChecklist(checklistText) {
  const container = $('#checklistContainer');
  container.innerHTML = '';
  
  // Parse markdown checklist format: - [ ] or - [x]
  const lines = checklistText.split('\n').filter(l => l.trim());
  
  for (const line of lines) {
    const match = line.match(/^-\s*\[([ xX])\]\s*(.+)$/);
    if (match) {
      const checked = match[1].toLowerCase() === 'x';
      const text = match[2].trim();
      addChecklistItem(text, checked);
    }
  }
  
  // Add one empty item if checklist is empty
  if (container.children.length === 0) {
    addChecklistItem('', false);
  }
}

function addChecklistItem(text = '', checked = false) {
  const container = $('#checklistContainer');
  const item = document.createElement('div');
  item.className = 'checklist-item' + (checked ? ' completed' : '');
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = checked;
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      item.classList.add('completed');
    } else {
      item.classList.remove('completed');
    }
  });
  
  const input = document.createElement('input');
  input.type = 'text';
  input.value = text;
  input.placeholder = 'Enter task...';
  
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn-delete-item';
  deleteBtn.textContent = '×';
  deleteBtn.addEventListener('click', () => {
    item.remove();
    // Add empty item if no items left
    if (container.children.length === 0) {
      addChecklistItem('', false);
    }
  });
  
  item.appendChild(checkbox);
  item.appendChild(input);
  item.appendChild(deleteBtn);
  container.appendChild(item);
}

function getChecklistText() {
  const items = $$('.checklist-item');
  const lines = [];
  
  for (const item of items) {
    const checkbox = item.querySelector('input[type="checkbox"]');
    const input = item.querySelector('input[type="text"]');
    const text = input.value.trim();
    
    if (text) {
      const mark = checkbox.checked ? 'x' : ' ';
      lines.push(`- [${mark}] ${text}`);
    }
  }
  
  return lines.join('\n') + '\n';
}

(function init(){
  initTheme(); // Initialize theme first
  wireTabs();
  wireHeader();
  wireEditor();
  wireCreate();
  
  // Wire add checklist item button
  $('#btnAddChecklistItem').addEventListener('click', () => {
    addChecklistItem('', false);
  });
  
  // Wire filters
  $('#searchInput').addEventListener('input', filterItems);
  $('#filterType').addEventListener('change', filterItems);
  $('#filterStatus').addEventListener('change', filterItems);
  $('#sortBy').addEventListener('change', filterItems);
  
  // Fix for Electron paste bug - ensure inputs remain editable
  document.addEventListener('paste', (e) => {
    const target = e.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      // Force re-enable after paste
      setTimeout(() => {
        target.disabled = false;
        target.focus();
      }, 0);
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + R: Refresh
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault();
      refresh();
    }
    // Ctrl/Cmd + F: Focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      $('#searchInput').focus();
    }
    // Ctrl/Cmd + N: Go to Create tab
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      $('[data-tab="create"]').click();
      setTimeout(() => $('#createTitle').focus(), 100);
    }
    // Ctrl/Cmd + D: Go to Dashboard
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      $('[data-tab="dashboard"]').click();
    }
    // Ctrl/Cmd + T: Toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
      e.preventDefault();
      toggleTheme();
    }
    // Escape: Close editor if open
    if (e.key === 'Escape' && $('#tab-editor').classList.contains('active')) {
      $('#btnBackToDash').click();
    }
  });
  
  refresh();
})();
