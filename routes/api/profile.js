const express = require('express');
const router = express.Router();


router.get('/',(req,res) => res.json({profile:true}));


module.exports = router;