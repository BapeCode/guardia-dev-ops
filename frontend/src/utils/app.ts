const API_URL = "http://localhost:5000"

const getAvatar = (avatar: string) => {
    return API_URL+"static/uploads/avatars/"+avatar
}

export { API_URL, getAvatar }