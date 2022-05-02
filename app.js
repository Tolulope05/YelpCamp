const express = require('express');
const app = express();
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

const port = 3000;

app.get('/', (req, res) => {
    res.render('home');
})




app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

