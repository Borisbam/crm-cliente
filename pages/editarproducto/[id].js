import React from 'react'
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup';

const OBTENER_PRODUCTO = gql`
query obtenerProducto($id: ID!) {
    obtenerProducto(id: $id){
        nombre
        precio
        existencia
    }
}
`;

const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput) {
        actualizarProducto(id: $id, input: $input) {
            id
            nombre
            existencia
            precio
        }
    }
`;

const EditarProducto = () => {
    const router = useRouter();
    const { query: { id } } = router;
    // Consultar el producto
    const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
        variables: {
            id
        }
    });


    // Mutation para editar
    const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO,)

    const schemaValidacion = Yup.object({
        nombre: Yup.string()
            .required('El nombre es obligatorio'),
        precio: Yup.string()
            .required('El precio es obligatorio'),
        existencia: Yup.string()
            .required('El stock es obligatorio')
    })

    if (loading) return null
    if(error) return null;
    

    const actualizarInfoProducto = async valores => {
        const { nombre, existencia, precio } = valores;

        try {
            const { data } = await actualizarProducto({
                variables: {
                    id,
                    input: {
                        nombre,
                        existencia,
                        precio
                    }
                }
            })

            swal({
                title: "Producto actualizado",
                icon: "success",
                buttons: {
                    catch: {
                        text: 'ok'
                    }
                },
                dangerMode: true,
            })
            router.push('/productos');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Editar Producto</h1>
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>

                    <Formik
                        validationSchema={schemaValidacion}
                        validateOnChange={false}
                        validateOnBlur={false}
                        enableReinitialize
                        initialValues={data.obtenerProducto}
                        onSubmit={valores => {
                            actualizarInfoProducto(valores)
                        }}
                    >

                        {props => {
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
                                            placeholder='Ingresa el nombre del producto'
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
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="existencia">
                                            Stock
                            </label>

                                        <input
                                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                            id='existencia'
                                            type='number'
                                            placeholder='Ingresa el stock del producto'
                                            onChange={props.handleChange}
                                            value={props.values.existencia}
                                        />

                                    </div>

                                    {props.errors.existencia ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.existencia}</p>
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
                                            onChange={props.handleChange}
                                            value={props.values.precio}
                                        />

                                    </div>

                                    {props.errors.precio ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.precio}</p>
                                        </div>
                                    ) : null}

                                    <input
                                        type='submit'
                                        className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 cursor-pointer'
                                        value="guardar cambios"
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

export default EditarProducto;