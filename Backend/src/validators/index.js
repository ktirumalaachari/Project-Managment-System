import { body } from "express-validator";
import {AvailableUserRole} from "../utils/constants.js"

const userRegisterValidator = () =>{
    return[
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is not valid")
        .normalizeEmail(),

        body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({min: 3})
        .withMessage("Username must be at least 3 characters long"),
        
        body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({min: 6})
        .withMessage("Password must be at least 6 characters long"),
        
        body("fullname")
        .trim()
        .notEmpty()
        .withMessage("Fullname is required")
        .isLength({min: 3})
        .withMessage("Fullname must be at least 3 characters long")
    ]
}

const userLoginValidator = () =>{
    return[
        body("email").optional()
        .isEmail()
        .withMessage("Email is not valid")
        .normalizeEmail(),
        body("password")
        .notEmpty()
        .isLength({min: 6})
        .withMessage("Password must be at least 6 characters long")
    ]
}

const userChangeCurrentPasswordValidator = () =>{
    return[
        body("oldPassword")
        .notEmpty()
        .withMessage("Password is required"),
        
        body("newPassword")
        .notEmpty()
        .isLength({min: 6})
        .withMessage("Password must be at least 6 characters long"),
        body("fullname")
        .optional()
        .isLength({min: 3})
        .withMessage("Fullname must be at least 3 characters long")
    ]
}

const userForgotPasswordValidator = () =>{
    return[
        body("email")
        .notEmpty()
        .withMessage("Email is required"),
        
        body("newPassword")
        .notEmpty()
        .isLength({min: 6})
        .withMessage("Password must be at least 6 characters long")
    ]
}

const userResetForgotPasswordValidator = () =>{
    return[
        body("email")
        .notEmpty()
        .withMessage("Email is required"),
        
        body("newPassword")
        .notEmpty()
        .isLength({min: 6})
        .withMessage("Password must be at least 6 characters long")
    ]
}

const createProjectValidator = () =>{
    return[
        body("name")
        .notEmpty()
        .withMessage("Project name is required"),

        body("description")
        .optional()

    ]
}

const addMembertoProjectValidator = () =>{
    return[
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is not valid"),
        body("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(AvailableUserRole)
        .withMessage("Role is Invalid"),
    ]
}

const updateProjectValidator = () =>{
    return[
        body("name")
        .optional()
        .notEmpty()
        .withMessage("Project name cannot be empty"),
        body("description")
        .optional()
    ]
}

const updateMemberRoleValidator = () =>{
    return[
        body("newRole")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(AvailableUserRole)
        .withMessage("Role is Invalid"),
    ]
}

const deleteMemberRoleValidator = () =>{
    return[
        body("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(AvailableUserRole)
        .withMessage("Role is Invalid"),
    ]
}

const projectParamsValidator = () =>{
    return[]
}

export{
    userRegisterValidator,
    userLoginValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator,
    createProjectValidator,
    addMembertoProjectValidator,
    updateProjectValidator,
    updateMemberRoleValidator,
    deleteMemberRoleValidator,
    projectParamsValidator
}