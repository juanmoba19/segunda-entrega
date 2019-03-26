const hbs = require('hbs');
const fs = require('fs');
const path = require('path');
const directorioSrc = path.join(__dirname, '../src');
let listaCursos = [];

const listarCursos = () => {
    try {
        listaCursos = require('./listado-cursos.json');
    } catch(err) {
        listaCursos = [];
    }
    
};

const crearCurso = (curso) => {
    listarCursos();
    let duplicado = listaCursos.find(elem => elem.id == curso.id);
    if(!duplicado){
        listaCursos.push(curso);
        guardar();
        return mostrarCursos();
    } else {
        let texto = '<div class="alert alert-danger" role="alert"> \
                     Ya existe un curso con este id \
                     </div>';
        return texto;
    }
    
}

const guardar = () => {
    let datos = JSON.stringify(listaCursos);
    fs.writeFile(directorioSrc + '/listado-cursos.json', datos, (error) => {
        if(error) throw (error)
        console.log('Archivo creado con cursos');
    });
};

hbs.registerHelper('guardarCurso', (id, nombre, descripcion, valor, modalidad, intensidad) => {
    if(id && nombre) {
        return crearCurso({
            id: id,
            nombre: nombre,
            descripcion: descripcion,
            valor: valor,
            modalidad: modalidad,
            intensidad: intensidad,
            estado: 'Disponible'
        });
    } else {
        return mostrarCursos();
    }
});

const mostrarCursos = () => {
    listarCursos();
    let texto = '<table class="table table-striped"> \
                 <thead> \
                 <tr> \
                 <th scope="col"> Id </th> \
                 <th scope="col"> Nombre </th> \
                 <th scope="col"> Descripción </th> \
                 <th scope="col"> Valor </th> \
                 <th scope="col"> Modalidad </th> \
                 <th scope="col"> Intensidad </th> \
                 <th scope="col"> Estado </th> \
                 </tr> \
                 </thead> \
                 <tbody>';
        listaCursos.forEach(curso => {
        texto = texto +
            '<tr>' +
            '<th scope="row">' + curso.id + '</th>' +
            '<td>' + curso.nombre + '</td>' +
            '<td>' + curso.descripcion + '</td>' +
            '<td>' + curso.valor + '</td>' +
            '<td>' + curso.modalidad + '</td>' +
            '<td>' + curso.intensidad + '</td>' +
            '<td>' + curso.estado + '</td></tr>';
    });
    texto = texto + '</tbody></table>'
    return texto;
};