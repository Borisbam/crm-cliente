import React from 'react'
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert';

const OBTENER_CLIENTE = gql`
    query obtenerCliente($id: ID!) {
        obtenerCliente(id: $id) {
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

const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarCliente($id: ID!, $input: ClienteInput) {
        actualizarCliente(id: $id, input: $input) {
            nombre
            email
            
        }
    }
`;
const EditarCliente = () => {
    // Obtener el ID actual
    const router = useRouter();
    const { query: { id } } = router;

    // Consultar para obtener el cliente

    const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
        variables: {
            id
        }
    });
    
    // Actualizar el cliente
    const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE, {
        update(cache, { data: { actualizarCliente } }) {
            // Actualizar Clientes
            const { obtenerClientesVendedor } = cache.readQuery({
                query: OBTENER_CLIENTES_USUARIO
            });

            const clientesActualizados = obtenerClientesVendedor.map(cliente =>
                cliente.id === id ? actualizarCliente : cliente
            );

            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClientesVendedor: clientesActualizados
                }
            });

            // Actulizar Cliente Actual
            cache.writeQuery({
                query: OBTENER_CLIENTE,
                variables: { id },
                data: {
                    obtenerCliente: actualizarCliente
                }
            });
        }
    });

    // Schema de validacion

    const schemaValidacion = Yup.object({
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
    })


    if(loading) return null
    if(error) return null;
    
    const { obtenerCliente } = data;

    // Modificar el cliente en la bd
    const actualizarInfoCliente = async valores => {
        const { nombre, apellido, email, empresa, telefono } = valores;

        try {
            const { data } = await actualizarCliente({
                variables: {
                    id: id,
                    input: {
                        nombre,
                        apellido,
                        email,
                        telefono,
                        empresa
                    }
                }
            })

            swal({
                title: "Cliente actualizado",
                icon: "success",
                buttons: {
                    catch: {
                        text: 'ok'
                    }
                },
                dangerMode: true,
            })
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Editar Cliente</h1>

            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <Formik
                        validationSchema={schemaValidacion}
                        validateOnChange={false}
                        validateOnBlur={false}
                        enableReinitialize
                        initialValues={obtenerCliente}
                        onSubmit={valores => { actualizarInfoCliente(valores) }}
                    >

                        {props => {

                            console.log(props);

                            return (


                                <form
                                    className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                                    onSubmit={props.handleSubmit}
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
                                            onChange={props.handleChange}
                                            value={props.values.nombre}
                                        />

                                    </div>

                                    {props.errors.nombre ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.nombre}</p>
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
                                            onChange={props.handleChange}
                                            value={props.values.apellido}
                                        />

                                    </div>

                                    {props.errors.apellido ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.apellido}</p>
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
                                            onChange={props.handleChange}
                                            value={props.values.email}
                                        />

                                    </div>

                                    {props.errors.email ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.email}</p>
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
                                            onChange={props.handleChange}
                                            value={props.values.telefono}
                                        />

                                    </div>

                                    {props.errors.telefono ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.telefono}</p>
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
                                            onChange={props.handleChange}
                                            value={props.values.empresa}
                                        />

                                    </div>

                                    {props.errors.empresa ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.empresa}</p>
                                        </div>
                                    ) : null}

                                    <input
                                        type='submit'
                                        className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 cursor-pointer'
                                        value="registrar cliente"
                                    />

                                </form>
                            )
                        }}
                    </Formik>

                </div>
            </div>
        </Layout>
    );
}

export default EditarCliente;