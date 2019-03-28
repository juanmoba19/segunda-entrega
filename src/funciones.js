const fs = require('fs');
const path = require('path');
const directorioSrc = path.join(__dirname, '../src');
let listaCursos = [];
let listaCursosEstudiante = [];

const listarCursos = () => {
    try {
        let file = fs.readFileSync('./src/listado-cursos.json', 'utf8');
        console.log("Listar es de tipo: " + typeof JSON.parse(file));
        return listaCursos = JSON.parse(file);
    } catch (err) {
        console.log(err);
        return listaCursos = [];
    }
};

const listarCursosEstudiante = () => {
    try {
        return listaCursosEstudiante = JSON.parse(fs.readFileSync('./src/listado-cursos-estudiante.json', 'utf8'));
    } catch (err) {
        console.log(err);
        return listaCursosEstudiante = [];
    }

};

const crearCurso = (curso) => {
    let file = fs.readFileSync('./src/listado-cursos.json', 'utf8');
    console.log("Ete es file" + file + ' y el tipo es ' + typeof file );
    console.log("Es json stringy " + JSON.stringify(file) + "Y es del tipo " + typeof JSON.stringify(file));
    let str = JSON.stringify(file);
    console.log("Con parseÑ " + JSON.parse(str) + "Y es del tipo " + typeof JSON.parse(str));
    listaCursos = JSON.parse(file.toString());
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

let guardarEstudiantes = () => {
    return new Promise(function(resolve, reject) {
        let datos = JSON.stringify(listaCursosEstudiante);
        fs.writeFile(directorioSrc + '/listado-cursos-estudiante.json', datos, (error) => {
            if (error) {
                reject(false);
            } else {
                console.log('Se ha creado el archivo de usuarios y cursos con exito');
                resolve(true);
            }
        });
    });
};

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

const inscribirCursoEstudiante = (inscripcion) => {
    let texto = '';
    listarCursosEstudiante();
    let duplicado = listaCursosEstudiante.find(elem => elem.id == inscripcion.id && elem.curso == inscripcion.curso);
    if (!duplicado) {
        listaCursosEstudiante.push(inscripcion);
        let result = guardarEstudiantes();
        if (result) {
            texto = '<div class="alert alert-success" role="alert"> \
                        El aspirante ' + inscripcion.nombre + ' se ha inscrito correctamente al curso con id ' + inscripcion.curso + '\
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
            '<option value="' + curso.id + '">' + curso.nombre + '</option>';
    });
    texto = texto + '</select> \
                            </div> \
                        </div> \
                        <button type="submit" class="btn btn-primary">Guardar</button> \
                    </form>';
    return texto;
};

const mostrarCursosEst = () => {
    listarCursos();
    listarCursosEstudiante();
    let texto = '<div class="accordion" id="accordionExample">';
    let index = 0;
    let collapse = true;
    let classShow = '';
    listaCursos.forEach(curso => {
        collapse = index != 0 ? false : true;
        classShow = index != 0 ? '' : 'show';
        texto = texto +
            '<div class="card"> \
            <div class="card-header" id="heading' + index + '"> \
            <h2 class="mb-0"> \
                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse' + index + '" aria-expanded="' + collapse + '" aria-controls="collapse' + index + '">' +
            'Nombre del curso: ' + curso.nombre + '</br> \
            </button> \
            <form action="/cambiar-estado" method="POST" style="display: -webkit-inline-box;"> \
                <button  name="idCurso" type="submit" class="btn btn-outline-secondary" value="' + curso.id + '">Cambiar Estado Curso</button> \
            </form> \
            </h2> \
            </div> \
            <div id="collapse' + index + '" class="collapse ' + classShow + '" aria-labelledby="heading' + index + '" data-parent="#accordionExample"> \
            <div class="card-body"> \
            <table class="table table-striped"> \
            <thead> \
            <tr> \
            <th scope="col"> Documento </th> \
            <th scope="col"> Nombre </th> \
            <th scope="col"> Correo </th> \
            <th scope="col"> Telefono </th> \
            <th scope="col"> Eliminar </th> \
            </tr> \
            </thead> \
            <tbody>';
        let estudCurso = listaCursosEstudiante.filter(est => est.curso == curso.id);
        estudCurso.forEach(estCur => {
            texto = texto +
                '<tr>' +
                '<th scope="row">' + estCur.id + '</th>' +
                '<td>' + estCur.nombre + '</td>' +
                '<td>' + estCur.email + '</td>' +
                '<td>' + estCur.telefono + '</td>' +
                '<td><form action="/eliminar-inscritos" method="POST" style="display: -webkit-inline-box;"> \
                        <button  name="idCursoEst" type="submit" class="btn btn-outline-danger" value="' + curso.id + ',' + estCur.id +'">Eliminar</button> \
                    </form> \
                </td></tr>';
        });
        texto = texto + '</tbody></table> \
            </div> \
            </div> \
        </div>';
        index++;
    });
    texto = texto + '</div>'
    return texto;
}

const cambiarEstadoCurso = (idCurso) => {
    listarCursos();
    let curso = listaCursos.find(elem => elem.id == idCurso);
    if (curso) {
        let estado = curso.estado == 'Disponible' ? 'Cerrado' : 'Disponible'
        curso.estado = estado;
        guardar();
    } else {
        console.log('No existe el curso');
    }
};

let eliminarEstudianteCurso = async (idCurso, idEstudiante) => {
    listarCursosEstudiante();
    console.log("Legan idCurso: " + idCurso + " IdEstudiante: " + idEstudiante);
    console.log("Array sin borrar: " + JSON.stringify(listaCursosEstudiante) );
    let nuevo = listaCursosEstudiante.filter(estCurso => estCurso.id != idEstudiante || estCurso.curso != idCurso);
    console.log("Array con filtro borrar: " + JSON.stringify(nuevo) );
    if (nuevo.length == listaCursosEstudiante.length) {
        console.log(`No existe el estudiante con id ${idEstudiante} matriculado en el curso con id ${idCurso}`);
    } else {
        listaCursosEstudiante = nuevo;
        let result = await guardarEstudiantes();
        if(result) {
            console.log("Se elimino exitosamente");
        } else {
            console.log("Error al eliminar");
        }
    }
};

module.exports = {
    crearCurso,
    mostrarCursos,
    listarCursos,
    inscribirCursoEstudiante,
    mostrarFormInscribir,
    mostrarCursosEst,
    cambiarEstadoCurso,
    eliminarEstudianteCurso,
    listaCursos
}
