import * as repository from "@/repositories/tickets-repository"
import { TicketType } from "@prisma/client"
export async function getTicketsType(userId:number):Promise<[] | TicketType> {
    const result = await repository.getTicketsType(userId)
    if(!result){
        return []
    }
    return result
}