const textarea = document.getElementById('your-code')
textarea.addEventListener('input', () => {
    textarea.style.height = 0;
    textarea.style.height = (textarea.scrollHeight - 4) + "px";
})