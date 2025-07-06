const { AccountModel } = require("../models/account.model");
const bcrypt = require("bcryptjs")


const createAccount = async (req, res) => {
    try {
        let { email, password, role, name, phone } = req.body;

        let findUser = await AccountModel.findOne({ email });
        if (findUser) {
            return res.status(400).json({ msg: "Account already exists", code: 400 });
        }

        let hash = await bcrypt.hash(password, 10);
        let result = await AccountModel.create({
            email,
            password: hash,
            role,
            name,
            phone
        });

        return res.status(200).json({ data: result, msg: "Account Created", status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};


const loginAccount = async (req, res) => {
    try {
        let { email, password, } = req.body
        let findUser = await AccountModel.findOne({ email })
        if (!findUser) {
            return res.status(400).json({ data: null, msg: "Account not exits", code: 400 })
        }
        else if (findUser?.accountBlocked) {
            return res.status(400).json({ data: null, msg: "Account has been deleted", code: 400 })
        }
        else {
            let compare = await bcrypt.compare(password, findUser.password)
            if (compare) {
                return res.status(200).json({ data: findUser, msg: "Login Sucessful", code: 200 })
            }
            else {
                return res.status(403).json({ data: null, msg: "Invalid credentails", code: 403 })
            }
        }
    }
    catch (error) {
        console.log(error)
    }
}

const deleteAccount = async (req, res) => {
    try {
        let { id } = req.params
        await AccountModel.findByIdAndUpdate(id, { accountBlocked: true })
        return res.status(200).json({ data: null, msg: "Account Deleted", code: 200 })
    }
    catch (error) {
        console.log(error)
    }
}
const reactivateAccount = async (req, res) => {
    try {
        let { id } = req.params
        await AccountModel.findByIdAndUpdate(id, { accountBlocked: false })
        return res.status(200).json({ data: null, msg: "Account Activated", code: 200 })
    }
    catch (error) {
        console.log(error)
    }
}

const getAccountById = async (req, res) => {
    try {
        let findUser = await AccountModel.findById(req.params.id)
        return res.status(200).json({ data: findUser, code: 200 })
    }
    catch (error) {
        console.log(error)
    }
}
const getAllAccount = async (req, res) => {
    try {
        let findUser = await AccountModel.find()
        return res.status(200).json({ data: findUser, code: 200 })

    }
    catch (error) {
        console.log(error)
    }
}

const uploadPicture = async (req, res) => {

}
module.exports = { uploadPicture, createAccount, loginAccount, getAccountById, getAllAccount, deleteAccount, reactivateAccount }
