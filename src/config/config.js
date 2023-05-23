import dotenv from 'dotenv'

dotenv.config()


export default {
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    private_key: process.env.PRIVATE_KEY,
    user_status1: process.env.USER_STATUS1,
    user_status2: process.env.USER_STATUS2,
    developer: process.env.DEVELOPER,
    google_clientID: process.env.GOOGLE_CLIENTID,
    google_clientSecret: process.env.GOOGLE_CLIENTSECRET,
    mongo_session_secret: process.env.MONGO_SESSION_SECRET,
    nodemailer_user: process.env.NODEMAILER_USER,
    nodemailer_pass: process.env.NODEMAILER_PASS
}