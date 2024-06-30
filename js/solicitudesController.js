const urlAPIBase = "";

function getDatos() {
  let params = {
    cod_solicitud: document.getElementById("cod_solicitud").value,
    fecha: document.getElementById("fecha").value,
    proveedores_cod_proveedores: document.getElementById("proveedores_cod_proveedores").value,
    restaurante_cod_restaura: document.getElementById("restaurante_cod_restaura").value,
    num_fact: document.getElementById("num_fact").value,
    cantidad_mad: document.getElementById("cantidad_mad").value,
    cantidad_sas: document.getElementById("cantidad_sas").value
  };
  return params;
}

function fnValidarCampos() {
  const params = getDatos();

  if (params.fecha.length == 0) {
    Swal.fire("El campo fecha es requerido!", "", "info");
    return false;
  }

  if (params.proveedores_cod_proveedores.trim().length == 0) {
    Swal.fire("El campo proveedores_cod_proveedores es requerido!", "", "info");
    return false;
  }

  if (params.restaurante_cod_restaura.trim().length == 0) {
    Swal.fire("El campo restaurante_cod_restaura es requerido!", "", "info");
    return false;
  }

  if (params.num_fact.trim().length == 0) {
    Swal.fire("El campo num_fact es requerido!", "", "info");
    return false;
  }

  if (params.cantidad_mad.trim().length == 0) {
    Swal.fire("El campo cantidad_mad es requerido!", "", "info");
    return false;
  }

  if (params.cantidad_sas.trim().length == 0) {
    Swal.fire("El campo cantidad_sas es requerido!", "", "info");
    return false;
  }

  return true;
}

function fnGuardarCambios() {
  if (fnValidarCampos() == false) {
    return;
  }

  const id = parseInt($("#cod_solicitud").val());

  if (id === 0) {
    fnGuardar();
  } else {
    fnEditar();
  }
}

function fnGuardar() {
  const params = getDatos();

  axios
    .post(urlAPIBase, params)
    .then(function (response) {
      const data = response.data;

      if (data.msj === "OK") {
        fnListar();

        Swal.fire("¡Solicitud agregada!", "", "success");
        $("#solicitudesModal").modal("hide");
        $("#solicitudesForm")[0].reset();
        $("#cod_solicitud").val(0);
      } else {
        Swal.fire(data.msj, "", "info");
      }
    })
    .catch(function (error) {
      Swal.fire("Error", "Hubo un error al agregar la solicitud", "error");
      console.dir(error);
    });
}

function fnEditar() {
  const params = getDatos();

  axios
    .put(urlAPIBase, params)
    .then(function (response) {
      const data = response.data;

      if (data.msj === "OK") {
        fnListar();

        Swal.fire("¡Solicitud editada!", "", "success");
        $("#solicitudesModal").modal("hide");
        $("#solicitudesForm")[0].reset();
      } else {
        Swal.fire(data.msj, "", "info");
      }
    })
    .catch(function (error) {
      Swal.fire("Error", "Hubo un error al editar la solicitud", "error");
      console.dir(error);
    });
}

function fnListar() {
  axios
    .get(urlAPIBase)
    .then(function (response) {
      const solicitudes = response.data;
      let row = "";

      solicitudes.forEach(function (item) {
        row +=
          `<tr>
            <td>${item.cod_solicitud}</td>
            <td>${item.fecha}</td>
            <td>${item.proveedores_cod_proveedores}</td>
            <td>${item.restaurante_cod_restaura}</td>
            <td>${item.num_fact}</td>
            <td>${item.cantidad_mad}</td>
            <td>${item.cantidad_sas}</td>
            <td>
              <button class="btn btn-info btn-sm" onclick="fnCargarDatos(${item.cod_solicitud})" title='Editar'> <i class='fa fa-edit'></i></button>
              <button class="btn btn-danger btn-sm" onclick="fnEliminar(${item.cod_solicitud})" title='Eliminar'> <i class='fa fa-trash'></i></button>
            </td>
          </tr>`;
      });

      fnDestruirTabla("solicitudes-table");
      $("#solicitudes-table-body").html(row);
      fnCrearDataTable("solicitudes-table");
    })
    .catch(function (error) {
      Swal.fire("Error", "Hubo un error al obtener las solicitudes", "error");
      console.dir(error);
    });
}

function fnCargarDatos(id) {
  axios
    .get(urlAPIBase + "/" + id)
    .then(function (response) {
      const data = response.data;
      $("#cod_solicitud").val(data.cod_solicitud);
      $("#fecha").val(data.fecha);
      $("#proveedores_cod_proveedores").val(data.proveedores_cod_proveedores);
      $("#restaurante_cod_restaura").val(data.restaurante_cod_restaura);
      $("#num_fact").val(data.num_fact);
      $("#cantidad_mad").val(data.cantidad_mad);
      $("#cantidad_sas").val(data.cantidad_sas);

      $("#lblTitulo").html("Editar");
      $("#solicitudesModal").modal("show");
    })
    .catch(function (error) {
      Swal.fire("Error", "Hubo un error al cargar datos", "error");
    });
}

function fnEliminar(id) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminarlo!",
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .delete(urlAPIBase + "/" + id)
        .then(function (response) {
          const data = response.data;

          if (data.msj === "OK") {
            Swal.fire("¡Eliminado!", "La solicitud ha sido eliminada.", "success");
            fnListar();
          } else {
            Swal.fire(data.msj, "", "info");
          }
        })
        .catch(function (error) {
          Swal.fire("Error", "Hubo un error al eliminar la solicitud", "error");
        });
    }
  });
}

function fnNuevo() {
  $("#solicitudesForm")[0].reset();
  $("#solicitudesModal").modal("show");
  $("#lblTitulo").html("Nueva");
  $("#cod_solicitud").val(0);
}

fnListar();
