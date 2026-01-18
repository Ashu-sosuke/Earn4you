const verifyAdminAPI = async () => {
    try {
        // 1. Login as Admin
        console.log('Logging in as Admin...');
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@earn4you.com',
                password: 'admin123'
            })
        });

        const loginData = await loginRes.json();
        if (!loginData.success) {
            console.error('Login failed:', loginData);
            return;
        }

        const token = loginData.token;
        console.log('Login successful. Token obtained.');

        // 2. Fetch Users
        console.log('Fetching users...');
        const usersRes = await fetch('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const usersData = await usersRes.json();
        console.log('Users API Full Response:', JSON.stringify(usersData, null, 2));

    } catch (error) {
        console.error('API Verification Failed:', error);
    }
};

verifyAdminAPI();
