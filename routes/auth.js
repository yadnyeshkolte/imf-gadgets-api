// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const user = await User.create(req.body);
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

// routes/gadgets.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Gadget = require('../models/gadget');
const auth = require('../middleware/auth');
const router = express.Router();

function generateCodename() {
    const prefixes = ['The', 'Operation'];
    const names = ['Nightingale', 'Kraken', 'Phoenix', 'Shadow', 'Phantom'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${names[Math.floor(Math.random() * names.length)]}`;
}

router.get('/', auth, async (req, res) => {
    try {
        const where = req.query.status ? { status: req.query.status } : {};
        const gadgets = await Gadget.findAll({ where });
        res.json(gadgets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const gadget = await Gadget.create({
            ...req.body,
            codename: generateCodename(),
            missionSuccessProbability: Math.floor(Math.random() * 100) + 1
        });
        res.status(201).json(gadget);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.patch('/:id', auth, async (req, res) => {
    try {
        const gadget = await Gadget.findByPk(req.params.id);
        if (!gadget) {
            return res.status(404).json({ error: 'Gadget not found' });
        }
        await gadget.update(req.body);
        res.json(gadget);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const gadget = await Gadget.findByPk(req.params.id);
        if (!gadget) {
            return res.status(404).json({ error: 'Gadget not found' });
        }
        await gadget.update({
            status: 'Decommissioned',
            decommissionedAt: new Date()
        });
        res.json({ message: 'Gadget decommissioned successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/:id/self-destruct', auth, async (req, res) => {
    try {
        const gadget = await Gadget.findByPk(req.params.id);
        if (!gadget) {
            return res.status(404).json({ error: 'Gadget not found' });
        }
        await gadget.update({
            status: 'Destroyed',
            decommissionedAt: new Date()
        });
        res.json({ message: 'Gadget self-destructed successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;