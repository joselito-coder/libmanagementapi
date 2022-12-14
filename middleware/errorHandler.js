const { CustomAPIError } = require("../errors/customError");


const errorHandlerMiddleware = (err,req,res,next) =>{

    if(err instanceof CustomAPIError){

        let errorMessage = err.message.replaceAll('"','~')

        return res.status(err.statusCode).json({error: errorMessage})
    }


    return res.status(500).json({error:err.message});

}


module.exports = errorHandlerMiddleware