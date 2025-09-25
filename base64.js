(function(){
    const $ = (id) => document.getElementById(id);
    const enc = new TextEncoder();
    const dec = new TextDecoder();

    function encodeTextToBase64(text){
        const bytes = enc.encode(text);
        let binary = '';
        for(let i=0;i<bytes.length;i++){ binary += String.fromCharCode(bytes[i]); }
        return btoa(binary);
    }

    function decodeBase64ToText(b64){
        try{
            const binary = atob(b64);
            const bytes = new Uint8Array(binary.length);
            for(let i=0;i<binary.length;i++){ bytes[i] = binary.charCodeAt(i); }
            return dec.decode(bytes);
        }catch(e){
            return null;
        }
    }

    function convert(action){
        const input = $('b64-input').value.trim();
        let out = '';
        if(action === 'encode'){
            out = encodeTextToBase64(input);
        } else if(action === 'decode'){
            const text = decodeBase64ToText(input);
            out = text !== null ? text : 'Invalid Base64 input';
        }
        $('b64-output').value = out;
    }

    async function encodeFile(file){
        const arrayBuf = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuf);
        let binary = '';
        for(let i=0;i<bytes.length;i++){ binary += String.fromCharCode(bytes[i]); }
        const b64 = btoa(binary);
        $('b64-output').value = b64;
        $('hint').textContent = `Encoded ${file.name} (${(file.size/1024).toFixed(1)} KB)`;
    }

    function downloadOutput(){
        const text = $('b64-output').value;
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'output.txt'; a.click();
        URL.revokeObjectURL(url);
    }

    function copy(text){ navigator.clipboard.writeText(text); }

    document.addEventListener('click', async (e)=>{
        const btn = e.target.closest('button');
        if(!btn) return;
        const action = btn.getAttribute('data-action');
        if(!action) return;
        if(action === 'encode' || action === 'decode') convert(action);
        else if(action === 'copy') copy($('b64-input').value);
        else if(action === 'download') downloadOutput();
        else if(action === 'swap') { const a = $('b64-input').value; $('b64-input').value = $('b64-output').value; $('b64-output').value = a; }
        else if(action === 'clear') { $('b64-input').value=''; $('b64-output').value=''; }
        else if(action === 'copy-output') copy($('b64-output').value);
    });

    $('file-input').addEventListener('change', (e)=>{
        const f = e.target.files && e.target.files[0];
        if(f) encodeFile(f);
    });
})();


