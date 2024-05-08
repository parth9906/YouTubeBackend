class AppResponse{
    constructor(
        statusCode=200,
        data=null,
        message=null,
    ){
        this.success = statusCode < 400;
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }
}

export { AppResponse }