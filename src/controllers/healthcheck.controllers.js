import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async(req, res)=>{
    return res
    .statusCode(200)
    .json(
        new ApiResponse(
            200,
            null,
            "Application is running"
        )
    )
})

export{
    healthcheck
}