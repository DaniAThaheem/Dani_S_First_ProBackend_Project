const asyncHandler = (requestHandler)=>{
    return async(error, req, res, next)=>{
        await requestHandler(error, req, res, next)
        .catch((error)=>{
            next(error)
        })
    }
}


/*
const asyncHandler = (requestHandler)=>(error, req, res, next)=>{
    Promise.resolve(requestHandler(error, req, res, next))
    .then(()=>{

    })
    .catch((error)=>{
        next(error);
        
        // res.status(error.statusCode || 400).json({
        //     success: false,
        //     message: 'Bad Request'
        // })
        
        

    })
}
*/

export {asyncHandler}