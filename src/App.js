import React, { Component } from 'react';
import './App.css';

import { MinisterioService } from './services/MinisterioService'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import mplogo from './mplogo.png';
import jeslogo from './jeslogo.jpg';


export default class App extends Component {
  constructor() {
    super();

    this.state = {
      data: [],
      modalInsertar: false,
      modalEliminar: false,
      form: {
        id: '',
        ubicacion: '',
        telefono: ''
      }
    }

    this.ministerioService = new MinisterioService()
  }

  componentDidMount() {
    this.getMinisterios();
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }

  capturarInput = async e => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }

  selectMp = (mp) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: mp.id,
        ubicacion: mp.ubicacion,
        telefono: mp.telefono,
        tipoModal: ''
      }
    })
  }

  getMinisterios = () => {
    this.ministerioService.getAll().then(data => {
      console.log(data.rows);
      this.setState({ data: data.rows })
    }).catch(error => {
      console.log(error.message);
    })
  }

  postMinisterio = async () => {
    delete this.state.form.id;
    await this.ministerioService.new(this.state.form).then(response => {
      this.modalInsertar();
      this.getMinisterios();
    }).catch(error => {
      console.log(error.message);
    })
  }

  editMp = () => {
    this.ministerioService.update(this.state.form.id, this.state.form).then(response => {
      this.modalInsertar();
      this.getMinisterios();
    }).catch(error => { console.log(error.message) })
  }

  deleteMp = () => {
    this.ministerioService.delete(this.state.form.id).then(response => {
      this.setState({ modalEliminar: false });
      this.getMinisterios();
    })
  }

  render() {

    const { form } = this.state;

    return (
      <div className="App" style={{ margin: '0 10%' }}>


        <div style={{ margin: '0 auto', width: '500px' }}>
          <img src={mplogo} alt="logo" style={{ width: '50%' }}></img>
          <img src={jeslogo} alt="jeslogo" style={{ width: '50%' }}></img>
        </div>

        <p style={{ textAlign: 'justify' }}>En la siguiente tabla, tiene usted la libertad de <b>agregar, editar o eliminar</b> sedes correspondientes al ministerio público, 
        agregando su ubicación y número de teléfono.</p>

        <div style={{ margin: '0 auto' }}>

          <div style={{ textAlign: 'left', marginTop: '20px' }}>
            <button className="btn btn-light border" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>
              <FontAwesomeIcon icon={faPlus} />
             Agregar sede
          </button>
          </div>

          <table className="table table-striped">
            <thead className="table thead-dark">

              <tr>

                <th>Id</th>
                <th>Ubicación</th>
                <th>Teléfono</th>
                <th colSpan="2">Acción</th>

              </tr>

            </thead>

            {this.state.data.length > 0 ? <tbody>
              {this.state.data.map(ministerio => {

                return (


                  <tr key={ministerio.id}>
                    <td>{ministerio.id}</td>
                    <td>{ministerio.ubicacion}</td>
                    <td>{ministerio.telefono}</td>
                    <td>
                      <button className="btn btn-light border" onClick={() => { this.selectMp(ministerio); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
                      {"   "}
                      <button className="btn btn-light border" onClick={() => { this.selectMp(ministerio); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
                    </td>
                  </tr>
                )
              })}
            </tbody> :
              <tbody>
                <tr>
                  <td colSpan="4">
                    -- No hay registros --
                </td>
                </tr>

              </tbody>
            }


          </table>

        </div>


        <Modal isOpen={this.state.modalInsertar}>

          <ModalBody>
            <div className="form-group">
              <label htmlFor="id">ID</label>
              <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.capturarInput} value={form ? form.id : ''}></input>
              <br />

              <label htmlFor="id">Ubicación</label>
              <input className="form-control" type="text" name="ubicacion" id="ubicacion" onChange={this.capturarInput} value={form ? form.ubicacion : ''}></input>
              <br />

              <label htmlFor="id">Teléfono</label>
              <input className="form-control" type="text" name="telefono" id="telefono" onChange={this.capturarInput} value={form ? form.telefono : ''}></input>
              <br />

            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal === 'insertar' ?
              <button className="btn btn-success" onClick={() => this.postMinisterio()}>Insertar</button> :
              <button className="btn btn-primary" onClick={() => this.editMp()}>Actualizar</button>
            }

            <button className="btn btn-danger" onClick={() => this.modalInsertar()}>Cancelar</button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.modalEliminar}>

          <ModalBody>
            ¿Está seguro de eliminar la sede: <b>{form && form.ubicacion}</b>?
          </ModalBody>

          <ModalFooter>
            <button className="btn btn-danger" onClick={() => this.deleteMp()}>Sí, seguro.</button>
            <button className="btn btn-secondary" onClick={() => this.setState({ modalEliminar: false })}>No.</button>
          </ModalFooter>
        </Modal>

      </div>




    );
  }
}