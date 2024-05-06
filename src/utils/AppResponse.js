class AppResponse{
    constructor(
        statusCode=200,
        data=null,
        error=null,
    ){
        this.success = statusCode < 400;
        this.statusCode = statusCode;
        this.data = data;
        this.error = error;
    }
}

export { AppResponse }