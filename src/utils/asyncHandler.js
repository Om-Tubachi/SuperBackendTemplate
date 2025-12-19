// const asyncHandler = (requestHandler) => {
//     return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
//     }
// }


const asyncHandler = (fn) => async (req, res, next) => {
    try {
        const response = await fn(req, res, next)
        return response
    } catch (error) {
        res.status(500 || error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}
export { asyncHandler }




// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}

