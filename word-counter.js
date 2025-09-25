(function(){
    const $ = (id) => document.getElementById(id);
    function update(){
        const t = $('wc-input').value;
        const chars = t.length;
        const charsNoSpace = t.replace(/\s/g,'').length;
        const words = (t.trim().match(/[^\s]+/g) || []).length;
        const sentences = (t.match(/[.!?]+(\s|$)/g) || []).length;
        const lines = t.split(/\n/).length;
        const readSeconds = Math.max(1, Math.round((words/200)*60));
        $('chars').textContent = String(chars);
        $('chars-nospace').textContent = String(charsNoSpace);
        $('words').textContent = String(words);
        $('sentences').textContent = String(sentences);
        $('lines').textContent = String(lines);
        $('read').textContent = readSeconds < 60 ? `${readSeconds}s` : `${Math.round(readSeconds/60)}m`;
    }
    document.addEventListener('input', (e)=>{ if(e.target.id==='wc-input') update(); });
})();


