const Joi=require('joi'); 

module.exports.ListingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().min(0).required(),
        image: Joi.object({
          filename: Joi.string().default("defaultimage.jpg").allow(""),
          url: Joi.string()
             .default("https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg")
             .allow("")
          }).default({
         filename: "defaultimage.jpg",
         url: "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"
})

        

    }).required()

})

module.exports.reviewSchema=Joi.object({
        review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),

    }).required()
})