import { rejects } from 'assert';
import jwt from 'jsonwebtoken';

export const signToken = ( _id: string, email: string ) => {

    if ( !process.env.JWT_SECRET_SEED )
        throw new Error('No hay semilla de JWT - Revisar env')

    return jwt.sign( 
        //payload
        { _id, email },

        //Seed
        process.env.JWT_SECRET_SEED,

        //options
        { expiresIn: '1d' }
    );
};

export const isValidToken = async ( token: string ) : Promise<string> => {
    if ( !process.env.JWT_SECRET_SEED )
        throw new Error('No hay semilla de JWT - Revisar env')

    return new Promise( ( resolve, reject ) => {
        try {
            
            jwt.verify(token, process.env.JWT_SECRET_SEED || '', (err, payload) => {
                if (err) return reject( 'JWT no es valido' );

                const { _id } = payload as { _id: string };
                resolve(_id);
            });

        } catch (error) {
            reject( 'JWT no es valido' );
        }
    });
}