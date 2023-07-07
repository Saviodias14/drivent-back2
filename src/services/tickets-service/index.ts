import * as repository from "@/repositories/tickets-repository"
import { TicketType } from "@prisma/client"
export async function getTicketsType():Promise<[] | TicketType[]> {
    const result = await repository.getTicketsType()
    if(!result){
        return []
    }
    return result
}