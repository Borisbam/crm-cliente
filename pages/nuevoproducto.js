import React, { useState } from 'react'
import Layout from '../components/Layout';
import { useMutation, gql } from '@apollo/client';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';

const NUEVO_PRODUCTO = gql`
mutation nuevoProducto($input : ProductoInput){
    nuevoProducto(input: $input) {
      id
      nombre
      existencia
      precio
      creado
    }
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


const NuevoProducto = () => {

    const router = useRouter();

    const [mensaje, guardarMensaje] = useState(null);

     // Mutation de apollo
    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
        update(cache, { data: { nuevoProducto } }) {
            // obtener el objeto de cache
            if (cache.data.data.ROOT_QUERY.obtenerProductos) {
                const { obtenerProductos } = cache.readQuery({
                  query: OBTENER_PRODUCTOS,
                });
                console.log(obtenerProductos);
         
            // reescribir ese objeto
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: [...obtenerProductos, nuevoProducto]
                }
            });
        }
        }
    });

    const formik = useFormik({
        initialValues: {
            nombre: '',
            existencia: '',
            precio: '',

        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .required('El nombre es obligatorio'),
            existencia: Yup.string()
                .required('El stock es obligatorio'),
            precio: Yup.string()
                .required('El precio es obligatorio')

        }),
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async valores => {
            formik.errors = formik.errors
            const { nombre, existencia, precio } = valores;
            console.log(valores)
            try {

                const { data } = await nuevoProducto({
                    variables: {
                        input: {
                            nombre,
                            existencia,
                            precio
                        }
                    }
                })

                guardarMensaje('Ingresando...');
                setTimeout(() => {
                    router.push('/productos')
                }, 3000);
            } catch (error) {
                console.log(error);
                guardarMensaje(error.message);
                setTimeout(() => {
                    guardarMensaje(null);
                }, 3000);
            }
        }
    });

    const mostrarMensaje = () => {
        return (
            <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
                <p>{mensaje}</p>
            </div>
        )
    }

    return (

        <Layout>
            { mensaje && mostrarMensaje()}
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <form
                        className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                        onSubmit={formik.handleSubmit}
                    >
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="nombre">
                                Nombre
                            </label>

                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id='nombre'
                                type='text'
                                placeholder='Ingresa el nombre del producto'
                                onChange={formik.handleChange}
                                value={formik.values.nombre}
                            />

                        </div>

                        {formik.errors.nombre ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.nombre}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="existencia">
                                Stock
                            </label>

                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id='existencia'
                                type='number'
                                placeholder='Ingresa el stock del producto'
                                onChange={formik.handleChange}
                                value={formik.values.existencia}
                            />

                        </div>

                        {formik.errors.existencia ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.existencia}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="precio">
                                Precio
                            </label>

                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id='precio'
                                type='number'
                                placeholder='Ingresa el precio del producto'
                                onChange={formik.handleChange}
                                value={formik.values.precio}
                            />

                        </div>

                        {formik.errors.precio ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.precio}</p>
                            </div>
                        ) : null}

                        <input
                            type='submit'
                            className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 cursor-pointer'
                            value="agregar producto"
                        />
                    </form>
                </div>
            </div>
        </Layout>

    );
}

export default NuevoProducto;