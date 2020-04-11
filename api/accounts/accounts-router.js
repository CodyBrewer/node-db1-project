const router = require('express').Router();

const db = require('../../data/dbConfig.js')

router.get('/', async (req, res) => {
    try {
        const accounts = await db('accounts')
        accounts 
        ? res.status(200).json(accounts)
        : res.status(404).json({ message: 'no accounts found' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const account = await db('accounts').where({ id }).first()
        account 
        ? res.status(200).json(account)
        : res.status(404).json({ message: 'No account found by that id.'})
    } catch (error) {
        res.status(500).json({ message: 'server error when trying to get account by id' })
    }
})

router.post('/', async (req, res) => {
    const account = req.body;
    if (validateAccount(account)) {
        try {
            const posted = await db('accounts').insert(account)
            if (posted ) {
            res.json(201).json(posted)
            }
        } catch (error) {
            res.status(500).json({ message: 'error adding the account to the database'})
        }
    } else {
        res.status(400).json({ message: 'Please provide name and budget of zero or more for the account'})
    }
    
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    if (validateAccount(changes)) {
        try {
            const updated = await db('accounts').where({ id }).first().update(changes);
            updated
            ? res.status(200).json({ message: `record with id of ${id} has been updated`})
            : res.status(404).json({ message: 'account not found'})
        } catch (error) {
            res.status(500).json({ message: 'server error when trying to update record'})        
        }
    } else {
        res.status(401).json({ message: "please provide name and budget of zero or more to update account." })
        }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
    const removed = db('accounts').where({ id }).del()
    removed
    ? res.status(204).json({message: 'account deleted'})
    : res.stutus(200)
        
    } catch (error) {
        res.status(500).json({ message: 'server error when trying to delete.' })
    }

})

const validateAccount = ({ name, budget }) => {
    return name && typeof budget === 'number' && budget >=0;
}

module.exports = router;