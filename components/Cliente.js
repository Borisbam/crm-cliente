import React from 'react'
import Swal from 'sweetalert';
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';

const ELIMINAR_CLIENTE = gql`
    mutation eliminarCliente($id: ID!) {
        eliminarCliente(id: $id)
    }
`;

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

const Cliente = ({ cliente }) => {

    // Mutation para eliminar cliente

    const [ eliminarCliente ] = useMutation(ELIMINAR_CLIENTE, {
        update(cache) {
            const {obtenerClientesVendedor} = cache.readQuery({
                query: OBTENER_CLIENTES_USUARIO
            });

            // Reescribir el cache
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClientesVendedor: obtenerClientesVendedor.filter(cliente => (
                        cliente.id !== id
                    ))
                }
            })
        }
    });

    const { id, nombre, apellido, email, empresa } = cliente;

    const confirmarEliminarCliente = () => {
        swal({
            title: "¿Está seguro que desea eliminar el cliente?",
            text: "Una vez eliminado, no podrá recuperarse",
            icon: "warning",
            buttons: {
                catch:{
                    text: 'Si'
                },
                cancel: 'Cancelar'
            },
            dangerMode: true,
          })
          .then( async (willDelete) => {
            if (willDelete) {
                try {

                    // Eliminar por ID
                    const { data } = await eliminarCliente({
                        variables: {
                            id
                        }
                    });
                    //Mostrar la alerta
                    swal("El cliente ha sido eliminado", {
                        icon: "success",
                      });
                } catch (error) {
                    console.log(error);
                }
              
            }
          });
    }

    const editarCliente = () => {
        Router.push({
            pathname: "/editarcliente/[id]",
            query: { id }
        })
    }

    return (
        <tr>
            <td className='border px-4 py-2'>{`${nombre} ${apellido}`}</td>
            <td className='border px-4 py-2'>{empresa}</td>
            <td className='border px-4 py-2'>{email}</td>
            <td className='border px-4 py-2'>

                <button
                    type='button'
                    className='flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={() => { confirmarEliminarCliente()}}
                >Eliminar
                    
                </button>
            </td>
            <td className='border px-4 py-2'>

                <button
                    type='button'
                    className='flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={() => { editarCliente()}}
                >Editar
                    
                </button>
            </td>
        </tr>
    );
}

export default Cliente;