export class CityNotInformedError extends Error {
    constructor() {
        super('City is needed to list pets.')
    }
}
