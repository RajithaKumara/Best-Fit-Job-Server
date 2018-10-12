var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	try {
		res.sendFile(path.join(__dirname + '/../public/index.html'));
	} catch (error) {
		res.render('index', { title: 'Best Fit Job Server' });
	}
});

module.exports = router;
console.log('index router exported...');
