import React from 'react'
import Swal from 'sweetalert';
import { gql, useMutation, useQuery } from '@apollo/client';
import Router from 'next/router';

const ELIMINAR_PRODUCTO = gql`
    mutation eliminarProducto($id: ID!) {
        eliminarProducto(id: $id)
    }
`;

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
const Producto = ({producto}) => {

    

    const { id, nombre, precio, existencia } = producto;

    const [ eliminarProducto ] = useMutation(ELIMINAR_PRODUCTO,{
        update(cache) {
            const { obtenerProductos } = cache.readQuery({ 
                query: OBTENER_PRODUCTOS,
            });
            
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: obtenerProductos.filter(productoActual => productoActual.id !== id)
                }
            })
        }
    }
        
        );
    
    const confirmarEliminarProducto = () => {
        swal({
            title: "¿Está seguro que desea eliminar el producto?",
            text: "Una vez eliminado, no podrá recuperarse!",
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
                    const { data } = await eliminarProducto({
                        variables: {
                            id
                        }
                    });
                    //Mostrar la alerta
                    swal("El producto ha sido eliminado", {
                        icon: "success",
                      });
                } catch (error) {
                    console.log(error);
                }

                // Cache modify

                
              
            }
          });
    }

    const editarProducto = () => {
        Router.push({
            pathname: "/editarproducto/[id]",
            query: { id }
        })
    }

    return ( 
        <tr>
            <td className='border px-4 py-2'>{nombre}</td>
            <td className='border px-4 py-2'>{existencia}</td>
            <td className='border px-4 py-2'>{precio}</td>
            <td className='border px-4 py-2'>

                <button
                    type='button'
                    className='flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={() => { confirmarEliminarProducto()}}
                >Eliminar
                    
                </button>
            </td>
            <td className='border px-4 py-2'>

                <button
                    type='button'
                    className='flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={() => { editarProducto()}}
                >Editar
                    
                </button>
            </td>
        </tr>

     );
}
 
export default Producto;