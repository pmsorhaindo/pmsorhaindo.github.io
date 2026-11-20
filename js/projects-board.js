// Renders a filterable board table from the embedded JSON data for each
// .board widget on /projects/* pages. No build step, no server: everything
// here runs against data already inlined into the page by Jekyll.
(function () {
  function typeBadgeClass(type) {
    return type === 'PullRequest' ? 'badge-pr' : 'badge-issue';
  }

  function statusBadgeClass(status) {
    const key = (status || '').toLowerCase().replace(/\s+/g, '-');
    return 'badge-status-' + key;
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function renderRow(item) {
    const tr = el('tr');
    tr.dataset.status = item.status || '';
    tr.dataset.type = item.type || '';
    tr.dataset.priority = item.priority || '';
    tr.dataset.search = (
      '#' + item.number + ' ' + (item.title || '') + ' ' + (item.labels || []).join(' ')
    ).toLowerCase();

    const numTd = el('td');
    const numLink = el('a', null, '#' + item.number);
    numLink.href = item.url;
    numLink.target = '_blank';
    numLink.rel = 'noopener noreferrer';
    numTd.appendChild(numLink);
    tr.appendChild(numTd);

    const typeTd = el('td');
    typeTd.appendChild(el('span', 'badge ' + typeBadgeClass(item.type), item.type === 'PullRequest' ? 'PR' : 'Issue'));
    tr.appendChild(typeTd);

    const titleTd = el('td', 'board-title');
    const titleLink = el('a', null, item.title);
    titleLink.href = item.url;
    titleLink.target = '_blank';
    titleLink.rel = 'noopener noreferrer';
    titleTd.appendChild(titleLink);
    if (item.linked && item.linked.length) {
      const linked = el('small', 'board-linked');
      linked.append('linked: ');
      item.linked.forEach((url, i) => {
        if (i > 0) linked.append(', ');
        const a = el('a', null, url.replace(/^https:\/\/github\.com\//, ''));
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        linked.appendChild(a);
      });
      titleTd.appendChild(document.createElement('br'));
      titleTd.appendChild(linked);
    }
    tr.appendChild(titleTd);

    const statusTd = el('td');
    statusTd.appendChild(el('span', 'badge ' + statusBadgeClass(item.status), item.status || '\u2014'));
    tr.appendChild(statusTd);

    const prioTd = el('td', null, item.priority || '\u2014');
    tr.appendChild(prioTd);

    const labelsTd = el('td', 'board-labels', (item.labels || []).join(', ') || '\u2014');
    tr.appendChild(labelsTd);

    return tr;
  }

  function populateFilterOptions(select, values) {
    const unique = Array.from(new Set(values.filter(Boolean))).sort();
    unique.forEach((value) => {
      const opt = el('option', null, value);
      opt.value = value;
      select.appendChild(opt);
    });
  }

  function applyFilters(widget, rows) {
    const search = widget.querySelector('.board-search').value.trim().toLowerCase();
    const filters = {};
    widget.querySelectorAll('.board-filter').forEach((select) => {
      if (select.value) filters[select.dataset.field] = select.value;
    });

    let visible = 0;
    rows.forEach((row) => {
      const matchesSearch = !search || row.dataset.search.includes(search);
      const matchesFilters = Object.keys(filters).every((field) => row.dataset[field] === filters[field]);
      const show = matchesSearch && matchesFilters;
      row.style.display = show ? '' : 'none';
      if (show) visible += 1;
    });

    const countEl = widget.querySelector('.board-count');
    if (countEl) {
      countEl.textContent = visible + ' of ' + rows.length + ' items shown';
    }
  }

  function initBoard(widget) {
    const dataScript = widget.querySelector('script.board-data');
    if (!dataScript) return;

    let items = [];
    try {
      items = JSON.parse(dataScript.textContent);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Could not parse board data for', widget.dataset.boardId, err);
      return;
    }

    const tbody = widget.querySelector('tbody');
    tbody.innerHTML = '';
    if (!items.length) {
      tbody.appendChild(el('tr', 'board-empty'));
      return;
    }

    const rows = items.map(renderRow);
    rows.forEach((row) => tbody.appendChild(row));

    populateFilterOptions(widget.querySelector('[data-field="status"]'), items.map((i) => i.status));
    populateFilterOptions(widget.querySelector('[data-field="type"]'), items.map((i) => i.type));
    populateFilterOptions(widget.querySelector('[data-field="priority"]'), items.map((i) => i.priority));

    widget.querySelector('.board-search').addEventListener('input', () => applyFilters(widget, rows));
    widget.querySelectorAll('.board-filter').forEach((select) => {
      select.addEventListener('change', () => applyFilters(widget, rows));
    });
    widget.querySelector('.board-reset').addEventListener('click', () => {
      widget.querySelector('.board-search').value = '';
      widget.querySelectorAll('.board-filter').forEach((select) => { select.value = ''; });
      applyFilters(widget, rows);
    });

    applyFilters(widget, rows);
  }

  function init() {
    document.querySelectorAll('.board').forEach(initBoard);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
