import mysql2 from "mysql2/promise"

export const pool = mysql2.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "notes_app"
})

export const testConnection = async () => {
    try {
        const connection = await pool.getConnection()
        console.log("database berhasil!")
        connection.release()
    } catch (error) {
        console.error("databases gagal di simpan")
        throw error
    }
}