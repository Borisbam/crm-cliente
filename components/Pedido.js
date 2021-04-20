import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert';
import swal from 'sweetalert';

const ACTUALIZAR_PEDIDO = gql`
    mutation actualizarPedido($id: ID!, $input: PedidoInput) {
        actualizarPedido(id: $id, input: $input) {
            estado
        }
    }
`;

const ELIMINAR_PEDIDO = gql`
    mutation eliminarPedido($id: ID!) {
        eliminarPedido(id: $id)
    }
`;

const OBTENER_PEDIDOS = gql`
  query obtenerPedidosVendedor {
    obtenerPedidosVendedor {
      id
      
    }
  }
`;


const Pedido = ({ pedido }) => {

    const { id, total, cliente: { nombre, apellido, telefono, email }, estado, cliente } = pedido;

    // Mutation
    const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO);
    const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO, {
        update(cache) {
            const { obtenerPedidosVendedor } = cache.readQuery({
                query: OBTENER_PEDIDOS
            });

            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidosVendedor: obtenerPedidosVendedor.filter( pedido => pedido.id !== id)
                }
            })
        }
    });

    const [estadoPedido, setEstadoPedido] = useState(estado);
    const [clase, setClase] = useState('');

    useEffect(() => {
        if (estadoPedido) {
            setEstadoPedido(estadoPedido);
        }
        clasePedido();
    }, [estadoPedido]);

    // Funcion que modifica la clase del pedido

    const clasePedido = () => {
        if (estadoPedido === 'PENDIENTE') {
            setClase('border-yellow-500')
        } else if (estadoPedido === 'COMPLETADO') {
            setClase('border-green-500')
        } else {
            setClase('border-red-800')
        }
    }

    const cambiarEstadoPedido = async nuevoEstado => {
        try {
            const { data } = await actualizarPedido({
                variables: {
                    id,
                    input: {
                        estado: nuevoEstado,
                        cliente: cliente.id
                    }
                }
            });

            setEstadoPedido(data.actualizarPedido.estado);
        } catch (error) {
            console.log(error)
        }
    }

    const confirmarEliminarPedido = () => {

        try {

            swal({
                title: "¿Está seguro que desea eliminar el producto?",
                text: "Una vez eliminado, no podrá recuperarse",
                icon: "warning",
                buttons: {
                    catch: {
                        text: 'Si'
                    },
                    cancel: 'Cancelar'
                },
                dangerMode: true,
            }).then(async (willDelete) => {
                if (willDelete) {
                    try {

                        // Eliminar por ID
                        await eliminarPedido({
                            variables: {
                                id
                            }
                        });
                        
                        //Mostrar la alerta
                        swal("El pedido ha sido eliminado", {
                            icon: "success",
                        });
                    } catch (error) {
                        console.log(error);
                    }

                }
            });

        } catch (error) {

        }
    }

    return (
        <div className={`${clase} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
            <div>
                <p className='font-bold text-gray-800'>Cliente: {nombre} {apellido}
                </p>

                {email && (
                    <p className='flex items-center my-2'>
                        <svg className='h-6 w-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <a href={`mailto:${email}`}>{email}</a>
                    </p>
                )}

                {telefono && (
                    <p className='flex items-center my-2'>
                        <svg className='h-6 w-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        {telefono}
                    </p>
                )}
                <h2 className='text-gray-800 font-bold mt-10'>Estado:
                </h2>

                <select
                    className='mt-2 appearance-none bg-blue-600 border border-blue-800 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-ts font-bold'
                    onChange={e => cambiarEstadoPedido(e.target.value)}
                    defaultValue={estado}
                >
                    <option value='COMPLETADO'>COMPLETADO</option>
                    <option value='PENDIENTE'>PENDIENTE</option>
                    <option value='CANCELADO'>CANCELADO</option>

                </select>
            </div>
            <div>
                <h2 className='text-gray-800 font-bold mt-2'>Resumen del pedido</h2>
                {pedido.pedido.map(producto => (
                    <div key={producto.id} className='m-4'>
                        <p className='text-sm text-gray-600'>Producto: {producto.nombre}</p>
                        <p className='text-sm text-gray-600'>Cantidad: {producto.cantidad}</p>
                    </div>
                ))}
                <p className='text-gray-800 mt-3 font-bold'>Total a pagar: <span className='font-light'>${total}</span></p>

                <button
                    className='flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight uppercase text-xs font-bold'
                    onClick={() => confirmarEliminarPedido()}
                >
                    Eliminar pedido
                </button>
            </div>
        </div >
    );
}

export default Pedido;