const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users with search, filter, and pagination
router.get('/', async (req, res) => {
    try {
        const { search, role, status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = -1 } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (role && role !== 'All') {
            if (role === 'User') {
                query.role = { $in: ['User', null] };
            } else {
                query.role = role;
            }
        }

        if (status && status !== 'All') {
            if (status === 'Active') {
                query.status = { $in: ['Active', null] };
            } else {
                query.status = status;
            }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await User.countDocuments(query);

        // Global Stats for Dashboard (ignoring filters)
        const [globalTotal, globalActive, globalAdmins] = await Promise.all([
            User.countDocuments({}),
            User.countDocuments({ status: { $in: ['Active', null] } }),
            User.countDocuments({ role: 'Admin' })
        ]);

        // Define dynamic sorting
        const sortOptions = {};
        sortOptions[sortBy] = parseInt(sortOrder);

        const users = await User.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            totalUsers: total,
            sortBy,
            sortOrder: parseInt(sortOrder),
            globalStats: {
                total: globalTotal,
                active: globalActive,
                admins: globalAdmins
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST seed users
router.post('/seed', async (req, res) => {
    try {
        const seedUsers = [
            { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', phone: '1234567890' },
            { name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', phone: '0987654321' },
            { name: 'Mike Johnson', email: 'mike@example.com', role: 'Manager', status: 'Inactive', phone: '5551234444' },
            { name: 'Sarah Wilson', email: 'sarah@example.com', role: 'User', status: 'Pending', phone: '2223334444' },
            { name: 'Alex Brown', email: 'alex@example.com', role: 'User', status: 'Active', phone: '1112223333' },
            { name: 'Emily Davis', email: 'emily@example.com', role: 'Admin', status: 'Active', phone: '5559876543' },
            { name: 'David Martinez', email: 'david@example.com', role: 'User', status: 'Active', phone: '4445556666' },
            { name: 'Lisa Anderson', email: 'lisa@example.com', role: 'Manager', status: 'Active', phone: '7778889999' },
            { name: 'Robert Taylor', email: 'robert@example.com', role: 'User', status: 'Inactive', phone: '3334445555' },
            { name: 'Jennifer Thomas', email: 'jennifer@example.com', role: 'User', status: 'Active', phone: '6667778888' },
            { name: 'Michael Garcia', email: 'michael@example.com', role: 'Admin', status: 'Active', phone: '9990001111' },
            { name: 'Jessica Rodriguez', email: 'jessica@example.com', role: 'User', status: 'Pending', phone: '2221113333' },
            { name: 'Christopher Lee', email: 'christopher@example.com', role: 'Manager', status: 'Active', phone: '8889990000' },
            { name: 'Amanda White', email: 'amanda@example.com', role: 'User', status: 'Active', phone: '1113335555' },
            { name: 'Daniel Harris', email: 'daniel@example.com', role: 'User', status: 'Inactive', phone: '4446668888' },
            { name: 'Michelle Clark', email: 'michelle@example.com', role: 'Admin', status: 'Active', phone: '7779991111' },
            { name: 'James Lewis', email: 'james@example.com', role: 'User', status: 'Active', phone: '3335557777' },
            { name: 'Laura Walker', email: 'laura@example.com', role: 'Manager', status: 'Active', phone: '6668880000' },
            { name: 'Kevin Hall', email: 'kevin@example.com', role: 'User', status: 'Active', phone: '9992224444' },
            { name: 'Rachel Allen', email: 'rachel@example.com', role: 'User', status: 'Pending', phone: '2224446666' }
        ];

        await User.insertMany(seedUsers);
        res.status(201).json({ message: 'Database seeded successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET export users as CSV
router.get('/export', async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        let csv = 'Name,Email,Phone,Role,Status,Created At\n';

        users.forEach(user => {
            csv += `"${user.name}","${user.email}","${user.phone || ''}","${user.role}","${user.status}","${user.createdAt}"\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PATCH quick status update
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Active', 'Inactive', 'Pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE bulk users
router.delete('/bulk', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ message: 'Invalid IDs provided' });
        }
        await User.deleteMany({ _id: { $in: ids } });
        res.json({ message: 'Users deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create new user
router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        role: req.body.role,
        status: req.body.status
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update user
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const fields = ['name', 'email', 'phone', 'role', 'status'];
        fields.forEach(field => {
            if (req.body[field] !== undefined) user[field] = req.body[field];
        });

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE user
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
