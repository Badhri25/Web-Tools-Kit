(function(){
    const $ = (id) => document.getElementById(id);

    function escapeHtml(s){
        return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    // Minimal Markdown renderer (headings, bold/italic, code, lists, links, images, blockquotes)
    function renderMarkdown(md){
        // Code blocks ```
        md = md.replace(/```([\s\S]*?)```/g, (m, code)=>`<pre><code>${escapeHtml(code)}</code></pre>`);
        // Inline code `...`
        md = md.replace(/`([^`]+)`/g, (m, code)=>`<code>${escapeHtml(code)}</code>`);
        // Headings
        md = md.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
               .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
               .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
        // Bold and italic
        md = md.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
               .replace(/\*([^*]+)\*/g, '<em>$1</em>');
        // Links and images
        md = md.replace(/!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]+)")?\)/g, '<img alt="$1" src="$2" />');
        md = md.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        // Blockquotes
        md = md.replace(/^>\s?(.+)$/gm, '<blockquote>$1</blockquote>');
        // Unordered lists
        md = md.replace(/^(?:- |\* )(.*)$/gm, '<ul><li>$1</li></ul>');
        md = md.replace(/<\/ul>\n<ul>/g, '');
        // Paragraphs
        md = md.replace(/^(?!<h\d|<ul>|<pre>|<blockquote>)([^\n][^\n]*)$/gm, '<p>$1</p>');
        return md;
    }

    function update(){
        const md = $('md-input').value;
        $('md-preview').innerHTML = renderMarkdown(md);
    }

    document.addEventListener('input', (e)=>{ if(e.target.id==='md-input') update(); });
    document.addEventListener('click', (e)=>{
        const btn = e.target.closest('button'); if(!btn) return;
        const action = btn.getAttribute('data-action');
        if(action==='sample'){
            $('md-input').value = `# Markdown Preview\n\n- Live preview\n- GitHub-like styles\n\n## Code\n\n\`inline code\` and blocks:\n\n\n\n\`\`\`js\nconsole.log('hello');\n\`\`\`\n\n> Blockquote example\n\nVisit [GitHub](https://github.com).`;
            update();
        } else if(action==='copy-html'){
            navigator.clipboard.writeText($('md-preview').innerHTML);
        } else if(action==='download-html'){
            const blob = new Blob([$('md-preview').innerHTML], {type:'text/html;charset=utf-8'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href=url; a.download='preview.html'; a.click(); URL.revokeObjectURL(url);
        }
    });

    // initial
    update();
})();


