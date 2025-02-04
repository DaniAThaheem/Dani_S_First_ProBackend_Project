class ApiError extends Error{
    constructor(
        status,
        message = "Something went wrong",
        error= [],
        stack = ''
    ){
        super(message)
        this.stack = status,
        this.data = null,
        this.success = false,
        this.error = error,
        this.message = message
        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}


export {ApiError}