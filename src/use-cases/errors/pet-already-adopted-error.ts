export class PetAlreadyAdopted extends Error {
    constructor() {
        super('Pet already adopted.')
    }
}
