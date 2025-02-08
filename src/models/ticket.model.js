import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    nroComp: String,
    fecha: Date,
    detalle: [],
    total: Number,
    comprador: String
}, { timestamps: true });

const TicketModel = mongoose.model('Ticket', ticketSchema);

export default TicketModel;