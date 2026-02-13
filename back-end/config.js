//connection with pool
import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
    user: 'root',
    host: 'localhost', 
    database: 'unithrift',
    password: 'Yaqoob_sams1'
})