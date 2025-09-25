(function(){
    const $ = (id) => document.getElementById(id);
    const items = [];

    function addFiles(fileList){
        [...fileList].forEach(file => {
            if(!file.type.startsWith('image/')) return;
            const url = URL.createObjectURL(file);
            items.push({ file, url });
        });
        renderList();
    }

    function renderList(){
        const c = $('items');
        c.innerHTML = '';
        items.forEach((it, idx) => {
            const row = document.createElement('div');
            row.className = 'item';
            row.draggable = true;
            row.dataset.idx = idx;
            row.innerHTML = `
                <span class="handle">≡</span>
                <img class="thumb" src="${it.url}" alt="img-${idx}" />
                <span style="flex:1; color:var(--text-secondary)">${it.file.name}</span>
                <button class="btn" data-action="remove" data-idx="${idx}">Remove</button>
            `;
            c.appendChild(row);
        });
    }

    function enableDnD(){
        let draggedIdx = null;
        document.addEventListener('dragstart', (e)=>{
            const el = e.target.closest('.item'); if(!el) return;
            draggedIdx = +el.dataset.idx; e.dataTransfer.effectAllowed = 'move';
        });
        document.addEventListener('dragover', (e)=>{
            if(e.target.closest('.item')) e.preventDefault();
        });
        document.addEventListener('drop', (e)=>{
            const toEl = e.target.closest('.item'); if(!toEl) return;
            const toIdx = +toEl.dataset.idx; if(draggedIdx==null || toIdx===draggedIdx) return;
            const [moved] = items.splice(draggedIdx,1);
            items.splice(toIdx,0,moved);
            renderList();
        });
    }

    async function makePdf(){
        const { jsPDF } = window.jspdf;
        const size = $('page-size').value; // a4, letter, legal
        const orientation = $('orientation').value; // portrait/landscape
        const doc = new jsPDF({ format: size, orientation });

        // Optional text page
        const text = $('text-input').value.trim();
        if(text){
            const margin = 20;
            const maxWidth = doc.internal.pageSize.getWidth() - margin*2;
            const lines = doc.splitTextToSize(text, maxWidth);
            doc.setFont('helvetica','normal');
            doc.setFontSize(12);
            doc.text(lines, margin, margin);
            if(items.length) doc.addPage();
        }

        for(let i=0;i<items.length;i++){
            const img = await loadImage(items[i].url);
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const { w, h } = fitContain(img.width, img.height, pageWidth-20, pageHeight-20);
            const x = (pageWidth - w)/2;
            const y = (pageHeight - h)/2;
            doc.addImage(img, 'PNG', x, y, w, h, undefined, 'FAST');
            if(i < items.length-1) doc.addPage();
        }

        doc.save(`converted-${Date.now()}.pdf`);
    }

    function fitContain(sw, sh, dw, dh){
        const sr = sw/sh; const dr = dw/dh;
        if(sr > dr){ return { w: dw, h: dw/sr }; }
        return { w: dh*sr, h: dh };
    }

    function loadImage(src){
        return new Promise((resolve, reject)=>{
            const img = new Image();
            img.onload = ()=> resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    function clearAll(){
        items.splice(0, items.length);
        $('text-input').value = '';
        renderList();
    }

    // Events
    $('drop').addEventListener('click', ()=> $('file-input').click());
    $('file-input').addEventListener('change', (e)=> addFiles(e.target.files));
    $('drop').addEventListener('dragover', (e)=>{ e.preventDefault(); });
    $('drop').addEventListener('drop', (e)=>{ e.preventDefault(); addFiles(e.dataTransfer.files); });
    document.addEventListener('click', (e)=>{
        const btn = e.target.closest('button'); if(!btn) return;
        if(btn.id === 'make-pdf') makePdf();
        if(btn.id === 'clear') clearAll();
        if(btn.getAttribute('data-action') === 'remove'){
            const idx = +btn.getAttribute('data-idx');
            items.splice(idx,1); renderList();
        }
    });
    enableDnD();
})();


