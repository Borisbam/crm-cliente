import React, {useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { useQuery, gql } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      email
      empresa
    }
  }
`;



const AsignarCliente = () => {
    // Consulta los clientes
    const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);
    
    // State de cliente
    const [ cliente, setCliente ] = useState([]);

    // Context de pedidos
    const pedidoContext = useContext(PedidoContext);
    const { agregarCliente } = pedidoContext;

    useEffect(() => {
        agregarCliente(cliente);
    }, [cliente]);

    const seleccionarCliente = clientes => {
        setCliente(clientes);
    }

    if(loading) return null;    

    const { obtenerClientesVendedor } = data;

    return(

        <>
        <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>1. Asigna un cliente al pedido</p>
        <Select 
            className='mt-3'
            options={obtenerClientesVendedor}
            isMulti={false}
            onChange={ opcion => seleccionarCliente(opcion)}
            getOptionValue={ opciones => opciones.id}
            getOptionLabel={ opciones => opciones.nombre}
            placeholder='Seleccione un cliente'
            noOptionsMessage={() => 'No hay resultados'}
        />

        </>
    )

}

export default AsignarCliente;