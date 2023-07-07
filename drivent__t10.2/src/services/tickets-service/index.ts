import * as repository from "@/repositories/tickets-repository"
export async function getTicketsType() {
    const result = await repository.getTicketsType()
    return result
}