import React, { useEffect, useState, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

const OBTENER_PRODUCTOS = gql`
    query obtenerProductos{
        obtenerProductos{
            id
            nombre
            precio
            existencia
        }
    }
`;

const AsignarProductos = () => {

    // State de productos
    const [ productos, setProductos] = useState([]);

    // Context de pedidos
    const pedidoContext = useContext(PedidoContext);
    const { agregarProducto } = pedidoContext;

    // Consulta por productos

    const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);


    useEffect(() => {
        agregarProducto(productos)
    }, [productos])

    const seleccionarProducto = producto => {
        setProductos(producto)
    }

    if (loading) return null;
    if (error) return null;

    const { obtenerProductos } = data;

    return (
        <>
            <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>2. Asigna productos al pedido</p>
            <Select
                className='mt-3'
                options={obtenerProductos}
                isMulti={true}
                onChange={opcion => seleccionarProducto(opcion)}
                getOptionValue={opciones => opciones.id}
                getOptionLabel={opciones => `${opciones.nombre} - ${opciones.existencia} disponibles`}
                placeholder='Seleccione los productos'
                noOptionsMessage={() => 'No hay resultados'}
            />

        </>
    );
}

export default AsignarProductos;