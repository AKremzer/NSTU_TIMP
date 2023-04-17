const user_input = document.getElementById('your-code')
user_input.addEventListener('input', () => {
        user_input.style.height = 0;
        user_input.style.height = (user_input.scrollHeight + 1.5) + "px";
})

user_input.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') {
                let lines = user_input.value.split(/\r\n|\r|\n/);
                if (lines.length >= parseInt(user_input.rows)) {
                        e.preventDefault();
                }
        }
})
