import React, { useState } from 'react'
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const NUEVO_CLIENTE = gql`
    mutation nuevoCliente($input: ClienteInput) {
        nuevoCliente(input: $input) {
            nombre
            apellido
            email
            telefono
            empresa
        }
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


const NuevoCliente = () => {

    const router = useRouter();

    const [mensaje, guardarMensaje] = useState(null);

    const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
        update(cache, { data: { nuevoCliente } }) {
            // Obtener el objeto de cache que deseamos actualizar
            const { obtenerClientesVendedor } = cache.readQuery({ query: OBTENER_CLIENTES_USUARIO });

            // Reescribir el cache
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            telefono: '',
            empresa: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .required('El nombre es obligatorio'),
            apellido: Yup.string()
                .required('El apellido es obligatorio'),
            email: Yup.string()
                .required('El email es obligatorio')
                .email('No es un email válido'),
            telefono: Yup.string()
                .required('El teléfono es obligatorio'),
            empresa: Yup.string()
                .required('La empresa es obligatoria'),
        }),
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async valores => {
            formik.errors = formik.errors
            const { nombre, apellido, email, telefono, empresa } = valores;
            console.log(valores)
            try {

                const { data } = await nuevoCliente({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            email,
                            telefono,
                            empresa
                        }
                    }
                })

                guardarMensaje('Ingresando...');
                setTimeout(() => {
                    router.push('/')
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
            <h1 className='text-2xl text-gray-800 font-light'>Nuevo Cliente</h1>
            { mensaje && mostrarMensaje}
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
                                placeholder='Ingresa el nombre del cliente'
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
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="apellido">
                                Apellido
                            </label>

                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id='apellido'
                                type='text'
                                placeholder='Ingresa el apellido del cliente'
                                onChange={formik.handleChange}
                                value={formik.values.apellido}
                            />

                        </div>

                        {formik.errors.apellido ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.apellido}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="email">
                                Email
                            </label>

                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id='email'
                                type='email'
                                placeholder='Ingresa el email del cliente'
                                onChange={formik.handleChange}
                                value={formik.values.email}
                            />

                        </div>

                        {formik.errors.email ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.email}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="telefono">
                                Teléfono
                            </label>

                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id='telefono'
                                type='tel'
                                placeholder='Ingresa el teléfono del cliente'
                                onChange={formik.handleChange}
                                value={formik.values.telefono}
                            />

                        </div>

                        {formik.errors.telefono ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.telefono}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="empresa">
                                Empresa
                            </label>

                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id='empresa'
                                type='text'
                                placeholder='Ingresa la empresa del cliente'
                                onChange={formik.handleChange}
                                value={formik.values.empresa}
                            />

                        </div>

                        {formik.errors.empresa ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.empresa}</p>
                            </div>
                        ) : null}

                        <input
                            type='submit'
                            className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 cursor-pointer'
                            value="registrar cliente"
                        />

                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NuevoCliente;