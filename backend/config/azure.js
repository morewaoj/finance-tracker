module.exports = {
    port: process.env.PORT || 3000,
    database: {
        host: process.env.AZURE_MYSQL_HOST,
        user: process.env.AZURE_MYSQL_USER,
        password: process.env.AZURE_MYSQL_PASSWORD,
        database: process.env.AZURE_MYSQL_DATABASE
    },
    jwt: {
        secret: process.env.JWT_SECRET
    }
};