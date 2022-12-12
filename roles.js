const { pick } = require("lodash");

const roles = [

    {
        role: "librarian",
        isAdmin: true
    },


    {
        role: "babu",
        isAdmin: false
    },


    {
        role: "student",
        isAdmin: false
    },



]


const isValidRole = (value) => {

    // Convert the input string to lowercase
    value = value.toLowerCase();

    return roles.some(el => el.role == value);


}

const isAdmin = (role) => {
    role = role.toLowerCase();

    if (isValidRole(role)) {
        let bhabu = roles.some(r => r.isAdmin && r.role == role)

        return bhabu;
    }

    return false;
}

const getAllRoles = () => {
    // Map out all the values
    return roles.map(e => e.role)



}


module.exports = {
    isValidRole,
    isAdmin,
    getAllRoles
}