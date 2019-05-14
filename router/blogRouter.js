const express = require('express');
const router = express.Router();
const blogDao = require('../dao/blogDao');
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator/check');
const {errorMiddleware} =require('../middlewares/middlewareUtil');
const objectUtil = require('../util/objectUtil');
const {passport,isLoggedIn} =require('../middlewares/middlewareUtil')

router.post('*',isLoggedIn);
router.put('*',isLoggedIn);
router.delete('*',isLoggedIn);
router.use(bodyParser.json());
router.use(errorMiddleware);
router.get("/", (req, res) => {
    blogDao.findAll().then(blogs => {
        res.send(blogs);
    })
})

router.get("/:blogId", (req, res) => {
    blogDao.findById(req.params.blogId).then(blog => {
        if (blog) {
            return res.send(blog);
        }
        else {
            return res.status(404).json({message:"not found"});
        }
    });
})

router.post("/", blogDao.checkPost, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    let body = req.body;
    blogDao.insert(body).then(() => {
        return res.status(200).json({status: "success"});
    })
})

router.put("/:blogId",blogDao.checkPut,(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    let blogId=req.params.blogId;
    let body=req.body;
    body.id=blogId;
    let blogInput=objectUtil.assignOwnProperty(new blogDao.model(),body);
    blogDao.updateById(blogInput).then(updateResult =>{
        res.json({status:"success"});
    }).catch(e =>{
        console.log(e);
        res.json({status:"error"});
    });
})

router.delete("/:blogId",blogDao.checkDelete,(req,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    let blogId=req.params.blogId;
    blogDao.deleteById(blogId).then(deleteResult =>{
        res.json({status:"success"});
    }).catch(e =>{
        console.log(e);
        res.json({status:"error"});
    })
})
module.exports = router;