const { body, validationResult } = require("express-validator")
const bcrypt = require("bcrypt")
const prisma = require("../prisma_client/prisma_client")
const CustomError = require("../middleware/customError")

//SIGN UP
const validateSignUp = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username cannot be empty")
    .isLength({ min: 2, max: 20 })
    .withMessage(`Username has to be between 2 and 20 characters long`)
    .custom(async (username) => {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      })
      if (user) {
        throw new Error("Username already in use")
      }
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(`Password cannot be empty`)
    .isLength({ min: 8, max: 30 })
    .withMessage(`Password has to be between 8 and 30 characters long`),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage(`Confirmation password cannot be empty`)
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match")
      }
      return value === req.body.password
    })
    .isLength({ min: 8, max: 30 })
    .withMessage(`Password has to be between 8 and 30 characters long`),
]

exports.adminSignUpPost = [
  validateSignUp,
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
      }
      const { username, password } = req.body
      const hashedPassword = await bcrypt.hash(password, 10)
      await prisma.user.create({
        data: {
          username: username,
          password: hashedPassword,
        },
      })
      res.json("Sign up succesful")
    } catch (e) {
      switch (e.code) {
        case "P2002":
          // handling duplicate key errors
          throw new CustomError(`Duplicate field value: ${e.meta.target}`, 400)
        case "P2014":
          // handling invalid id errors
          throw new CustomError(`Invalid ID: ${e.meta.target}`, 400)
        case "P2003":
          // handling invalid data errors
          throw new CustomError(`Invalid input data: ${e.meta.target}`, 400)
        default:
          // handling all other errors
          throw new CustomError(`Something went wrong: ${e.message}`, 500)
      }
    }
  },
]
