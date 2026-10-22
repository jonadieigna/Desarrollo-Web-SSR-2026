import express from 'express';

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, _next) => {
  res.send('<h1 style="color:red">LISTA DE AMIGAS</h1>');
});

// module.exports = router;
export default router;
