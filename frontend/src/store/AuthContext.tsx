import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
    id: number
    name: string
    email: string,
    username: string,
    bio: string,
    location: string,
    followers: number,
    following: number,
    created_at: Date,
    avatar: string,
    banner: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    loading: boolean
    isAuthenticated: boolean
    login: (userData: User, jwtToken: string) => void
    logout: () => void,
    update_user: (userData: User) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser) as User)
        }
        setLoading(false)
    }, [])

    const login = (userData: User, jwtToken: string) => {
        setUser(userData)
        setToken(jwtToken)
        localStorage.setItem("token", jwtToken)
        localStorage.setItem("user", JSON.stringify(userData))
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
    }

    const update_user = (userData: User) => {
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
    }

    return (
        <AuthContext.Provider value={{
            user, token, loading, update_user,
            isAuthenticated: !!token,
            login, logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider")
    return context
}