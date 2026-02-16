class User {
    constructor(id = null, name = '', email = '') {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    static validate(name, email) {
        const errors = {};
        if (!name || name.trim() === '') errors.name = 'Name is required';
        if (!email || email.trim() === '') {
            errors.email = 'Email is required';
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            errors.email = 'Please provide a valid email';
        }
        return { isValid: Object.keys(errors).length === 0, errors };
    }

    static fromAPI(data) {
        return new User(data._id, data.name, data.email);
    }
}
export default User;
