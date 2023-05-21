import { OngsRepository } from '@/repositories/ongs-repository'
import { Ong } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface OngProfileUseCaseRequest {
    id: string
}

interface OngProfileUseCaseResponse {
    ong: Ong
}

export class OngProfileUseCase {
    constructor(
        private ongsRepository: OngsRepository
    ) {}

    async execute(data: OngProfileUseCaseRequest): Promise<OngProfileUseCaseResponse> {
        const { id } = data

        const ong = await this.ongsRepository.findById(id)
        if (!ong) throw new ResourceNotFoundError()

        return { ong }
    }
}
