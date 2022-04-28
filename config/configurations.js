module.exports = {
    DATABASE_URI: process.env.DATABASE_URI || 'mongodb+srv://<username>:<password>@cluster0.sguai.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    PORT: process.env.PORT || 3000,
}