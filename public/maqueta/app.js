  /* ============================================================
   * Facteur backoffice — prototype JS
   * ------------------------------------------------------------
   * Loaded once per page via <script defer src="app.js"></script>.
   * Each page only exercises the parts of this file that match its
   * markup; the rest is inert (queries return empty, listeners attach
   * to nothing). No per-page bundles needed.
   *
   * Functions exposed on `window` (called from inline onclick=…):
   *   openModal(id) / closeModal(id) → toggles .modal-overlay.active
   *   showToast(msg)                 → ephemeral mint-on-ink notice
   *   selectTab(name)                → activates a [data-tab="…"] tab programmatically
   *   parseUrls(value)               → splits a textarea on whitespace
   *   updateUrlCount(value)          → counter in the ingest modal
   *   checkDuplicate(value)          → demo dedupe against elpais.com
   *   submitIngestBatch()            → routes the toast (single vs batch)
   *   toggleKebab(trigger, ev?)      → opens a kebab menu, closes others
   *   confirmBulkAction(action)      → opens the bulk-confirm modal with a fresh bulk_id
   *   clearSelection()               → unchecks queue rows + hides the bulk bar
   *   toggleSidebar()                → collapses/expands the side nav, persisted in localStorage
   *
   * Wiring (event listeners, attached at parse time):
   *   - tab roving (role="tablist")            → article.html only
   *   - changelog filter chips ([data-cl-filter]) → article.html only
   *   - bulk selection checkboxes (#page-queue)  → index.html only
   *   - document-level click                    → closes any open kebab
   *
   * Page-to-page navigation is real <a href>, not JS — back/forward,
   * deep-linking and view-source all work as expected. On migration
   * to a framework, the globals below become methods of small page
   * components; the inline onclick handlers become events.
   * ============================================================ */

  // Sidebar collapse — toggles `.sidebar-collapsed` on <body>.
  // Persisted in localStorage so the choice survives navigation between pages.
  // Init runs synchronously (script is `defer`, so DOM is parsed) before paint
  // settles, minimising the expanded→collapsed flash on first paint.
  (function initSidebar() {
    try {
      if (localStorage.getItem('facteur-sidebar-collapsed') === '1') {
        document.body.classList.add('sidebar-collapsed');
        const btn = document.querySelector('.sidebar-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    } catch (_) {}
  })();
  function toggleSidebar() {
    const collapsed = document.body.classList.toggle('sidebar-collapsed');
    const btn = document.querySelector('.sidebar-toggle');
    if (btn) btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    try { localStorage.setItem('facteur-sidebar-collapsed', collapsed ? '1' : '0'); } catch (_) {}
  }

  // selectTab — programmatic tab activation (used by Overview "View all →" buttons)
  function selectTab(name) {
    const t = document.querySelector('[role="tab"][data-tab="' + name + '"]');
    if (t) t.click();
  }

  // Tab roving with aria-selected + panel switching
  document.querySelectorAll('[role="tablist"]').forEach(tl => {
    tl.querySelectorAll('[role="tab"]').forEach(t => {
      t.addEventListener('click', function() {
        tl.querySelectorAll('[role="tab"]').forEach(x => {
          x.classList.remove('active');
          x.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        const panelId = this.getAttribute('aria-controls');
        if (panelId) {
          const scope = this.closest('section') || document;
          scope.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
          const panel = document.getElementById(panelId);
          if (panel) panel.classList.add('active');
        }
      });
    });
  });

  // Changelog filter chips
  document.querySelectorAll('[data-cl-filter]').forEach(chip => {
    chip.addEventListener('click', function() {
      const filter = this.getAttribute('data-cl-filter');
      document.querySelectorAll('.changelog-entry').forEach(e => {
        const src = e.getAttribute('data-cl-source');
        e.style.display = (filter === 'all' || src === filter) ? '' : 'none';
      });
    });
  });

  function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('active');
  }
  function closeModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.remove('active');
    const dup = document.getElementById('dup-warning');
    if (dup) dup.style.display = 'none';
    const inp = document.getElementById('url-input');
    if (inp) inp.value = '';
    const c = document.getElementById('url-count');
    if (c) c.textContent = '0';
  }

  function parseUrls(value) {
    if (!value) return [];
    return value.split(/\s*[\r\n]+\s*/).map(s => s.trim()).filter(s => s.length > 0);
  }
  function updateUrlCount(value) {
    const c = document.getElementById('url-count');
    if (c) c.textContent = parseUrls(value).length;
  }
  function checkDuplicate(value) {
    const dup = document.getElementById('dup-warning');
    if (!dup) return;
    const urls = parseUrls(value);
    const dupCount = urls.filter(u => u.includes('elpais.com')).length;
    if (dupCount > 0) {
      const title = document.getElementById('dup-warning-title');
      if (title) title.textContent = dupCount + ' of these URL(s) already exist in the repository.';
      dup.style.display = 'flex';
    } else {
      dup.style.display = 'none';
    }
  }
  function toggleKebab(trigger, ev) {
    if (ev) ev.stopPropagation();
    const k = trigger.parentElement;
    const wasOpen = k.classList.contains('open');
    document.querySelectorAll('.kebab.open').forEach(el => el.classList.remove('open'));
    if (!wasOpen) k.classList.add('open');
  }
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.kebab')) {
      document.querySelectorAll('.kebab.open').forEach(el => el.classList.remove('open'));
    }
  });

  function submitIngestBatch() {
    const ta = document.getElementById('url-input');
    const urls = parseUrls(ta ? ta.value : '');
    closeModal('ingest-modal');
    if (urls.length === 0) {
      showToast('No URLs to ingest');
    } else if (urls.length === 1) {
      showToast('Article queued for ingestion');
    } else {
      showToast(urls.length + ' articles queued for ingestion · batch_id created');
    }
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2400);
  }

  // Click anywhere on overlay closes modal
  document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', (e) => {
      if (e.target === o) closeModal(o.id);
    });
  });

  // Filter chip toggling
  document.querySelectorAll('.filter-chip').forEach(c => {
    c.addEventListener('click', function() {
      const parent = this.parentElement;
      parent.querySelectorAll('.filter-chip').forEach(s => s.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // ===== Bulk selection in the queue =====
  function updateBulkBar() {
    const bar = document.getElementById('bulk-bar');
    if (!bar) return;
    const queueChecks = document.querySelectorAll('#page-queue tbody input[type="checkbox"]:checked');
    const count = queueChecks.length;
    document.getElementById('bulk-count').textContent = count;
    bar.classList.toggle('show', count > 0);
  }
  document.querySelectorAll('#page-queue tbody input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', updateBulkBar);
  });
  // Header checkbox = select-all toggle
  const headerCheck = document.querySelector('#page-queue thead input[type="checkbox"]');
  if (headerCheck) {
    headerCheck.addEventListener('change', function() {
      document.querySelectorAll('#page-queue tbody input[type="checkbox"]').forEach(cb => {
        cb.checked = this.checked;
      });
      updateBulkBar();
    });
  }
  function clearSelection() {
    document.querySelectorAll('#page-queue input[type="checkbox"]').forEach(cb => cb.checked = false);
    updateBulkBar();
  }
  function genBulkId() {
    return 'bulk_' + Math.random().toString(16).slice(2, 10);
  }
  function confirmBulkAction(action) {
    const count = document.querySelectorAll('#page-queue tbody input[type="checkbox"]:checked').length;
    if (count === 0) return;
    document.getElementById('bulk-modal-count').textContent = count;
    document.getElementById('bulk-modal-affected').textContent = count;
    document.getElementById('bulk-id-preview').textContent = genBulkId();
    const verb = action === 'accept' ? 'Bulk-accept all flags' : 'Bulk-defer';
    document.getElementById('bulk-modal-action-text').textContent = verb;
    document.getElementById('bulk-modal-confirm').onclick = function() {
      closeModal('bulk-modal');
      clearSelection();
      const id = document.getElementById('bulk-id-preview').textContent;
      showToast(verb + ' applied · ' + id);
    };
    openModal('bulk-modal');
  }
