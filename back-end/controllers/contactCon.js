import { postContactsDb } from "../models/contactDb.js";

export const postContacts = async(req,res) =>{
    try{
        const {
            name,
             email,
              subject,
               message
            } = req.body;

        const result = await postContactsDb(
            name,
             email, 
             subject, 
             message);

        return res.status(201).json({
            message: "Contact submitted successfully", 
            id: result.insertId});
    } catch(err){
        console.error(err);
        return res.status(500).json({
            error: "Error submitting contact"
        });
    }
};