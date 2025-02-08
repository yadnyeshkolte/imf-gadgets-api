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

// Generate a random 6-digit confirmation code
function generateConfirmationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store confirmation codes in memory (you might want to use Redis in production)
const pendingDestructions = new Map();


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


// Request confirmation code
router.post('/:id/request-destruction', auth, async (req, res) => {
    try {
        const gadget = await Gadget.findByPk(req.params.id);
        if (!gadget) {
            return res.status(404).json({ error: 'Gadget not found' });
        }
        if (gadget.status !== 'Available') {
            return res.status(400).json({ error: 'Only available gadgets can be destroyed' });
        }

        const confirmationCode = generateConfirmationCode();
        // Store the code with a 5-minute expiration
        pendingDestructions.set(req.params.id, {
            code: confirmationCode,
            expires: Date.now() + 5 * 60 * 1000 // 5 minutes
        });

        // Clean up expired codes
        setTimeout(() => {
            if (pendingDestructions.has(req.params.id)) {
                pendingDestructions.delete(req.params.id);
            }
        }, 5 * 60 * 1000);

        res.json({ confirmationCode });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Modified self-destruct endpoint
router.post('/:id/self-destruct', auth, async (req, res) => {
    try {
        const { confirmationCode } = req.body;
        const gadget = await Gadget.findByPk(req.params.id);

        if (!gadget) {
            return res.status(404).json({ error: 'Gadget not found' });
        }

        const pendingDestruction = pendingDestructions.get(req.params.id);
        if (!pendingDestruction) {
            return res.status(400).json({ error: 'Please request a confirmation code first' });
        }

        if (Date.now() > pendingDestruction.expires) {
            pendingDestructions.delete(req.params.id);
            return res.status(400).json({ error: 'Confirmation code has expired' });
        }

        if (confirmationCode !== pendingDestruction.code) {
            return res.status(400).json({ error: 'Invalid confirmation code' });
        }

        await gadget.update({
            status: 'Destroyed',
            decommissionedAt: new Date()
        });

        pendingDestructions.delete(req.params.id);
        res.json({ message: 'Gadget self-destructed successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;