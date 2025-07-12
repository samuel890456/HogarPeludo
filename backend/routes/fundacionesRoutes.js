const express = require('express');
const router = express.Router();
const fundacionesController = require('../controllers/fundacionesController');

router.post('/', fundacionesController.createFundacion);
router.get('/', fundacionesController.getAllFundaciones);
router.get('/:id', fundacionesController.getFundacionById);
router.put('/:id', fundacionesController.updateFundacion);
router.delete('/:id', fundacionesController.deleteFundacion);

module.exports = router;
