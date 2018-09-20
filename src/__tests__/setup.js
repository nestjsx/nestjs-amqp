var dotenv = require('dotenv');
var path = require('path');

dotenv.config({
    path: path.resolve(__dirname, '..', '..', '.env'),
});