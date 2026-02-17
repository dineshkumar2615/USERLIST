const http = require('http');

http.get('http://localhost:5000/api/users', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            console.log('Response type:', typeof parsed);
            if (Array.isArray(parsed)) {
                console.log('Response is an ARRAY - Length:', parsed.length);
            } else {
                console.log('Response is an OBJECT - Keys:', Object.keys(parsed));
                if (parsed.users) console.log('Users array length:', parsed.users.length);
            }
        } catch (e) {
            console.log('Error parsing response:', e.message);
            console.log('Raw data preview:', data.substring(0, 100));
        }
    });
}).on('error', (err) => {
    console.log('Error:', err.message);
});
