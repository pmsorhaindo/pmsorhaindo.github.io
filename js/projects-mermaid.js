// Renders Mermaid diagrams client-side on /projects pages.
// Mermaid is pinned to an exact version from the jsDelivr CDN so diagrams
// keep rendering the same way even if a newer major version changes syntax.
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@12.3.0/dist/mermaid.esm.min.mjs';

function liftMermaidBlocks() {
  // Jekyll/kramdown renders ```mermaid fenced blocks as
  // <pre><code class="language-mermaid">...</code></pre>. Mermaid expects
  // its source in a plain <div class="mermaid">, so swap the markup in,
  // reading the diagram source from textContent (already HTML-unescaped
  // by the browser) rather than re-parsing innerHTML.
  const blocks = document.querySelectorAll('pre > code.language-mermaid');
  blocks.forEach((code) => {
    const pre = code.parentElement;
    const div = document.createElement('div');
    div.className = 'mermaid';
    div.textContent = code.textContent;
    pre.replaceWith(div);
  });
  return document.querySelectorAll('div.mermaid').length;
}

async function renderMermaid() {
  const count = liftMermaidBlocks();
  if (count === 0) return;

  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'strict',
    flowchart: { useMaxWidth: true, htmlLabels: true },
    stateDiagram: { useMaxWidth: true },
  });

  try {
    await mermaid.run({ querySelector: '.mermaid' });
  } catch (err) {
    // Leave a visible, honest failure state instead of a blank box.
    document.querySelectorAll('div.mermaid').forEach((el) => {
      if (!el.querySelector('svg')) {
        el.classList.add('mermaid-error');
        el.setAttribute('data-error', 'Diagram failed to render in this browser.');
      }
    });
    // eslint-disable-next-line no-console
    console.error('Mermaid render failed:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderMermaid);
} else {
  renderMermaid();
}
