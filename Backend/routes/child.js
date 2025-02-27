const express = require('express');
const router = express.Router();
const Child = require('../model/childuser');

router.get('/', (req, res) => {
    const {Name} =  req.query.Name;
    const child = Child.findOne({Name});
    if(!child) return res.status(404).json({error: 'Child not found'});
    res.json({child});
}
);