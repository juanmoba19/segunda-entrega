const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
require('./helpers');
const directoriopublico = path.join(__dirname, '../public');
const directoriopartials = path.join(__dirname, '../partials');
const dirNode_modules = path.join(__dirname, '../node_modules')
app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/crear-curso', (req, res) => {
    res.render('crear-curso');
});

app.get('/ver-Cursos', (req, res) => {
    res.render('ver-cursos');
}),

app.post('/guardar-curso', (req, res) => {
    console.log(req.body);
    res.render('ver-cursos', {
        id: req.body.id,
        nombre: req.body.nombre,
        modalidad: req.body.modalidad || '-',
        valor: req.body.valor,
        descripcion: req.body.descripcion,
        intensidad: req.body.intensidad || '-'
    });
});

app.listen(3000, () => {
    console.log('Escuchando puerto 3000');
});