import Layout from '../components/Layout';
import Link from 'next/link';
import Pedido from '../components/Pedido';

import { gql, useQuery } from '@apollo/client';


const OBTENER_PEDIDOS = gql`
  query obtenerPedidosVendedor {
    obtenerPedidosVendedor {
      id
      pedido {
        id
        cantidad
        nombre
      }
      cliente {
        id
        nombre
        apellido
        email
        telefono
      }
      vendedor
      total
      estado
    }
  }
`;

const Pedidos = () => {

  const { data, loading, error } = useQuery(OBTENER_PEDIDOS);

  if (loading || error) return null;

  const { obtenerPedidosVendedor } = data;

  return (
    <div>
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Pedidos</h1>

        <Link href='/nuevopedido'>
          <a className='bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold'>Nuevo Pedido</a>
        </Link>

        {obtenerPedidosVendedor.length !== 0 ? (
          obtenerPedidosVendedor.map(pedido => (
            <Pedido
              key={pedido.id}
              pedido={pedido}
            />
          ))
        ) : (
            <p className='mt-5 text-center text-2xl'>Aún no hay pedidos</p>
          )}

      </Layout>
    </div>
  );
}

export default Pedidos;