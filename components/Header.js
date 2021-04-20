import React from 'react'
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const OBTENER_USUARIO = gql`
query obtenerUsuario{
    obtenerUsuario{
        id
        email   
        nombre
        apellido
        creado           
    }
}
`;

const Header = () => {

    const router = useRouter();

    // Query de apollo

    const { data, loading, error, client } = useQuery(OBTENER_USUARIO);
 
    
 
    // Proteger que no accedamos a data antes de tener resultados
    if(loading) return <p>Cargando...</p>;
 
    // Si no hay información
    if(!data){
        return router.push('login');
    }
 
    const { email } = data.obtenerUsuario; 
 
    const cerrarSesion = () => {
        localStorage.removeItem('token');
        client.clearStore();
        router.push('/login');
    }

    return (
        <div className='sm:flex sm:justify-end sm:text-center'>
            <p className='mr-2 text-center lg:text-left'>{email}</p>
            <button
                className='bg-blue-800 py-2 px-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold  lg:w-auto text-center'
                type='button'
                onClick={() => cerrarSesion()}
            >
                Cerrar Sesión
            </button>
        </div>
    );
}

export default Header;