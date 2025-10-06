import mysql2 from "mysql2/promise"

export const pool = mysql2.createPool({
    host: "sql12.freesqldatabase.com",
    user: "sql12801506",
    password: "HJdfWImsli",
    database: "sql12801506",
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
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