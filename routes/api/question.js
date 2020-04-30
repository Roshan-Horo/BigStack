const express = require('express');
const router = express.Router();

router.get('/',(req,res) => res.json({question: 5}));

module.exports = router;