(function(){
    const input = () => document.getElementById('input');
    const output = () => document.getElementById('output');

    const toTitle = (str) => str.toLowerCase().replace(/\b([a-z])(\w*)/g, (m, a, b) => a.toUpperCase() + b);
    const toSentence = (str) => str.toLowerCase().replace(/(^\s*[a-z])|([\.!?]\s*[a-z])/g, (m) => m.toUpperCase());
    const toKebab = (str) => str.trim().replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[^a-zA-Z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$|_/g, '').toLowerCase();
    const toSnake = (str) => str.trim().replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[^a-zA-Z0-9]+/g, '_').replace(/_+/g, '_').replace(/^_|_$|-/g, '').toLowerCase();
    const toCamel = (str) => {
        const s = toKebab(str).split('-');
        return s[0] + s.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    };
    const toPascal = (str) => toCamel(str).replace(/^./, c => c.toUpperCase());

    function setOut(val){ output().value = val; }

    function convert(kind){
        const val = input().value;
        let out = val;
        switch(kind){
            case 'upper': out = val.toUpperCase(); break;
            case 'lower': out = val.toLowerCase(); break;
            case 'title': out = toTitle(val); break;
            case 'sentence': out = toSentence(val); break;
            case 'kebab': out = toKebab(val); break;
            case 'snake': out = toSnake(val); break;
            case 'camel': out = toCamel(val); break;
            case 'pascal': out = toPascal(val); break;
        }
        setOut(out);
    }

    function copy(text){
        navigator.clipboard.writeText(text).then(()=>{
            const helper = document.getElementById('helper');
            if(helper){ helper.textContent = 'Copied to clipboard!'; setTimeout(()=> helper.textContent='Tip: Select text and press a case button. Copy copies the output.', 1200); }
        });
    }

    document.addEventListener('click', (e)=>{
        const b = e.target.closest('button');
        if(!b) return;
        const action = b.getAttribute('data-action');
        if(!action) return;
        if(['upper','lower','title','sentence','kebab','snake','camel','pascal'].includes(action)){
            convert(action);
        } else if(action === 'copy'){
            copy(output().value);
        } else if(action === 'clear'){
            input().value = '';
            output().value = '';
        } else if(action === 'swap'){
            const a = input().value; input().value = output().value; output().value = a;
        } else if(action === 'copy-output'){
            copy(output().value);
        } else if(action === 'select-all'){
            output().focus(); output().select();
        }
    });
})();


