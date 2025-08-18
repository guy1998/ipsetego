
const internalServerError = () => {
    return { status: 503, data: { message: "Internal server error!" }};
}

const dataLessResponse = (status, message) => {
    return { status, data: { message } }
}

const responseWithData = (status, message, data) => {
    return { status, data: { message, data }};
}

module.exports = {
    internalServerError,
    dataLessResponse,
    responseWithData
}