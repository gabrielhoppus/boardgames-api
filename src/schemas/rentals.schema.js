import joi from 'joi'

export const rentalSchema = joi.object ({
    customerId: joi.number().required().positive(),
    gameId: joi.number().required().positive(),
    daysRented: joi.number().required().positive(),
})