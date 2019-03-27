const hbs = require('hbs');
const fs = require('fs');
const path = require('path');
const directorioSrc = path.join(__dirname, '../src');
let listaCursos = [];

const listarCursos = () => {
    try {
        listaCursos = require('./listado-cursos.json');
    } catch (err) {
        listaCursos = [];
    }

};

const crearCurso = (curso) => {
    listarCursos();
    let duplicado = listaCursos.find(elem => elem.id == curso.id);
    if (!duplicado) {
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
        if (error) throw (error)
        console.log('Archivo creado con cursos');
    });
};

hbs.registerHelper('guardarCurso', (id, nombre, descripcion, valor, modalidad, intensidad) => {
    if (id && nombre) {
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

hbs.registerHelper('verCursoInteresado', () => {
    listarCursos();
    let texto = '<div class="accordion" id="accordionExample">';
    let index = 0;
    let collapse = true;
    let classShow = '';
    listaCursos = listaCursos.filter(curso => curso.estado != 'Cerrado');
    listaCursos.forEach(curso => {
        collapse = index != 0 ? false : true;
        classShow = index != 0 ? '' : 'show';
        texto = texto +
            '<div class="card"> \
            <div class="card-header" id="heading' + index + '"> \
            <h2 class="mb-0"> \
                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse' + index + '" aria-expanded="' + collapse + '" aria-controls="collapse' + index + '">' +
            'Nombre del curso ' + curso.nombre + '</br>' +
            'Valor ' + curso.valor +
            '</button> \
            </h2> \
            </div> \
            <div id="collapse' + index + '" class="collapse ' + classShow + '" aria-labelledby="heading' + index + '" data-parent="#accordionExample"> \
            <div class="card-body"> \
                <ul class="list-group"> \
                    <li class="list-group-item"> Nombre: ' + curso.nombre + '</li>' +
            '<li class="list-group-item"> Descripcion: ' + curso.descripcion + '</li>' +
            '<li class="list-group-item"> Modalidad: ' + curso.modalidad + '</li>' +
            '<li class="list-group-item"> Intensidad: ' + curso.intensidad + '</li>' +
            '</ul> \
            </div> \
            </div> \
        </div>';
        index++;
    });
    texto = texto + '</div>'
    return texto;
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