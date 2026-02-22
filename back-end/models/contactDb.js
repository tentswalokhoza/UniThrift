import { pool } from '../config.js'


 


export const postContactsDb = async (
    name,
    email,
    subject,
    message
) => {
    const query = `
       INSERT INTO contacts
       ( name, email, subject, message)
         VALUES (?, ?, ?, ?);
         `;

    const [result] = await pool.query(query, [
        name,
        email,
        subject,
        message
    ]);

    return result;
};
