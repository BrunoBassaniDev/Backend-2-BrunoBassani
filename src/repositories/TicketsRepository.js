import TicketModel from "../models/ticket.model.js";

export class TicketsRepository {
    static async createTicket(ticket) {
        return TicketModel.create(ticket);
    }
}