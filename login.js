document.addEventListener('DOMContentLoaded', function () {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    const authToken = getCookie('authToken');
    const decryptedToken = authToken ? CryptoJS.AES.decrypt(authToken, 'secret-key').toString(CryptoJS.enc.Utf8) : null;
    const myFilesSection = document.getElementById('my-files');
    const loginButton = document.getElementById('login-button');

    if (decryptedToken === 'nimleecher7') {
        myFilesSection.style.display = 'block';
        loginButton.style.display = 'none';
    } else {
        myFilesSection.style.display = 'none';
        loginButton.style.display = 'inline-block';
    }
});