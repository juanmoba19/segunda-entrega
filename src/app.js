const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const { cambiarEstadoCurso } = require('./helpers');
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

app.get('/ver-cursos', (req, res) => {
        res.render('ver-cursos');
    }),

    app.post('/guardar-curso', (req, res) => {
        res.render('ver-cursos', {
            id: req.body.id,
            nombre: req.body.nombre,
            modalidad: req.body.modalidad == '- Seleccionar -' ? '-' : req.body.modalidad,
            valor: req.body.valor,
            descripcion: req.body.descripcion,
            intensidad: req.body.intensidad || '-'
        });
    });

app.get('/inscribir', (req, res) => {
    res.render('inscribir');
});

app.get('/ver-inscritos', (req, res) => {
    res.render('inscritos')
});

app.post('/inscribir', (req, res) => {
    res.render('inscribir', {
        id: req.body.id,
        email: req.body.email,
        nombre: req.body.nombre,
        telefono: req.body.telefono,
        curso: req.body.curso
    });
});

app.post('/cambiar-estado', (req, res) => {
    console.log(req.body.idCurso);
    cambiarEstadoCurso(req.body.idCurso);
    res.render('ver-cursos');
});

app.listen(3000, () => {
    console.log('Escuchando puerto 3000');
});