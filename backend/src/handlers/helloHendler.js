export const sayHello = (req, res) => {
    res.status(200).json({
        massage: "Hello, Dimas"
    })
}