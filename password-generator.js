(function(){
    const $ = (id) => document.getElementById(id);

    function randomInt(max){ return crypto.getRandomValues(new Uint32Array(1))[0] % max; }

    function sample(chars){ return chars.charAt(randomInt(chars.length)); }

    function generatePassword(opts){
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums  = '0123456789';
        const syms  = '!@#$%^&*()-_=+[]{};:,.<>/?';
        let sets = [];
        if(opts.lower) sets.push(lower);
        if(opts.upper) sets.push(upper);
        if(opts.numbers) sets.push(nums);
        if(opts.symbols) sets.push(syms);
        if(sets.length === 0) sets = [lower];

        let allowed = sets.join('');
        if(opts.ambiguous){ allowed = allowed.replace(/[O0Il1]/g, ''); }

        let result = '';
        // Ensure at least one from each chosen set
        for(const set of sets){ result += sample(set); }
        for(let i = result.length; i < opts.length; i++){
            const ch = sample(allowed);
            if(opts['avoid-repeats'] && result.endsWith(ch)) { i--; continue; }
            result += ch;
        }
        // Shuffle using Fisher-Yates
        const arr = result.split('');
        for(let i=arr.length-1;i>0;i--){ const j = randomInt(i+1); [arr[i], arr[j]] = [arr[j], arr[i]]; }
        result = arr.join('');

        if(opts.pronounceable){
            // Light vowel/consonant alternation tweak
            const vowels = 'aeiou';
            let tweaked = result.split('').map((ch,i)=>{
                if(/[a-z]/.test(ch) && i%2===0 && !vowels.includes(ch)) return vowels.charAt(randomInt(vowels.length));
                return ch;
            }).join('');
            result = tweaked;
        }

        return result.slice(0, opts.length);
    }

    function strengthScore(pwd){
        let s = 0;
        if(pwd.length >= 12) s+=2; else if(pwd.length >= 8) s+=1;
        if(/[a-z]/.test(pwd)) s+=1;
        if(/[A-Z]/.test(pwd)) s+=1;
        if(/[0-9]/.test(pwd)) s+=1;
        if(/[^a-zA-Z0-9]/.test(pwd)) s+=1;
        return s; // 0-6
    }

    function showStrength(pwd){
        const s = strengthScore(pwd);
        const labels = ['Very Weak','Weak','Fair','Good','Strong','Very Strong','Excellent'];
        $('strength').textContent = `Strength: ${labels[s] || '-'}`;
    }

    function currentOptions(){
        return {
            length: +$('length').value,
            lower: $('lower').checked,
            upper: $('upper').checked,
            numbers: $('numbers').checked,
            symbols: $('symbols').checked,
            ambiguous: $('ambiguous').checked,
            pronounceable: $('pronounceable').checked,
            'avoid-repeats': $('avoid-repeats').checked
        };
    }

    function generate(){
        const pwd = generatePassword(currentOptions());
        $('password').value = pwd;
        showStrength(pwd);
    }

    document.addEventListener('click', (e)=>{
        const btn = e.target.closest('button');
        if(!btn) return;
        const action = btn.getAttribute('data-action');
        if(action === 'generate') generate();
        if(action === 'copy') navigator.clipboard.writeText($('password').value);
    });

    $('length').addEventListener('input', ()=>{
        $('length-val').textContent = $('length').value;
    });
})();


