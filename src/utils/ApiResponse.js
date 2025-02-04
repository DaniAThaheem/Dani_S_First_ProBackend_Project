class ApiResponse {
    constructor(
        status,
        message,
        data
    ){
        this.status = status,
        this.data = data,
        this.message = message,
        this.success = status<400
    }
}

export {ApiResponse}