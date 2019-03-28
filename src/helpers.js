const hbs = require('hbs');
let {crearCurso, mostrarCursos, listarCursos, mostrarFormInscribir,
     inscribirCursoEstudiante, mostrarCursosEst} = require('./funciones');

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
    let listaCursos = listarCursos();
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

hbs.registerHelper('inscribirCurso', (id, email, nombre, telefono, curso) => {
    if (!id && !email) {
        return mostrarFormInscribir();
    } else {
        return inscribirCursoEstudiante({
            id: id,
            email: email,
            nombre: nombre,
            telefono: telefono,
            curso: curso
        });
    }


});

hbs.registerHelper('verInscritosCursos', () => {
    return mostrarCursosEst();
});