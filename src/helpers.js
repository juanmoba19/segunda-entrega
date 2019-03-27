const hbs = require('hbs');
const fs = require('fs');
const path = require('path');
const directorioSrc = path.join(__dirname, '../src');
let listaCursos = [];
let listaCursosEstudiante = [];

const listarCursos = () => {
    try {
        listaCursos = require('./listado-cursos.json');
    } catch (err) {
        listaCursos = [];
    }

};

const listarCursosEstudiante = () => {
    try {
        listaCursosEstudiante = require('./listado-cursos-estudiante.json');
    } catch (err) {
        listaCursosEstudiante = [];
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

const guardarEstudiantes = async () => {
    return new Promise(function(resolve, reject) {
        let datos = JSON.stringify(listaCursosEstudiante);
        fs.writeFile(directorioSrc + '/listado-cursos-estudiante.json', datos, (error) => {
            if (error) {
                reject(false);
            }  else {
                console.log('Se ha creado el archivo de usuarios y cursos con exito');
                resolve(true);
            }
            
        });
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

hbs.registerHelper('inscribirCurso', (id, email, nombre, telefono, curso) => {
    if(!id && !email) {
        return mostrarFormInscribir();
    } else {
        return  inscribirCursoEstudiante({
            id: id, 
            email: email, 
            nombre: nombre, 
            telefono: telefono,
            curso: curso
        });
    }

    
});

const inscribirCursoEstudiante = (inscripcion) => {
    let texto = '';
    listarCursosEstudiante();
    let duplicado = listaCursosEstudiante.find(elem => elem.nombre == inscripcion.nombre && elem.curso == inscripcion.curso);
    if (!duplicado) {
        listaCursosEstudiante.push(inscripcion);
        let result = guardarEstudiantes();
        if(result) {
            texto = '<div class="alert alert-success" role="alert"> \
                        El aspirante ' + inscripcion.nombre + ' se ha inscrito correctamente al curso ' + inscripcion.curso + '\
                     </div>';
        } else {
            texto = '<div class="alert alert-danger" role="alert"> \
                     Error en la inscripcion del aspirante \
                </div>'; 
        }
    } else {
        texto = '<div class="alert alert-danger" role="alert"> \
                     Ya el aspirante se encuentra inscrito en el curso \
                </div>';
    }

    return texto;
};

const mostrarFormInscribir = () => {
    listarCursos();
    let texto = '<form action="/inscribir" method="POST"> \
                        <div class="form-row"> \
                            <div class="form-group col-md-6"> \
                                <label for="inputId">Documento de identidad</label> \
                                <input name="id" type="number" class="form-control" id="inputId" placeholder="Documento de identidad" required> \
                            </div> \
                            <div class="form-group col-md-6"> \
                                <label for="inputEmail">Correo electronico</label> \
                                <input name="email" type="email" class="form-control" id="inputEmail" placeholder="Email" required> \
                            </div> \
                        </div> \
                        <div class="form-row"> \
                            <div class="form-group col-md-6"> \
                                <label for="inputNombre">Nombre</label> \
                                <input name="nombre" type="text" class="form-control" id="inputNombre" placeholder="Nombre" required> \
                            </div> \
                            <div class="form-group col-md-6"> \
                                <label for="inputTel">Telefono</label> \
                                <input name="telefono" type="number" class="form-control" id="inputTel" placeholder="Valor del Curso" required> \
                            </div> \
                        </div> \
                        <div class="form-row"> \
                            <div class="form-group col-md-12"> \
                                <label for="inputCurso">Cursos disponibles</label> \
                                <select name="curso" id="inputCurso" class="form-control"> \
                                    <option selected>- Seleccionar -</option>';
        listaCursos.forEach(curso => {
            texto = texto +
                '<option>' + curso.nombre + '</option>';
        });
        texto = texto +  '</select> \
                            </div> \
                        </div> \
                        <button type="submit" class="btn btn-primary">Guardar</button> \
                    </form>';
    return texto;
};