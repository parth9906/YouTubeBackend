const asyncHandler = ( func ) => {
    return async ( req, res, next ) => {
        try {
            await func(req, res, next); 

        } catch ( error ) {
            res.status(error.statusCode || 500)
            .json({
                success: false,
                message: error.message,
            })
        }
    }
}

export { asyncHandler };


// const asyncHandler1 = ( fn ) =>{
//     return ( req, res, next ) => {
//         Promise.resolve(fn( req, res, next ))
//         .catch(( error ) => {
//             next( error );
//         })
//     }
// }